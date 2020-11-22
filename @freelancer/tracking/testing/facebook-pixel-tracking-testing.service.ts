import { Injectable } from '@angular/core';
import { Interface } from '@freelancer/types';
import { FacebookPixelTracking } from '../facebook-pixel-tracking.service';

@Injectable()
export class FacebookPixelTrackingTesting
  implements Interface<FacebookPixelTracking> {
  trackPageView(): void {
    // Do nothing
  }

  trackCustomEvent(): void {
    // Do nothing
  }
}
