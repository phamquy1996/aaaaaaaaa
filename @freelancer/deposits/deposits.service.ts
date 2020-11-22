import { Injectable } from '@angular/core';
import { Auth } from '@freelancer/auth';
import { CCFormExtraPayload } from '@freelancer/billing';
import { ResponseData } from '@freelancer/datastore';
import { BackendErrorTypes } from '@freelancer/datastore/backend-error.types';
import { FreelancerHttp } from '@freelancer/freelancer-http';
import { Location } from '@freelancer/location';
import {
  OverlayTypes,
  PaymentsErrorType,
  PaymentsEventType,
  PaymentsMessagingService,
  PaymentsResultStatus,
} from '@freelancer/payments-messaging';
import { PaymentsPopUpService } from '@freelancer/payments-popup';
import { PaymentsUtils } from '@freelancer/payments-utils';
import { Pwa } from '@freelancer/pwa';
import { Tracking } from '@freelancer/tracking';
import { assertNever, toNumber } from '@freelancer/utils';
import {
  InAppBrowser,
  InAppBrowserObject,
} from '@laurentgoudet/ionic-native-in-app-browser/ngx';
import {
  DepositConfirmResponseApi,
  DepositMethodApi,
  DepositRequestActionApi,
  DepositRequestApi,
  DepositRequestConfirmationApi,
  ReferenceDepositRequestApi,
  ThreedsCapabilityApi,
  ThreedsDataApi,
  ThreedsResponseDataApi,
} from 'api-typings/payments/payments';
import * as Rx from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { ThreeDsBaseContext } from './deposits.model';
import {
  ThreeDSContext,
  ThreeDSMessageType,
  ThreeDSState,
} from './deposits.types';

/**
 * Form data item
 */
export interface FormDataItem {
  name: string;
  value: string;
}

@Injectable({
  providedIn: 'root',
})
export class Deposits {
  private inAppBrowserExitSubscription?: Rx.Subscription;
  private inAppBrowserMessageSubscription?: Rx.Subscription;
  private browser: InAppBrowserObject;
  private threeDSCtx?: ThreeDSContext;
  private threeDSPopUp: Window;
  constructor(
    private auth: Auth,
    private freelancerHttp: FreelancerHttp,
    private paymentsMessaging: PaymentsMessagingService,
    private paymentsUtils: PaymentsUtils,
    private location: Location,
    private inAppBrowser: InAppBrowser,
    private pwa: Pwa,
    private popUpService: PaymentsPopUpService,
    private tracking: Tracking,
  ) {}

  deposit(payload: DepositRequestApi) {
    return this.auth.getUserId().pipe(
      switchMap(userId =>
        this.freelancerHttp.post<DepositRequestActionApi>(
          'payments/0.1/deposits',
          { ...payload, user_id: toNumber(userId) },
        ),
      ),
      take(1),
    );
  }

  depositUpdate(payload: DepositRequestConfirmationApi) {
    return this.auth.getUserId().pipe(
      switchMap(userId =>
        // Response is {status: 'success', requestId: ...}
        this.freelancerHttp.put<
          DepositConfirmResponseApi,
          BackendErrorTypes['deposit_confirm']
        >('payments/0.1/deposits', {
          ...payload,
          user_id: toNumber(userId),
        }),
      ),
      take(1),
    );
  }

  authorization(
    depositMethod: DepositMethodApi,
    billingAgreementId: string,
    amount: number,
    depositCurrencyId: number,
    paymentCurrencyId: number,
    threatMetrixSessionId: string,
    trackingToken: string,
    cartId?: number,
    creditCardGateway?: string,
  ) {
    return this.auth.getUserId().pipe(
      switchMap(userId => {
        const payload = this.getAuthorizationPayload(
          toNumber(userId),
          depositMethod,
          billingAgreementId,
          amount,
          depositCurrencyId,
          paymentCurrencyId,
          threatMetrixSessionId,
          trackingToken,
          creditCardGateway,
          cartId,
        );
        // Response is {status: 'success', requestId: ...}
        return this.freelancerHttp.put<undefined>(
          'payments/0.1/authorization',
          payload,
        );
      }),
      take(1),
    );
  }

