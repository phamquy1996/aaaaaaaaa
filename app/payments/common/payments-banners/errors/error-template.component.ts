import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Location } from '@freelancer/location';
import {
  PaymentMethod,
  PaymentsError,
  PaymentsErrorType,
  PaymentsMessagingService,
  PaymentsProcessError,
} from '@freelancer/payments-messaging';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import * as Rx from 'rxjs';

@Component({
  selector: 'app-error-template',
  template: `
    <ng-container *ngFor="let error of errorList; let i = index">
      <ng-container *ngIf="isPaymentsProcessError(error)">
        <ng-container [ngSwitch]="error?.errorCode">
          <app-notification-template
            *ngSwitchCase="ErrorCodeApi.BIN_NON_RECURRING"
            [message]="error.errorMessage"
            [eventId]="error.eventId"
            [notificationType]="notificationType"
            [contactSupport]="true"
            (bannerClose)="handleBannerClose(i)"
            i18n="Notification banner - Bad BIN error"
          >
            This card cannot be used for payment verification. Please use
            another card or, for further assistance, please contact support.
          </app-notification-template>
          <ng-container *ngSwitchDefault>
            <ng-container [ngSwitch]="error?.errorType">
              <app-notification-template
                *ngSwitchCase="PaymentsErrorType.ERROR"
                [header]="'Your payment has been rejected.'"
                [message]="error.errorMessage"
                [eventId]="error.eventId"
                [notificationType]="notificationType"
                [contactSupport]="true"
                (bannerClose)="handleBannerClose(i)"
              >
                <ng-container [ngSwitch]="error.errorCode">
                  <ng-container
                    *ngSwitchCase="
                      'ProjectExceptionCodes.DEPOSIT_AUTHORIZE_FAIL'
                    "
                    i18n="Notification banner - payment rejected"
                  >
                    Please ensure that your payment method is authorised for
                    online purchasing.
                  </ng-container>
                  <ng-container
                    *ngSwitchCase="ErrorCodeApi.PAYMENT_ACCOUNT_INFO_INVALID"
                    i18n="Notification banner - payment rejected"
                  >
                    Some details may be incorrect, please check your details
                    before trying again.
                  </ng-container>
                  <ng-container
                    *ngSwitchCase="ErrorCodeApi.PAYMENT_ACCOUNT_ID_INVALID"
                    i18n="Notification banner - payment rejected"
                  >
                    The card details are incorrect, please check the card number
                    or cardholder name before trying again.
                  </ng-container>
                  <ng-container
                    *ngSwitchCase="ErrorCodeApi.PAYMENT_CARD_EXPIRY_INVALID"
                    i18n="Notification banner - payment rejected"
                  >
                    The card has expired, please use another card or payment
                    method.
                  </ng-container>
                  <ng-container
                    *ngSwitchCase="ErrorCodeApi.PAYMENT_CARD_CVC_DECLINED"
                    i18n="Notification banner - payment rejected"
                  >
                    The CVV/CVC number is incorrect, please try again or use
                    another payment method.
                  </ng-container>
                  <ng-container
                    *ngSwitchCase="ErrorCodeApi.PAYMENT_ACCOUNT_PIN_ERROR"
                    i18n="Notification banner - payment rejected"
                  >
                    The allowable number of PIN tries has been exceeded, please
                    use another card or payment method.
                  </ng-container>
                  <ng-container
                    *ngSwitchCase="ErrorCodeApi.PAYMENT_ACCOUNT_SCA_FAILED"
                    i18n="Notification banner - payment rejected"
                  >
                    Additional steps required to complete your payment, please
                    contact your card issuer for more details.
                  </ng-container>
                  <ng-container
                    *ngSwitchCase="ErrorCodeApi.PAYMENT_AMOUNT_RESTRICTED"
                    i18n="Notification banner - payment rejected"
                  >
                    You have exceeded the balance or credit limit on your card,
                    please contact your card issuer for more information or use
                    another payment method.
                  </ng-container>
                  <ng-container
                    *ngSwitchCase="ErrorCodeApi.PAYMENT_AGREEMENT_CANCELED"
                    i18n="Notification banner - payment rejected"
                  >
                    Your card details need to be reverified to complete payment,
                    please update your card details or use another payment
                    method.
                  </ng-container>
                  <ng-container
                    *ngSwitchCase="ErrorCodeApi.PAYMENT_ACCOUNT_RESTRICTED"
                    i18n="Notification banner - payment rejected"
                  >
                    The card does not support this type of payment, please
                    contact your card issuer and use another card or payment
                    method.
                  </ng-container>
                  <ng-container
                    *ngSwitchCase="ErrorCodeApi.PAYMENT_TRANSACTION_DECLINED"
                  >
                    <ng-container [ngSwitch]="error?.paymentMethod">
                      <ng-container
                        *ngSwitchCase="PaymentMethod.PM_PAYPAL_RECURRING"
                        i18n="
                           Notification banner - Paypal recurring payment
                          rejected
                        "
                      >
                        Sorry, deposit failed. The transaction could not be
                        completed due to a PayPal error. Please verify your
                        payment source in your PayPal account and try again.
                      </ng-container>
                      <ng-container
                        *ngSwitchDefault
                        i18n="Notification banner - payment rejected"
                      >
                        The card does not support this type of payment, please
                        contact your card issuer and use another card or payment
                        method.
                      </ng-container>
                    </ng-container>
                  </ng-container>
                  <ng-container
                    *ngSwitchCase="ErrorCodeApi.PAYMENT_GATEWAY_UNAVAILABLE"
                    i18n="Notification banner - payment rejected"
                  >
                    The card issuer could not be reached, so the payment could
                    not be authorized, please try again later.
                  </ng-container>
                  <ng-container
                    *ngSwitchDefault
                    i18n="Notification banner - payment rejected"
                  >
                    Please ensure your payment details are entered correctly and
                    that your payment method is authorised for online
                    purchasing. Alternatively, you can try a different card or
                    payment method.
                  </ng-container>
                </ng-container>
              </app-notification-template>

              <app-notification-template
                *ngSwitchCase="PaymentsErrorType.ERROR_INIT"
                [header]="'There was an issue initializing the payment page.'"
                [message]="error.errorMessage"
                [eventId]="error.eventId"
                [notificationType]="notificationType"
                [contactSupport]="true"
                (bannerClose)="handleBannerClose(i)"
              ></app-notification-template>

              <app-notification-template
                *ngSwitchCase="PaymentsErrorType.ERROR_UNKNOWN"
                [message]="error.errorMessage"
                [eventId]="error.eventId"
                [notificationType]="notificationType"
                [contactSupport]="true"
                (bannerClose)="handleBannerClose(i)"
                i18n="Notification banner - unknown error"
              >
                We cannot process any deposit requests at this stage. Please try
                again later.
              </app-notification-template>

              <app-notification-template
                [header]="'There was an issue processing your deposit request.'"
                *ngSwitchCase="PaymentsErrorType.ERROR_AUTH"
                [message]="error.errorMessage"
                [eventId]="error.eventId"
                [notificationType]="notificationType"
                [contactSupport]="true"
                (bannerClose)="handleBannerClose(i)"
              >
                <fl-text
                  *ngIf="error"
                  i18n="Notification banner - browser error"
                >
                  This may be due to your browser blocking third party cookies,
                  which can be fixed by enabling them for your browser, or
                  adding
                  {{ domain }} as an exception. Please refer to the following
                  support articles for more detailed instructions:
                </fl-text>
                <fl-text
                  i18n="Notification template - google chrome support link"
                >
                  Google Chrome:
                  <fl-link
                    flTrackingLabel="cookieErrorGoogleLink"
                    [link]="'https://support.google.com/chrome/answer/95647'"
                  >
                    Google support article
                  </fl-link>
                </fl-text>
                <fl-text
                  i18n="Notification template - mozilla firefox support link"
                >
                  Mozilla Firefox:
                  <fl-link
                    flTrackingLabel="cookieErrorFirefoxLink"
                    [link]="
                      'https://support.mozilla.org/en-US/kb/disable-third-party-cookies'
                    "
                  >
                    Mozilla support article
                  </fl-link>
                </fl-text>
                <fl-text
                  i18n="Notification template - internet explorer support link"
                >
                  Internet Explorer:
                  <fl-link
                    flTrackingLabel="cookieErrorIELink"
                    [link]="
                      'https://support.microsoft.com/en-au/help/17442/windows-internet-explorer-delete-manage-cookies'
                    "
                  >
                    Microsoft support article
                  </fl-link>
                </fl-text>
              </app-notification-template>
            </ng-container>
          </ng-container>
        </ng-container>
      </ng-container>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./error-template.component.scss'],
})
export class ErrorTemplateComponent implements OnInit, OnDestroy {
  ErrorCodeApi = ErrorCodeApi;
  PaymentsErrorType = PaymentsErrorType;
  PaymentMethod = PaymentMethod;
  readonly domain = this.location.host.replace(/$.*\./, 'www.');
  readonly notificationType = BannerAlertType.ERROR;

  errorList: ReadonlyArray<PaymentsError> = [];
  errorSubscription?: Rx.Subscription;

  constructor(
    private paymentsMessaging: PaymentsMessagingService,
    private cdr: ChangeDetectorRef,
    private location: Location,
  ) {}

  ngOnInit() {
    this.errorSubscription = this.paymentsMessaging
      .getErrorStream()
      .subscribe(error => {
        this.errorList = [...this.errorList, error];
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
  }

  isPaymentsProcessError(error: PaymentsError): error is PaymentsProcessError {
    return error.errorType !== PaymentsErrorType.ERROR_DATASTORE;
  }

  handleBannerClose(index: number) {
    this.errorList = this.errorList.filter((_, i) => i !== index);
  }
}
