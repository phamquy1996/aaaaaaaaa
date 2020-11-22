import { Injectable } from '@angular/core';
import { Interface } from '@freelancer/types';
import { GoogleTracking } from '../google-tracking.service';

/*
 * This uses Google's global site tag (gtag.js) snippet, which replaced the old
 * Universal Analytics (analytics.js) and other product-specific SDKs and
 * allows to communicate to Google Analytics, Google Ads, and Google Marketing
 * Platform.
 */
@Injectable()
export class GoogleTrackingTesting implements Interface<GoogleTracking> {
  trackPageView(): void {
    // Do nothing
  }

  trackClickEvent(payload: unknown): void {
    // Do nothing
  }

  trackCustomEvent(payload: unknown): void {
    // Do Nothing
  }
}