  /**
   * This should be the ultimate method for constructing the deposit call payload.
   * FIXME: maybe "ultimate" but unused?
   *
   * TODO: replace the methods.component `genericPayload` functionality with this.
   */
  /* private getDepositPayload(
    userId: number,
    depositMethod: DepositMethodApi,
    action: string,
    amount: number,
    currencyId: number,
    backUrl?: string,
    cancelUrl?: string,
    trackingToken?: string,
    threatmetrixSession?: string,
    countryCode?: string,
    creditCardGateway?: string,
    boletoInfo?: BoletoInfoApi,
  ): DepositRequestApi {
    return {
      user_id: userId,
      deposit_method: depositMethod,
      action,
      back_url: backUrl,
      cancel_url: cancelUrl,
      amount,
      currency_id: currencyId,
      credit_card_gateway: creditCardGateway,
      domain: '',
      tracking_token: trackingToken,
      threatmetrix_session: threatmetrixSession,
      country_code: countryCode,
      boleto_info: boletoInfo,
    };
  }*/

  /**
   * Populates the browser info fields in CCFormExtraPayload.
   * *Note* Adopted from https://github.com/Adyen/adyen-3ds2-js-utils
   *
   * @param extraPayLoad CCFormExtraPayload object to populate.
   */
  populateBrowserInfo(extraPayLoad: CCFormExtraPayload): CCFormExtraPayload {
    const screen = window && window.screen;
    const navigator = window && window.navigator;
    const language = navigator && navigator.language;

    return {
      ...extraPayLoad,
      browserScreenWidth: screen ? screen.width.toString() : '',
      browserScreenHeight: screen ? screen.height.toString() : '',
      browserColourDepth: screen ? screen.colorDepth.toString() : '',
      browserTZoneOffset: new Date().getTimezoneOffset().toString(),
      browserLanguage: language ? language.toString() : '',
      browserJavaEnabled: navigator?.javaEnabled()?.toString() ?? 'false',
      browserJScriptEnabled: 'true',
    };
  }

  /**
   * Creates a ThreeDSContext object based on the  received ThreedsDataApi.
   *
   * @param threeDSApiData 3DS data field in the response payload to the
   *                       DepositConfirm API request.
   */
  createThreeDSContext(
    threeDSApiData: ThreedsDataApi,
    currentCtx?: ThreeDSContext,
  ): ThreeDSContext | undefined {
    const curState = currentCtx ? currentCtx.type : undefined;

    if (
      !threeDSApiData.threeds_state ||
      !threeDSApiData.invoice_id ||
      !threeDSApiData.credit_card_gateway
    ) {
      return;
    }

    const baseCtx: ThreeDsBaseContext = {
      ccGateway: threeDSApiData.credit_card_gateway,
      invoiceId: threeDSApiData.invoice_id,
      fxTransId: threeDSApiData.fx_transaction_id,
      requestAmount: threeDSApiData.request_amount,
    };

    switch (threeDSApiData.threeds_state) {
      case ThreeDSState.REDIRECT: {
        if (!curState || curState === ThreeDSState.IDENTIFY) {
          const redirectData = threeDSApiData.redirect_flow_data;
          if (!redirectData) {
            return;
          }

          return {
            ...baseCtx,
            type: ThreeDSState.REDIRECT,
            issuerUrl: redirectData.issuer_url,
            issuerReturnUrl: redirectData.issuer_return_url,
            paRequest: redirectData.payer_authentication_request,
            merchantData: redirectData.merchant_data,
            echoData: redirectData.echo_data,
            cookieData: redirectData.cookie_data,
          };
        }
        break;
      }

      case ThreeDSState.IDENTIFY: {
        if (!curState) {
          const identifyData = threeDSApiData.identify_flow_data;
          if (!identifyData) {
            return;
          }

          return {
            ...baseCtx,
            type: ThreeDSState.IDENTIFY,
            serverTransID: identifyData.server_transaction_id,
            issuerUrl: identifyData.issuer_url,
            issuerReturnUrl: identifyData.issuer_return_url,
            threeDS2token: identifyData.threeds2_token,
          };
        }
        break;
      }

      case ThreeDSState.CHALLENGE: {
        if (!curState || curState === ThreeDSState.IDENTIFY) {
          const challengeData = threeDSApiData.challenge_flow_data;
          if (!challengeData) {
            return;
          }

          return {
            ...baseCtx,
            type: ThreeDSState.CHALLENGE,
            serverTransID: challengeData.server_transaction_id,
            acsTransID: challengeData.acs_transaction_id,
            messageVersion: challengeData.message_version,
            messageType: challengeData.message_type,
            issuerUrl: challengeData.issuer_url,
            threeDS2token: challengeData.threeds2_token,
          };
        }
        break;
      }
      default:
    }
  }

