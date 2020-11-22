import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  Inject,
  Injectable,
  LOCALE_ID,
  NgZone,
  PLATFORM_ID,
} from '@angular/core';
import { Auth } from '@freelancer/auth';
import { FreelancerPwaTrackingInterface } from '@freelancer/pwa';
import { leaveZone, Timer, TimeUtils } from '@freelancer/time-utils';
import { CookieService } from '@laurentgoudet/ngx-cookie';
import * as Rx from 'rxjs';
import { delay, mapTo, observeOn, switchMap, take, tap } from 'rxjs/operators';
import { FacebookPixelTracking } from './facebook-pixel-tracking.service';
import { GoogleTracking } from './google-tracking.service';
import { TRACKING_CONFIG } from './tracking.config';
import { TrackingConfig } from './tracking.interface';

export type TrackingEventType =
  | 'page_view' // router navigations as in 'the url has changed'
  | 'element_view' // things shown to the users that aren't part of the regular navigation, e.g. modals/popups
  | 'user_action' // user interactions with the UI
  | 'search' // search queries
  | 'heart_beat' // user continued presence on a page
  | 'page_performance_timings' // navigation performance, both initial & route changes
  | 'user_timing' // custom user timings
  | 'custom_event' // anything else but error tracking. QTS isn't the place to track errors, use Sentry.
  | 'core_web_vitals_timings'; // LCP, CLS and FID on initial load, and CLS on route changes

// Common fields added to all tracking events
export interface BaseTrackingEvent {
  en: TrackingEventType; // Event type
  acct: string; // App ID / "account"
  location: string; // Current URL
  session_id: string; // Unique ID for the session
  t: string; // Timestamp (Unix)
  user_id?: number; // User ID if the user is logged-in
}

export type CustomTrackingEvent = BaseTrackingEvent & {
  en: 'custom_event';
  name: string;
  section?: string;
};

export type TrackingEvent = BaseTrackingEvent | CustomTrackingEvent;

export interface TrackingEventData {
  [k: string]: any;
}

export type HeartbeatTrackingCancellation = () => void;

@Injectable()
export class Tracking implements FreelancerPwaTrackingInterface {
  private sessionId: string;
  /** Unique to each tab, to enable identifying individual tabs for users. */
  private clientId: string;
  private sequenceNum = 0;
  private referrerUrl: string;

  constructor(
    private auth: Auth,
    private cookies: CookieService,
    private facebookPixelTracking: FacebookPixelTracking,
    private googleTracking: GoogleTracking,
    private http: HttpClient,
    private ngZone: NgZone,
    private timeUtils: TimeUtils,
    @Inject(TRACKING_CONFIG) private config: TrackingConfig,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(LOCALE_ID) private locale: string,
  ) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    let sessionId = this.cookies.get(this.config.sessionCookie);
    if (!sessionId) {
      // Generate a new one if not.
      sessionId = this.generateUuid();
      this.cookies.put('_tracking_session', sessionId, {
        expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      });
    }
    this.sessionId = sessionId;

    let clientId: string | null | undefined;
    try {
      clientId = window.sessionStorage.getItem(this.config.clientKey);
    } catch (e) {
      // ignore the errors, e.g. quota is full or security error
      console.error(e);
    }
    if (!clientId) {
      clientId = this.generateUuid();
      try {
        window.sessionStorage.setItem(this.config.clientKey, clientId);
      } catch (e) {
        // ignore the errors, e.g. quota is full or security error
        console.error(e);
      }
    }
    this.clientId = clientId;

    // set the external referrer on start
    this.referrerUrl = document.referrer;

