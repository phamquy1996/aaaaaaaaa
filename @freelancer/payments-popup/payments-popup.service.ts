import { Injectable } from '@angular/core';
import {
  PaymentsEventType,
  PaymentsMessagingService,
} from '@freelancer/payments-messaging';
import { PaymentsTrackingService } from '@freelancer/payments-tracking';
import { Tracking } from '@freelancer/tracking';

@Injectable({
  providedIn: 'root',
})
export class PaymentsPopUpService {
  private popUp?: Window;
  private triggerOverlayClose = true;

  constructor(
    private tracking: Tracking,
    private paymentsMessaging: PaymentsMessagingService,
    private paymentsTracking: PaymentsTrackingService,
  ) {}

  get isOpened() {
    return this.popUp && !this.popUp.closed;
  }

  openPopUp(name: string): Promise<Window> {
    return new Promise((resolve, reject) => {
      this.triggerOverlayClose = true;
      const x = window.outerWidth / 2 + window.screenX - 437 / 2;
      const y = window.outerHeight / 2 + window.screenY - 602 / 2;
      const popup = window.open(
        '',
        'window name',
        `width=437,height=602,left=${x},top=${y}` +
          'menubar=0,toolbar=0,scrollbars=1',
      );
      if (popup) {
        this.popUp = popup;
        this.paymentsTracking.pushTrackingData({
          label: `${name}Opened`,
          name,
        });
        const stopHeartbeatTracking = this.tracking.trackHeartbeat(name);
        // can't use onbeforeunload here as it doesn't work for cross-origin
        // popups :(
        const timer = window.setInterval(() => {
          if (popup.closed) {
            clearInterval(timer);
            stopHeartbeatTracking();
            this.paymentsTracking.pushTrackingData({
              label: `${name}Closed`,
            });
            if (this.triggerOverlayClose) {
              this.closeOverlay();
            }
          }
        }, 200);
        popup.document.write('Loading...');
        resolve(popup);
      } else {
        reject(new Error('Failed to pop window'));
      }
    });
  }

  closePopUp() {
    if (this.popUp) {
      this.popUp.close();
      this.popUp = undefined;
    }
  }

  /**
   * Disable the overlay close event being emitted when popup window is closed.
   *
   * In some instances, we do not want to clear the overlay immediately after
   * the popup window is closed (e.g. after a successful 3ds flow). The
   * overlay may be displaying additional info and may have logic to redirect
   * the user to another landing page.
   */
  disableOverlayCloseEvent() {
    this.triggerOverlayClose = false;
  }

  private closeOverlay() {
    this.paymentsMessaging.pushEvent({
      eventType: PaymentsEventType.CLOSE_OVERLAY,
    });
  }
}