  /**
   * Initial 3DS flow
   *
   * @param context
   */
  initiate3DSFlow(
    context: ThreeDSContext,
    confirmation: DepositRequestConfirmationApi,
  ) {
    switch (context.type) {
      case ThreeDSState.REDIRECT: {
        const formItems: FormDataItem[] = [
          { name: 'PaReq', value: context.paRequest },
          { name: 'TermUrl', value: context.issuerReturnUrl },
          { name: 'IsModal', value: 'true' },
        ];
        if (context.merchantData) {
          formItems.push({ name: 'MD', value: context.merchantData });
        }
        this.setupAndPostForm(context.issuerUrl, formItems, confirmation);

        break;
      }

      case ThreeDSState.IDENTIFY: {
        const dataObj = {
          threeDSServerTransID: context.serverTransID,
          threeDSMethodNotificationURL: context.issuerReturnUrl,
        };

        const encodedJSON = this.encodeBase64URL(JSON.stringify(dataObj));

        const formItems: FormDataItem[] = [
          { name: 'threeDSMethodData', value: encodedJSON },
        ];

        this.setupAndPostForm(context.issuerUrl, formItems, confirmation);

        break;
      }

      case ThreeDSState.CHALLENGE: {
        // The `challengeWindowSize` describes the popup window (dimensions?) to
        // the issuer. Can be any of the following flags:
        //   01 - 250px x 400px
        //   02 - 390px x 400px
        //   03 - 500px x 600px
        //   04 - 600px x 400px
        //   05 - 100%  x 100%
        const dataObj = {
          threeDSServerTransID: context.serverTransID,
          acsTransID: context.acsTransID,
          messageVersion: context.messageVersion,
          challengeWindowSize: '05',
          messageType: context.messageType,
        };

        const encodedJSON = this.encodeBase64URL(JSON.stringify(dataObj));

        const formItems: FormDataItem[] = [
          { name: 'creq', value: encodedJSON },
        ];

        this.setupAndPostForm(context.issuerUrl, formItems, confirmation);

        break;
      }

      default:
        return assertNever(context);
    }
    //
  }

  /**
   * Create 3DS context for different 3DS state
   *
   * @param context
   * @param eventData
   */
  constructThreeDSResponseApiData(
    context: ThreeDSContext,
    eventData: MessageEvent['data'],
  ): ThreedsResponseDataApi {
    const baseResponseData = {
      threeds_state: context.type,
      fx_transaction_id: context.fxTransId,
      request_amount: context.requestAmount,
    };

    switch (context.type) {
      case ThreeDSState.REDIRECT:
        return {
          ...baseResponseData,
          redirect_flow_results: {
            payer_authentication_response: eventData.paresult,
            merchant_data: context.merchantData,
            echo_data: context.echoData,
            cookie_data: context.cookieData,
          },
        };

      case ThreeDSState.IDENTIFY:
        return {
          ...baseResponseData,
          identify_flow_results: {
            server_transaction_id: eventData.threeDSServerTransID,
            completion_indicator: eventData.threeDSCompInd,
            threeds2_token: context.threeDS2token,
          },
        };

      case ThreeDSState.CHALLENGE:
        return {
          ...baseResponseData,
          challenge_flow_results: {
            server_transaction_id: eventData.threeDSServerTransID,
            transaction_status_indicator: eventData.threeDSTransStatus,
            threeds2_token: context.threeDS2token,
          },
        };

      default:
        return assertNever(context);
    }
  }

