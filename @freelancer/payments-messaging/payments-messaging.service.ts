import { Injectable } from '@angular/core';
import * as Rx from 'rxjs';
import {
  isPaymentsError,
  isPaymentsEvent,
  isPaymentsOverlay,
  isPaymentsResult,
  PaymentsError,
  PaymentsEvent,
  PaymentsMessage,
  PaymentsOverlay,
  PaymentsResult,
} from './payments-messaging.types';

@Injectable({
  providedIn: 'root',
})
export class PaymentsMessagingService {
  private paymentsEventsSubject$ = new Rx.Subject<PaymentsEvent>();
  private paymentsResultsSubject$ = new Rx.Subject<PaymentsResult>();
  private paymentsOverlaysSubject$ = new Rx.Subject<PaymentsOverlay>();
  private paymentsErrorsSubject$ = new Rx.Subject<PaymentsError>();

  private paymentsEvents$ = this.paymentsEventsSubject$.asObservable();
  private paymentsResults$ = this.paymentsResultsSubject$.asObservable();
  private paymentsOverlays$ = this.paymentsOverlaysSubject$.asObservable();
  private paymentsErrors$ = this.paymentsErrorsSubject$.asObservable();

  private paymentsMessages$ = Rx.merge(
    this.paymentsEvents$,
    this.paymentsResults$,
    this.paymentsOverlays$,
    this.paymentsErrors$,
  );

  getErrorStream() {
    return this.paymentsErrors$;
  }

  pushError(paymentsError: PaymentsError) {
    this.paymentsErrorsSubject$.next(paymentsError);
  }

  getEventStream() {
    return this.paymentsEvents$;
  }

  pushEvent(paymentsEvent: PaymentsEvent) {
    this.paymentsEventsSubject$.next(paymentsEvent);
  }

  getMessageStream() {
    return this.paymentsMessages$;
  }

  pushMessage(paymentsMessage: PaymentsMessage) {
    if (isPaymentsError(paymentsMessage)) {
      this.pushError(paymentsMessage);
    } else if (isPaymentsEvent(paymentsMessage)) {
      this.pushEvent(paymentsMessage);
    } else if (isPaymentsOverlay(paymentsMessage)) {
      this.pushOverlay(paymentsMessage);
    } else if (isPaymentsResult(paymentsMessage)) {
      this.pushResult(paymentsMessage);
    }
    // fail silently
  }

  getOverlayStream() {
    return this.paymentsOverlays$;
  }

  pushOverlay(paymentsOverlay: PaymentsOverlay) {
    this.paymentsOverlaysSubject$.next(paymentsOverlay);
  }

  getResultStream() {
    return this.paymentsResults$;
  }

  pushResult(paymentsResult: PaymentsResult) {
    this.paymentsResultsSubject$.next(paymentsResult);
  }
}