    // send the event backlog if any
    try {
      const backlog = localStorage.getItem('trackingBacklog');
      if (backlog) {
        const itemsMap: { [items: string]: TrackingEvent } = JSON.parse(
          backlog,
        );
        Object.values(itemsMap).forEach(item => {
          this.sendBeacon(item);
        });
      }
      localStorage.setItem('trackingBacklog', JSON.stringify({}));
    } catch (e) {
      // ignore the errors, e.g. quota is full or security error
      console.error(e);
    }
  }

  // DO NOT CALL THAT FROM THE app/ CODE. IT'LL BE RESTRICTED SOON.
  track(
    eventType: TrackingEventType,
    eventData: TrackingEventData = {},
  ): Promise<void> {
    return this.auth.authState$
      .pipe(take(1))
      .toPromise()
      .then(auth => {
        const e: TrackingEvent = {
          ...{
            acct: window.location.hostname.replace(/^www/, ''),
            t: Date.now().toString(),
            build_timestamp:
              window.webapp && window.webapp.version
                ? window.webapp.version.buildTimestamp
                : undefined,
            en: eventType,
            location: window.location.href,
            user_id: auth ? parseInt(auth.userId, 10) : undefined,
            session_id: this.sessionId,
          },
          ...eventData,
        };
        return this.sendBeacon(e);
      });
  }

  getSessionId(): Rx.Observable<string> {
    // sessionId could eventually be turned into a true observable
    return Rx.of(this.sessionId);
  }

  trackPageView(is404?: boolean): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.track('page_view', {
      language: this.locale,
      referrer_url: this.referrerUrl,
      screenHeight: window.screen.height,
      screenWidth: window.screen.width,
      windowInnerHeight: window.innerHeight,
      windowInnerWidth: window.innerWidth,
      is_404: is404,
    });
    // update the referrerUrl so that the next page_view event contains it.
    this.referrerUrl = window.location.href;
    // if GA tracking is enabled, track the page view there as well
    if (this.config.gaTrackingId) {
      this.googleTracking.trackPageView();
    }
    // if the FB pixel is enabled, track the page view there as well
    if (this.config.facebookPixelId) {
      this.facebookPixelTracking.trackPageView();
    }
  }

  trackCustomEvent(
    name: string,
    section?: string,
    extraParams?: { [key: string]: string | number | string[] },
  ): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.track('custom_event', {
      name,
      section,
      extra_params: {
        ...extraParams,
        client_id: this.clientId,
      },
    });
  }

  trackHeartbeat(
    name: string,
    referenceType?: string,
    referenceId?: string,
  ): HeartbeatTrackingCancellation {
    // don't setup heartbeat tracking on the server-side
    if (!isPlatformBrowser(this.platformId)) {
      return () => {
        // do nothing
      };
    }

    const startTime = Date.now();
    let count = 0;
    let interval = 1000;
    let timeoutId: Timer;

    const track = () => {
      count += 1;
      this.track('heart_beat', {
        name,
        start_time: startTime,
        count,
        reference: referenceType,
        reference_id: referenceId,
      });
      interval = Math.round(interval * 1.15);
      timeoutId = this.timeUtils.setTimeout(() => track(), interval);
    };

    track();

    return () => {
      clearTimeout(timeoutId);
    };
  }

  private generateUuid(): string {
    const s4 = () =>
      Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
  }

  private sendBeacon(
    payload: TrackingEvent & TrackingEventData,
  ): Promise<void> {
    const beaconId = this.sequenceNum++;

    // save the event for later in case of a hard navigation
    try {
      const backlog = JSON.parse(
        (localStorage.getItem('trackingBacklog') as string) || '{}',
      );
      backlog[beaconId] = payload;
      localStorage.setItem('trackingBacklog', JSON.stringify(backlog));
    } catch (e) {
      // ignore the errors, e.g. quota is full or security error
      console.error(e);
    }

    // if GA tracking is enabled, track the click event there
    if (this.config.gaTrackingId && payload.action === 'click') {
      this.googleTracking.trackClickEvent(payload);
    }

    // Forward custom event to Google and Facebook tracking.
    // Custom event name is required for a custom event.
    if (this.isCustomTrackingEvent(payload)) {
      if (this.config.gaTrackingId) {
        this.googleTracking.trackCustomEvent(payload);
      }
      if (this.config.facebookPixelId) {
        this.facebookPixelTracking.trackCustomEvent(payload);
      }
    }

    return Rx.of(payload)
      .pipe(
        observeOn(leaveZone(this.ngZone, Rx.asyncScheduler)),
        // this prevents cancelling in-flight requests in case a user_action
        // event triggers a hard navigation
        delay(100),
        switchMap(e => this.http.post(this.config.trackingEndpoint, e)),
        tap(() => {
          // Remove the event from the backlog once it has been sent
          try {
            const backlog2 = JSON.parse(
              (localStorage.getItem('trackingBacklog') as string) || '{}',
            );
            delete backlog2[beaconId];
            localStorage.setItem('trackingBacklog', JSON.stringify(backlog2));
          } catch (e) {
            // ignore the errors, e.g. quota is full or security error
            console.error(e);
          }
        }),
        mapTo(undefined),
      )
      .toPromise()
      .catch((err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          // A client-side or network error occurred.
          throw err.error;
        } else if (err.status === 0) {
          // HTTP status 0 means that the request was blocked by the client
          // (browser), which is often due to an Ad blocker.
          console.error(err.message);
        } else {
          // The backend returned an unsuccessful response code
          throw err.message;
        }
      });
  }

  // Type guard for custom event
  private isCustomTrackingEvent(
    event: TrackingEvent & TrackingEventData,
  ): event is CustomTrackingEvent & TrackingEventData {
    return (
      (event as CustomTrackingEvent & TrackingEventData).en === 'custom_event'
    );
  }
}