  /**
   * Process 'breakTo3ds' events.
   *
   * @remark
   *
   * Depending on the 3ds flow, the backend could send the 'breakTo3ds' event
   * directly to the main window or to the popup window, which then gets
   * posted to the main window. Currently the popup window make sure it's DOM
   * is loaded before dispatching the message to main window. If this process
   * is not followed, a race condition could occur when this routine is
   * modifying popup window's DOM while it is being initialised.
   *
   * @param threeDSPopup The popup window.
   * @param threeDSdata Payload sent with the 'breakTo3ds' event.
   *
   * @privateRemark
   *
   * This is the old 3DS implementation
   *
   * TODO: delete the code below once the deposit flow is moved to API.
   *
   */
  processThreeDSForm(
    threeDSPopup: Window,
    threeDSdata: MessageEvent['data'],
  ): void {
    // Save 3ds data into local storage
    window.localStorage.setItem(
      `cc_data${threeDSdata.invoiceId}`,
      threeDSdata.data,
    );
    window.localStorage.setItem(
      `cc_data_back${threeDSdata.invoiceId}`,
      threeDSdata.backUrl,
    );

    // Set up and submit 3ds form in the popup window
    const returnForm = threeDSPopup.document.createElement('form');
    returnForm.method = 'post';
    returnForm.action = threeDSdata.issuerUrl;

    if (threeDSdata.threeDSState === ThreeDSState.REDIRECT) {
      this.addFormItem(
        threeDSPopup,
        returnForm,
        'PaReq',
        threeDSdata.parequest,
      );
      this.addFormItem(
        threeDSPopup,
        returnForm,
        'TermUrl',
        threeDSdata.returnUrl,
      );
      this.addFormItem(threeDSPopup, returnForm, 'IsModal', 'true');
      if (threeDSdata.md) {
        this.addFormItem(threeDSPopup, returnForm, 'MD', threeDSdata.md);
      }
    } else if (threeDSdata.threeDSState === ThreeDSState.IDENTIFY) {
      window.localStorage.setItem(
        `cc_data_3ds2token${threeDSdata.invoiceId}`,
        threeDSdata.threeDS2Token,
      );

      const dataObj = {
        threeDSServerTransID: threeDSdata.threeDSServerTransID,
        threeDSMethodNotificationURL: threeDSdata.returnUrl,
      };

      const encodedJSON = this.encodeBase64URL(JSON.stringify(dataObj));
      this.addFormItem(
        threeDSPopup,
        returnForm,
        'threeDSMethodData',
        encodedJSON,
      );
    } else if (threeDSdata.threeDSState === ThreeDSState.CHALLENGE) {
      window.localStorage.setItem(
        `cc_data_3ds2token${threeDSdata.invoiceId}`,
        threeDSdata.threeDS2Token,
      );

      // The `challengeWindowSize` describes the popup window (dimensions?) to
      // the issuer. Can be any of the following flags:
      //   01 - 250px x 400px
      //   02 - 390px x 400px
      //   03 - 500px x 600px
      //   04 - 600px x 400px
      //   05 - 100%  x 100%
      const dataObj = {
        threeDSServerTransID: threeDSdata.threeDSServerTransID,
        acsTransID: threeDSdata.threeDSAcsTransID,
        messageVersion: threeDSdata.threeDSMsgVersion,
        challengeWindowSize: '05',
        messageType: threeDSdata.threeDSMsgType,
      };

      const encodedJSON = this.encodeBase64URL(JSON.stringify(dataObj));
      this.addFormItem(threeDSPopup, returnForm, 'creq', encodedJSON);
    }

    threeDSPopup.document.body.appendChild(returnForm);
    returnForm.submit();
  }

  /**
   * Process 'returnFrom3DS' events.
   *
   * The backend sends the 'returnFrom3DS' events to the popup window, which
   * then gets posted to the main window. Currently the popup window make sure
   * it's DOM is loaded before dispatching the message to main window. If this
   * process is not followed, a race condition could occur when this routine is
   * modifying popup window's DOM while it is being initialised.
   *
   * @param threeDSPopup The popup window.
   * @param eventData Payload sent with the 'returnFrom3DS' event.
   */
  processPostThreeDS(
    threeDSPopup: Window,
    eventData: MessageEvent['data'],
  ): void {
    // Retrieve data saved in
    const data = window.localStorage.getItem(`cc_data${eventData.invoiceId}`);
    localStorage.removeItem(`cc_data${eventData.invoiceId}`);
    const back = window.localStorage.getItem(
      `cc_data_back${eventData.invoiceId}`,
    );
    window.localStorage.removeItem(`cc_data_back${eventData.invoiceId}`);

    // Submit post-3ds form in the popup window
    const returnForm = threeDSPopup.document.createElement('form');
    returnForm.method = 'post';
    returnForm.action = back || '';

    this.addFormItem(threeDSPopup, returnForm, 'fielddummy', '');
    this.addFormItem(
      threeDSPopup,
      returnForm,
      'invoice_id',
      eventData.invoiceId,
    );
    this.addFormItem(
      threeDSPopup,
      returnForm,
      'data',
      decodeURIComponent(data || ''),
    );

    if (eventData.threeDSState === ThreeDSState.REDIRECT) {
      this.addFormItem(threeDSPopup, returnForm, 'PaRes', eventData.paresult);
    } else if (eventData.threeDSState === ThreeDSState.IDENTIFY) {
      const threeDS2Token = window.localStorage.getItem(
        `cc_data_3ds2token${eventData.invoiceId}`,
      );
      window.localStorage.removeItem(`cc_data_3ds2token${eventData.invoiceId}`);

      this.addFormItem(
        threeDSPopup,
        returnForm,
        'threeDS2Token',
        threeDS2Token || '',
      );
      this.addFormItem(
        threeDSPopup,
        returnForm,
        'threeDSServerTransID',
        eventData.threeDSServerTransID || '',
      );
      this.addFormItem(
        threeDSPopup,
        returnForm,
        'threeDSCompInd',
        eventData.threeDSCompInd || '',
      );
    } else if (eventData.threeDSState === ThreeDSState.CHALLENGE) {
      const threeDS2Token = window.localStorage.getItem(
        `cc_data_3ds2token${eventData.invoiceId}`,
      );
      window.localStorage.removeItem(`cc_data_3ds2token${eventData.invoiceId}`);

      this.addFormItem(
        threeDSPopup,
        returnForm,
        'threeDS2Token',
        threeDS2Token || '',
      );
      this.addFormItem(
        threeDSPopup,
        returnForm,
        'threeDSServerTransID',
        eventData.threeDSServerTransID || '',
      );
      this.addFormItem(
        threeDSPopup,
        returnForm,
        'threeDSTransStatus',
        eventData.threeDSTransStatus || '',
      );
    }

    threeDSPopup.document.body.appendChild(returnForm);
    returnForm.submit();
  }

