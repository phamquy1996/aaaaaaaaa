import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { TRACKING_CONFIG } from './tracking.config';
import { TrackingConfig } from './tracking.interface';
import { CustomTrackingEvent, TrackingEventData } from './tracking.service';

@Injectable()
export class FacebookPixelTracking {
  private isEnabled = false;

  constructor(
    private ngZone: NgZone,
    @Inject(TRACKING_CONFIG) private config: TrackingConfig,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    if (this.config.facebookPixelId && isPlatformBrowser(this.platformId)) {
      this.isEnabled = true;
    }
  }

  trackPageView(): void {
    if (!this.isEnabled) {
      return;
    }
    this.ngZone.runOutsideAngular(() => {
      this.loadTrackingSnippet();
      window.fbq('track', 'PageView');
    });
  }

  trackCustomEvent(payload: CustomTrackingEvent & TrackingEventData): void {
    if (!this.isEnabled) {
      return;
    }
    this.ngZone.runOutsideAngular(() => {
      this.loadTrackingSnippet();
      window.fbq('trackCustom', payload.name, {
        ...{
          content_category: payload.section,
        },
        ...(payload.extra_params || {}),
      });
    });
  }

  private loadTrackingSnippet(): void {
    if (window.fbq) {
      return;
    }
    window.fbq = function fbq() {
      if (window.fbq.callMethod) {
        // eslint-disable-next-line prefer-rest-params, prefer-spread
        window.fbq.callMethod.apply(window.fbq, arguments);
      } else {
        // eslint-disable-next-line prefer-rest-params
        window.fbq.queue.push(arguments);
      }
    };
    if (!window._fbq) {
      window._fbq = window.fbq;
    }
    window.fbq.push = window.fbq;
    window.fbq.loaded = true;
    window.fbq.version = '2.0';
    window.fbq.queue = [];

    const e = document.createElement('script');
    e.async = true;
    e.src = 'https://connect.facebook.net/en_US/fbevents.js';
    const s = document.getElementsByTagName('script')[0];
    (s.parentNode as Node).insertBefore(e, s);

    window.fbq('init', this.config.facebookPixelId);
  }
}
