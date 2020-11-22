import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Auth } from '@freelancer/auth';
import { take } from 'rxjs/operators';
import { TRACKING_CONFIG } from './tracking.config';
import { TrackingConfig } from './tracking.interface';
import {
  CustomTrackingEvent,
  TrackingEvent,
  TrackingEventData,
} from './tracking.service';

const CUSTOM_DIMENSION_CHAR_LIMIT = 150;

/*
 * This uses Google's global site tag (gtag.js) snippet, which replaced the old
 * Universal Analytics (analytics.js) and other product-specific SDKs and
 * allows to communicate to Google Analytics, Google Ads, and Google Marketing
 * Platform.
 */
@Injectable()
export class GoogleTracking {
  private isEnabled = false;

  constructor(
    private auth: Auth,
    @Inject(TRACKING_CONFIG) private config: TrackingConfig,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    if (this.config.gaTrackingId && isPlatformBrowser(this.platformId)) {
      this.isEnabled = true;
      window.dataLayer = window.dataLayer || [];
    }
  }

  trackPageView(): void {
    if (!this.isEnabled) {
      return;
    }

    this.auth.authState$
      .pipe(take(1))
      .toPromise()
      .then(auth => {
        this.gtag('config', this.config.gaTrackingId, {
          user_id: auth ? auth.userId : undefined,
          page_location: window.location.href,
          page_path: window.location.pathname,
        });
      });
  }

  trackClickEvent(payload: TrackingEvent & TrackingEventData): void {
    if (!this.isEnabled) {
      return;
    }

    this.auth.authState$
      .pipe(take(1))
      .toPromise()
      .then(auth => {
        this.gtag('event', 'click', {
          event_category: payload.section,
          event_label: payload.label,
        });
      });
  }

  trackCustomEvent(payload: CustomTrackingEvent & TrackingEventData): void {
    if (!this.isEnabled) {
      return;
    }

    // String encode any string array in extra_params.
    let formatedExtraParams: { [k: string]: string | number } = {};
    if (payload.extra_params) {
      formatedExtraParams = Object.entries(payload.extra_params).reduce(
        (accumulatedParams, [paramKey, paramValue]) => ({
          ...accumulatedParams,
          ...{
            [paramKey]: Array.isArray(paramValue)
              ? paramValue
                  // Sort the array of number or string in ascending order.
                  .sort((item1, item2) =>
                    typeof item1 === 'string' || item1 instanceof String
                      ? item1.length - item2.length
                      : item1 - item2,
                  )
                  // Join the array into a string.
                  .reduce(
                    (
                      accumulator: string,
                      currentValue: string,
                      index: number,
                    ): string =>
                      // Custom dimension has a max length limit of 150 bytes.
                      // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#dimension
                      // Thus, we only include the current value if the length of the accumuator
                      // after adding the current value and the quotation mark
                      // is shorter than or equal to 150 characters.
                      accumulator.length + currentValue.length + 2 >
                      CUSTOM_DIMENSION_CHAR_LIMIT
                        ? accumulator
                        : index === 0
                        ? `"${currentValue}"`
                        : `${accumulator}"${currentValue}"`,
                    '',
                  )
              : paramValue,
          },
        }),
        formatedExtraParams,
      );
    }

    this.gtag('config', this.config.gaTrackingId, {
      // Mapping for custom dimension.
      custom_map: this.config.gaCustomDimensionMap,
    });

    this.gtag('event', payload.name, {
      ...{
        // When section is undefined, event_category will be default to 'general'.
        event_category: payload.section,
      },
      ...formatedExtraParams,
    });
  }

  private gtag(...args: any[]): void {
    this.loadTrackingSnippet();
    // We do need arguments here as GA does weird things with it, e.g. probably
    // reading the caller/callee or something, as just passing args doesn't
    // work (silentely fails & nothing is tracked).
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  }

  private loadTrackingSnippet(): void {
    if (!document.getElementById('gtag-sdk')) {
      const e = document.createElement('script');
      e.type = 'text/javascript';
      e.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.gaTrackingId}`;
      e.id = 'gtag-sdk';
      const s = document.getElementsByTagName('script')[0];
      (s.parentNode as Node).insertBefore(e, s);
      this.gtag('js', new Date());
      this.gtag('config', this.config.gaTrackingId, {
        // automatic page view tracking is disabled as we manually send page
        // view events to track the SPA route changes
        send_page_view: false,
        // use navigator.sendBeacon when supported. will be the default in a
        // future release.
        transport_type: 'beacon',
      });
      // Enable AdWords conversion tracking and remarketing
      if (this.config.awGoogleConversionId) {
        this.gtag('config', this.config.awGoogleConversionId);
      }
    }
  }
}