  /**
   * Get authorization payload
   *
   * @param userId
   * @param depositMethod
   * @param billingAgreementId
   * @param amount
   * @param depositCurrencyId
   * @param paymentCurrencyId
   * @param threatMetrixSessionId
   * @param trackingToken
   * @param creditCardGateway
   * @param cartId
   */
  private getAuthorizationPayload(
    userId: number,
    depositMethod: DepositMethodApi,
    billingAgreementId: string,
    amount: number,
    depositCurrencyId: number,
    paymentCurrencyId: number,
    threatMetrixSessionId: string,
    trackingToken: string,
    creditCardGateway?: string,
    cartId?: number,
  ): ReferenceDepositRequestApi {
    return {
      user_id: userId,
      deposit_method: depositMethod,
      amount,
      currency_id: depositCurrencyId,
      tracking_token: trackingToken,
      recurring_order_id: billingAgreementId,
      threatmetrix_session: threatMetrixSessionId,
      issuing_currency_id: paymentCurrencyId,
      credit_card_gateway: creditCardGateway,
      cart_id: cartId,
    };
  }

  /**
   * Add a form input element.
   *
   * @param windowObj Window object to use call createElement().
   * @param formElement Existing form element to add the input element.
   * @param inputName  Name of the input element.
   * @param inputValue Value of the input element.
   */
  private addFormItem(
    windowObj: Window,
    formElement: HTMLFormElement,
    inputName: string,
    inputValue: string,
  ): void {
    const dataInput = windowObj.document.createElement('input');
    dataInput.setAttribute('name', inputName);
    dataInput.setAttribute('value', inputValue);
    formElement.appendChild(dataInput);
  }

  /**
   * Construct a html form inside the popup and post it to the target location.
   *
   * @param fromAction
   * @param formData
   */
  private setupAndPostForm(
    formAction: string,
    formData: ReadonlyArray<FormDataItem>,
    confirmation: DepositRequestConfirmationApi,
  ): void {
    if (this.isNative()) {
      this.browser = this.inAppBrowser.create('about:blank', '_blank');
      const script = `
        const htmlForm = document.createElement('form');
        htmlForm.method = 'post';
        htmlForm.action = '${formAction}';
        const formData = ${JSON.stringify(formData)};

        formData.forEach(elem => {
          const dataInput = document.createElement('input');
          dataInput.setAttribute('name', elem.name);
          dataInput.setAttribute('value', elem.value);
          htmlForm.appendChild(dataInput);
        });

        document.body.appendChild(htmlForm);
        htmlForm.submit();
      `;

      this.browser.executeScript({ code: script });
      this.inAppBrowserMessageSubscription = this.browser
        .on('message')
        .subscribe(event => {
          this.processThreeDSFlowPopupResponse(event.data, confirmation);
        });

      this.browser
        .on('exit')
        .pipe(take(1))
        .toPromise()
        .then(event => {
          this.paymentsMessaging.pushEvent({
            eventType: PaymentsEventType.CLOSE_OVERLAY,
          });
          if (this.inAppBrowserMessageSubscription) {
            this.inAppBrowserMessageSubscription.unsubscribe();
          }
        });
    } else if (this.threeDSPopUp) {
      const htmlForm = this.threeDSPopUp.document.createElement('form');
      htmlForm.method = 'post';
      htmlForm.action = formAction;
      formData.forEach(elem => {
        this.addFormItem(this.threeDSPopUp, htmlForm, elem.name, elem.value);
      });
      this.threeDSPopUp.document.body.appendChild(htmlForm);
      htmlForm.submit();
    }
  }

