import { Injectable } from '@angular/core';
import { Interface } from '@freelancer/types';
import * as Rx from 'rxjs';
import { HeartbeatTrackingCancellation, Tracking } from '../tracking.service';

@Injectable()
export class TrackingTesting implements Interface<Tracking> {
  private sessionId: string;

  constructor() {
    this.sessionId = 'sessionId';
  }

  // DO NOT CALL THAT FROM THE app/ CODE. IT'LL BE RESTRICTED SOON.
  track(eventType: unknown, eventData: unknown): Promise<void> {
    return Promise.resolve();
  }

  getSessionId(): Rx.Observable<string> {
    // sessionId could eventually be turned into a true observable
    return Rx.of(this.sessionId);
  }

  trackPageView(is404?: boolean): void {
    // Do nothing
  }

  trackCustomEvent(
    name: string,
    section?: string,
    extraData?: { [key: string]: string | number },
  ): void {
    // Do nothing
  }

  trackHeartbeat(
    name: string,
    referenceType?: string,
    referenceId?: string,
  ): HeartbeatTrackingCancellation {
    return () => {
      // do nothing
    };
  }
}
