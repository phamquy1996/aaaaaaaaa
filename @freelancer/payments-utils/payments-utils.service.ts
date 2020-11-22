import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  FreelancerHttpConfig,
  FREELANCER_HTTP_CONFIG,
} from '@freelancer/freelancer-http';
import { Location } from '@freelancer/location';
import {
  PaymentsErrorType,
  PaymentsMessage,
  PaymentsResultStatus,
} from '@freelancer/payments-messaging';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import { DepositMethodApi } from 'api-typings/payments/payments';
import * as Rx from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import {
  DepositForm,
  InterframeDepositResponseType,
  MessageEventFilter,
  methodSelectionRadioControl,
} from './types';

@Injectable({
  providedIn: 'root',
})
export class PaymentsUtils {
  constructor(
    private location: Location,
    @Inject(FREELANCER_HTTP_CONFIG)
    private freelancerHttpConfig: FreelancerHttpConfig,
    private breakpointObserver: BreakpointObserver,
  ) {}

  // Helper function for message handling
  getFilteredMessageStream(
    messageEventFilter: MessageEventFilter,
  ): Rx.Observable<MessageEvent['data']> {
    return Rx.fromEvent<MessageEvent>(window, 'message').pipe(
      filter(
        event =>
          (event.origin === this.location.origin ||
          event.origin === this.freelancerHttpConfig.baseUrl || // TODO: find a way to inject `environment`
            this.location.hostname === 'localhost') &&
          messageEventFilter(event),
      ),
      map(event => event.data),
    );
  }

  listenForDepositResult(): Promise<MessageEvent['data']> {
    return this.getFilteredMessageStream(
      event =>
        !!event.data.type &&
        Object.values(InterframeDepositResponseType).includes(event.data.type),
    )
      .pipe(take(1))
      .toPromise();
  }

  handleInterframeDepositResult(data: any): PaymentsMessage | undefined {
    switch (data.type) {
      case InterframeDepositResponseType.SUCCESS:
        return {
          paymentsStatus: PaymentsResultStatus.SUCCESS,
        };
      case InterframeDepositResponseType.ERROR_AUTH:
        return {
          errorType: PaymentsErrorType.ERROR_AUTH,
        };
      case InterframeDepositResponseType.BAD_BIN:
        return {
          errorType: PaymentsErrorType.ERROR,
          errorCode: ErrorCodeApi.BIN_NON_RECURRING,
        };
      case InterframeDepositResponseType.ERROR:
      case InterframeDepositResponseType.ERROR_DETAILED:
      case InterframeDepositResponseType.ERROR_BIN:
      case InterframeDepositResponseType.ERROR_CART:
      case InterframeDepositResponseType.FAILURE:
        return {
          errorMessage: data.human_msg
            ? data.human_msg
            : data.message
            ? data.message
            : '',
          errorCode: data.error_code,
          eventId: data.uuid,
          errorType: PaymentsErrorType.ERROR,
        };
      case InterframeDepositResponseType.PENDING:
        return {
          paymentsMessage: data.message ? data.message : '',
          paymentsStatus: PaymentsResultStatus.PENDING,
        };
      case InterframeDepositResponseType.CANCELLED:
        return {
          paymentsStatus: PaymentsResultStatus.INTERRUPTED,
        };
      default:
        return {
          errorType: PaymentsErrorType.ERROR,
        };
    }
  }

  getCancelUrl(popUpEnabled: boolean = false): string {
    return popUpEnabled
      ? `${this.location.origin}/payments/deposit/cancel.php?status=cancel`
      : this.location.href;
  }

  /**
   * Helper for registering the method forms in parent form.
   * @param methodFormGroup Specific method form group to be registered
   * @param depositFormGroup Parent Form Group to register into
   * @param id key to register the control as (method id)
   */
  registerFormGroup(
    methodFormGroup: FormGroup,
    depositFormGroup: FormGroup,
    id: string,
  ) {
    if (
      depositFormGroup.controls[DepositForm.RADIO].value[
        methodSelectionRadioControl
      ] !== id
    ) {
      methodFormGroup.disable();
    }
    const depositMethodsFormGroup = depositFormGroup.controls[
      DepositForm.METHODS
    ] as FormGroup;
    depositMethodsFormGroup.setControl(id, methodFormGroup);
  }

  getMethodLogoPath(method: DepositMethodApi | string) {
    return `payments/${method}.svg`;
  }

  /**
   * Helper for turning on & off certain elements of the Deposit page based on
   * the viewport size, in order to make it mobile responsive.
   *
   * IMPORTANT: using `BreakpointObserver` here breaks server-side rendering,
   * i.e. we still have to remove it if we ever want to server-side render the
   * Deposit page. This will likely require a larger refactor of the deposit
   * page / a design change, as we can't load twice the billing iframes for
   * instance.
   */
  isMobileDeposit(): Rx.Observable<boolean> {
    return this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .pipe(map(m => m.matches));
  }
}