  /**
   * Takes a string and encodes it as a base64url string.
   * *Note* Adopted from https://github.com/Adyen/adyen-3ds2-js-utils
   * @param dataStr Input string object.
   */
  private encodeBase64URL(dataStr: string): string {
    const base64 = btoa(dataStr);
    let base64url = base64.split('=')[0]; // Remove any trailing '='s

    base64url = base64url.replace(/\+/g, '-'); // 62nd char of encoding
    base64url = base64url.replace(/\//g, '_'); // 63rd char of encoding

    return base64url;
  }

  /**
   * Make a deposit request to backend for all payment methods
   *
   * @param payload
   * @param enablePopup
   * @param isNativeApp
   */
  makeDeposit(
    payload: DepositRequestApi,
    enablePopup: boolean,
    isNativeApp: boolean,
  ): void {
    this.deposit(payload)
      .toPromise()
      .then(res => {
        if (res.status === 'error') {
          this.paymentsMessaging.pushError({
            errorType: PaymentsErrorType.ERROR,
            errorCode: res.errorCode,
            eventId: res.requestId,
          });
          return;
        }
        const { url } = res.result;
        if (!url) {
          this.paymentsMessaging.pushError({
            errorType: PaymentsErrorType.ERROR,
          });
          return;
        }
        if (enablePopup) {
          if (isNativeApp) {
            const inAppBrowser = this.inAppBrowser.create(url, '_blank');
            this.inAppBrowserExitSubscription = inAppBrowser
              .on('exit')
              .subscribe(event => {
                this.paymentsMessaging.pushEvent({
                  eventType: PaymentsEventType.CLOSE_OVERLAY,
                });
                if (this.inAppBrowserMessageSubscription) {
                  this.inAppBrowserMessageSubscription.unsubscribe();
                }
                if (this.inAppBrowserExitSubscription) {
                  this.inAppBrowserExitSubscription.unsubscribe();
                }
              });
            this.inAppBrowserMessageSubscription = inAppBrowser
              .on('message')
              .subscribe(event => {
                const message = this.paymentsUtils.handleInterframeDepositResult(
                  event.data,
                );
                if (message) {
                  this.paymentsMessaging.pushMessage(message);
                }
                inAppBrowser.close();
              });
          } else {
            // move Popup logic to this block T218849
          }
        } else if (url.startsWith('https')) {
          this.location.redirect(url);
        } else {
          this.location.navigateByUrl(url);
        }
      });
  }

  /**
   * Temporarily used for checking if it is a native app
   */
  isNative() {
    return this.pwa.isNative();
  }

  /**
   * Process 3DS flow
   *
   * @param eventData
   * @param confirmation
   */
  processThreeDSFlowPopupResponse(
    eventData: MessageEvent['data'],
    confirmation: DepositRequestConfirmationApi,
  ) {
    if (this.threeDSCtx && !eventData.threeDSFailure) {
      const newConfirmation: DepositRequestConfirmationApi = {
        user_id: confirmation.user_id,
        deposit_method: DepositMethodApi.FLN_BILLING,
        fln_billing_data: confirmation.fln_billing_data,
        credit_card_gateway: this.threeDSCtx.ccGateway,
        cart_id: confirmation.cart_id,
        threeds_capability: ThreedsCapabilityApi.VER2,
        invoice_id: this.threeDSCtx.invoiceId,
        tracking_token: confirmation.tracking_token,
        threeds_response_data: this.constructThreeDSResponseApiData(
          this.threeDSCtx,
          eventData,
        ),
        action: confirmation.action,
      };

      this.depositUpdate(newConfirmation)
        .toPromise()
        .then(response => {
          this.processDepositConfirmApiResponse(response, newConfirmation);
        });
    } else {
      this.closeOverlay();
      // No need to emit the error as this.paymentsMessaging service seems
      // to magically receive it.
      if (this.isNative()) {
        this.browser.close();
      } else {
        this.popUpService.closePopUp();
      }
      this.threeDSCtx = undefined;
    }
  }

  /**
   * Close overlay
   */
  closeOverlay() {
    this.paymentsMessaging.pushEvent({
      eventType: PaymentsEventType.CLOSE_OVERLAY,
    });
  }

  /**
   * Process Deposit confirmation from API
   *
   * @param response
   * @param confirmation
   */
  processDepositConfirmApiResponse(
    response: ResponseData<
      DepositConfirmResponseApi,
      BackendErrorTypes['deposit_confirm'] | 'UNKNOWN_ERROR'
    >,
    confirmation: DepositRequestConfirmationApi,
  ): void {
    // Received an error response from API
    if (response.status !== 'success') {
      return this.handleError(
        response.requestId,
        'Deposit confirm api request failed!',
      );
    }

    if (response.result.is_threeds_triggered) {
      // 3DS is triggered
      if (!response.result.threeds_data) {
        return this.handleError(
          response.requestId,
          '3DS triggered but data missing',
        );
      }

      const threedsInProgress = !!this.threeDSCtx;
      const newThreeDSCtx = this.createThreeDSContext(
        response.result.threeds_data,
        this.threeDSCtx,
      );

      if (!newThreeDSCtx) {
        return this.handleError(
          response.requestId,
          'Failed to create threeDS context',
        );
      }
      this.threeDSCtx = newThreeDSCtx;

      if (threedsInProgress) {
        // 3DS is in progress, continue using the existing Popup
        this.getPostThreeDSPromise().then(data =>
          this.processThreeDSFlowPopupResponse(data, confirmation),
        );

        this.initiate3DSFlow(this.threeDSCtx, confirmation);
      } else {
        // 3DS is triggered, open new Popup

        this.tracking.trackCustomEvent('ThreeDSRequired');
        this.paymentsMessaging.pushOverlay({
          brand: {
            src: this.paymentsUtils.getMethodLogoPath(DepositMethodApi.WIRE),
            alt: 'Bank Logo',
          },
          ctaAction: () => this.initThreeDSPopupFlow(confirmation),
          onClose: () => this.cancelThreeDSFlow(),
          overlayType: OverlayTypes.CC_3DS,
        });
      }
    } else {
      // Deposit is successful.
      if (this.threeDSCtx) {
        this.threeDSCtx = undefined;
        // Disable overlay being closed immediately after the popup window
        // is closed. The overlay displays additional info and has logic to
        // redirect the user to dashboard.

        if (this.isNative()) {
          this.browser.close();
        } else {
          this.popUpService.disableOverlayCloseEvent();
          this.popUpService.closePopUp();
        }
      }

      this.paymentsMessaging.pushResult({
        paymentsStatus: PaymentsResultStatus.SUCCESS,
      });
    }
  }

  /**
   * Handle the error response from API call
   *
   * @param eventId
   * @param errorMessage
   */
  handleError(eventId?: string, errorMessage?: string) {
    if (this.threeDSCtx) {
      this.threeDSCtx = undefined;
      this.closeOverlay();
      if (this.isNative()) {
        this.browser.close();
      } else {
        this.popUpService.closePopUp();
      }
    }

    this.paymentsMessaging.pushError({
      errorType: PaymentsErrorType.ERROR,
      eventId,
      errorMessage,
    });
  }

  /**
   * Get result post message from GAF
   */
  getThreeDSDepositResultPromise(): Promise<MessageEvent['data']> {
    return this.paymentsUtils
      .getFilteredMessageStream(
        event => !!event.data.threeDSFailure || !!event.data.threeDSSuccess,
      )
      .pipe(take(1))
      .toPromise();
  }

  /**
   * Get return post message from GAF
   */
  getPostThreeDSPromise(): Promise<MessageEvent['data']> {
    return this.paymentsUtils
      .getFilteredMessageStream(
        event =>
          !!event.data.threeDSFailure ||
          (!!event.data.type && event.data.type === ThreeDSMessageType.RETURN),
      )
      .pipe(take(1))
      .toPromise();
  }

  /**
   * Emit error message to show the banner in deposit page
   *
   * @param errorMessage
   * @param errorType
   */
  emitErrorMessage(
    errorMessage: string,
    errorType:
      | PaymentsErrorType.ERROR
      | PaymentsErrorType.ERROR_AUTH
      | PaymentsErrorType.ERROR_INIT
      | PaymentsErrorType.ERROR_UNKNOWN,
  ) {
    this.paymentsMessaging.pushError({
      errorMessage,
      errorType,
    });
  }

  /**
   * Cancel the 3DS flow
   */
  cancelThreeDSFlow() {
    if (this.isNative()) {
      this.browser.close();
    } else {
      this.popUpService.closePopUp();
    }
    this.paymentsMessaging.pushResult({
      paymentsStatus: PaymentsResultStatus.INTERRUPTED,
    });
    this.threeDSCtx = undefined;
  }

  /**
   * Opens a popup window and initiate the 3DS flow.
   */
  initThreeDSPopupFlow(confirmation: DepositRequestConfirmationApi) {
    if (this.isNative()) {
      this.getPostThreeDSPromise().then(data =>
        this.processThreeDSFlowPopupResponse(data, confirmation),
      );
      if (this.threeDSCtx) {
        this.initiate3DSFlow(this.threeDSCtx, confirmation);
      }
    } else {
      this.popUpService.openPopUp('threeDSPopup').then(threeDSPopup => {
        this.threeDSPopUp = threeDSPopup;

        this.getPostThreeDSPromise().then(data =>
          this.processThreeDSFlowPopupResponse(data, confirmation),
        );

        if (this.threeDSCtx) {
          this.initiate3DSFlow(this.threeDSCtx, confirmation);
        }
      });
    }
  }

  /**
   *  Function to pop the threeds modal
   *  1. Pop overlay to prompt user - popThreeDSModal()
   *  2. Trigger 3DS popup if user continue with the 3DS flow - initThreeDSFlow()
   *  3. Handle the result from the bank after the user completing the 3DS flow - processThreeDSResults()
   *  4. Continue 3DS flow if challenged further, or finalise the flow - finaliseOrContinueThreeDSFlow()
   *  5. Function to cancel the 3DS flow - cancelThreeDSFlow()
   *
   * @param threeDSdata
   */
  popThreeDSModal(threeDSdata: MessageEvent['data']) {
    const logo = {
      src: this.paymentsUtils.getMethodLogoPath(DepositMethodApi.WIRE),
      alt: 'Bank Logo',
    };

    this.tracking.trackCustomEvent('ThreeDSRequired');
    this.paymentsMessaging.pushOverlay({
      brand: logo,
      ctaAction: () => this.initThreeDSFlow(threeDSdata),
      onClose: () => this.cancelThreeDSFlow(),
      overlayType: OverlayTypes.CC_3DS,
    });
  }

  /**
   *  CTA callback function to initiliase the 3DS process from the 3DS modal
   *
   * @param threeDSdata
   */
  initThreeDSFlow(threeDSdata: MessageEvent['data']) {
    this.popUpService.openPopUp('threeDSPopup').then(threeDSPopup => {
      this.getPostThreeDSPromise().then(data =>
        this.processThreeDSResults(threeDSPopup, data),
      );

      this.processThreeDSForm(threeDSPopup, threeDSdata);
    });
  }

  /**
   *  Continue 3DS flow if challenged further, or finalise the flow.
   *
   * @param threeDSPopup
   * @param eventData
   */
  finaliseOrContinueThreeDSFlow(
    threeDSPopup: Window,
    eventData: MessageEvent['data'],
  ) {
    if (!!eventData.type && eventData.type === ThreeDSMessageType.TRIGGER) {
      this.getPostThreeDSPromise().then(data =>
        this.processThreeDSResults(threeDSPopup, data),
      );
      this.processThreeDSForm(threeDSPopup, eventData);
    } else {
      if (!!eventData.type && eventData.type === 'success') {
        // Disable overlay being closed immediately after the popup window
        // is closed. The overlay displays additional info and has logic to
        // redirect the user to dashboard.
        this.popUpService.disableOverlayCloseEvent();
        this.paymentsMessaging.pushResult({
          paymentsStatus: PaymentsResultStatus.SUCCESS,
        });
      } else {
        this.closeOverlay();
        this.emitErrorMessage('3DS deposit failed', PaymentsErrorType.ERROR);
      }

      if (this.isNative()) {
        this.browser.close();
      } else {
        this.popUpService.closePopUp();
      }
    }
  }

  /**
   *  Handling a result message from 3DS flow
   *
   * @param threeDSPopup
   * @param eventData
   */
  processThreeDSResults(threeDSPopup: Window, eventData: MessageEvent['data']) {
    if (eventData.threeDSFailure) {
      this.closeOverlay();
      // No need to emit the error as this.paymentsMessaging service seems
      // to magically receive it.
      if (this.isNative()) {
        this.browser.close();
      } else {
        this.popUpService.closePopUp();
      }
    } else {
      this.getThreeDSFinaliseOrContinuePromise().then(resultData =>
        this.finaliseOrContinueThreeDSFlow(threeDSPopup, resultData),
      );
      this.processPostThreeDS(threeDSPopup, eventData);
    }
  }

  /**
   *  TODO [PSD2]: Is there a better way to restructure these promises?
   *  In the new 3DS flows, a subsequent trigger message (for challenge)
   *  could be sent after the initial trigger message for redirect.
   */
  getThreeDSFinaliseOrContinuePromise(): Promise<MessageEvent['data']> {
    return this.paymentsUtils
      .getFilteredMessageStream(
        event =>
          !!event.data.threeDSFailure ||
          !!event.data.threeDSSuccess ||
          (!!event.data.type && event.data.type === ThreeDSMessageType.TRIGGER),
      )
      .pipe(take(1))
      .toPromise();
  }

  /**
   *  Message hooks
   */
  getThreeDSTriggerStream(): Rx.Observable<MessageEvent['data']> {
    return this.paymentsUtils.getFilteredMessageStream(
      event =>
        !!event.data.type && event.data.type === ThreeDSMessageType.TRIGGER,
    );
  }
}
