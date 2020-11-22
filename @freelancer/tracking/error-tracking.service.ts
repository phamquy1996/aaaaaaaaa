import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { Auth } from '@freelancer/auth';
import {
  Applications,
  APP_NAME,
  CompatApplications,
  Environment,
  ENVIRONMENT_NAME,
} from '@freelancer/config';
import * as Sentry from '@sentry/browser';
import * as SentryIntegrations from '@sentry/integrations';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';
import * as UAParser from 'ua-parser-js';
import { DISABLE_ERROR_TRACKING, TRACKING_CONFIG } from './tracking.config';
import { TrackingConfig } from './tracking.interface';

export interface ExtraData {
  [k: string]: any;
}

@Injectable()
export class ErrorTracking {
  private isSentryEnabled: boolean;

  constructor(
    private auth: Auth,
    @Inject(TRACKING_CONFIG) private config: TrackingConfig,
    @Inject(APP_NAME) private appName: Applications & CompatApplications,
    @Inject(ENVIRONMENT_NAME) private environment: Environment,
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DISABLE_ERROR_TRACKING) @Optional() disableErrorTracking: boolean,
  ) {
    if (
      isPlatformBrowser(platformId) &&
      this.config.enableErrorTracking &&
      this.isCurrentBrowser() &&
      !disableErrorTracking
    ) {
      Sentry.init({
        dsn: this.config.sentryDsn,
        release:
          window.webapp &&
          window.webapp.version &&
          window.webapp.version.gitRevision
            ? window.webapp.version.gitRevision
            : 'invalid revision',
        environment: this.environment,
        ignoreErrors: [
          // This is caused by anchorScrolling, see
          // https://github.com/angular/angular/issues/26854.
          // It's harmless though.
          /SyntaxError: Failed to execute 'querySelector' on 'Document': '.*' is not a valid selector/,
          /SyntaxError: '.*' is not a valid selector/,
          /SyntaxError: SyntaxError/,
          /SyntaxError: The string did not match the expected pattern/,
          // These are caused browsers cancelling ongoing requests due to a
          // location change
          'Http failure response for (unknown url): 0',
          /Error: Loading chunk \d+ failed/,
          'NS_ERROR_NOT_INITIALIZED',
          // Random client errors we can't do much about but show a banner at
          // some point
          'Out of memory',
          // The Angular Router currently throws on URLs with scripts tags or
          // invalid characters
          // See https://github.com/angular/angular/issues/21032
          'Error: Cannot match any routes. URL Segment:',
          // This is likely caused by some broken Kaspersky security product,
          // which wraps `XMLHttpRequest` in order to analyze web pages
          // behaviors, hence why the Error ends up t in the Angular Zone.
          'ns.GetCommandSrc is not a function',
          // FIXME: agm-core is broken as the Maps SDK isn't always loaded from
          // outside the Angular Zone
          // (https://github.com/SebastianM/angular-google-maps/blob/master/packages/core/services/fit-bounds.ts#L42)
          // This is caused by clients blocking the Google Maps SDK
          'Event: {"isTrusted":true}',
          // This is suspected to be caused by some broken Chrome Desktop
          // browser extension, see T121550
          'target parent not found',
        ],
        whitelistUrls: [/\/assets\//],
        blacklistUrls: [/^file:\/\//, /^moz-extension:\/\//],
        integrations: integrations =>
          // integrations will be all default integrations
          [
            ...integrations.filter(
              integration =>
                !['TryCatch', 'GlobalHandlers'].includes(integration.name),
            ),
            new SentryIntegrations.Dedupe(),
            new SentryIntegrations.ExtraErrorData(),
            new SentryIntegrations.ReportingObserver(),
          ],
        beforeSend(event) {
          if (event.message && event.message.startsWith('ReportingObserver')) {
            // There's a Boomerang bug where getEntriesByType('navigation')
            // (Nav Timings 2) is called before it's ready, leading Boomerang
            // to fallback to chrome.loadTimes()
            if (event.message.includes('chrome.loadTimes() is deprecated')) {
              return null;
            }
            // This is caused by perfect-scrolling, remove when/if
            // https://github.com/utatti/perfect-scrollbar/pull/810 ever get
            // merged.
            if (
              event.message.includes(
                'Ignored attempt to cancel a touchmove event',
              )
            ) {
              return null;
            }
            // Only include events generated from the webapp source files in
            // order to cut off the noise
            if (
              event.extra &&
              event.extra.body &&
              event.extra.body.sourceFile &&
              event.extra.body.sourceFile.includes('/assets/webapp/')
            ) {
              return event;
            }
            return null;
          }
          return event;
        },
      });
      Sentry.configureScope(scope => {
        if (
          window.webapp &&
          window.webapp.version &&
          window.webapp.version.buildTimestamp
        ) {
          scope.setTag(
            'releaseDate',
            new Date(window.webapp.version.buildTimestamp).toUTCString(),
          );
        }
        scope.setTag('app', this.appName);
      });
      this.isSentryEnabled = true;
    }
  }

  captureMessage(msg: string, extras?: ExtraData): void {
    if (this.isSentryEnabled && this.isCurrentBrowser()) {
      // sometimes this service isn't fully ready when we want to log errors
      const authState$ = this.auth ? this.auth.authState$ : Rx.of(undefined);
      authState$
        .pipe(
          map(auth => {
            Sentry.withScope(scope => {
              if (auth) {
                scope.setUser({ id: auth.userId });
              }
              if (extras) {
                scope.setExtras(extras);
              }
              Sentry.captureMessage(msg);
            });
          }),
        )
        .toPromise();
    }
  }

  captureException(error: Error, extras?: ExtraData): void {
    if (this.isSentryEnabled && this.isCurrentBrowser()) {
      // sometimes this service isn't fully ready when we want to log errors
      const authState$ = this.auth ? this.auth.authState$ : Rx.of(undefined);
      authState$
        .pipe(
          map(auth => {
            Sentry.withScope(scope => {
              if (auth) {
                scope.setUser({ id: auth.userId });
              }
              if (extras) {
                scope.setExtras(extras);
              }
              Sentry.captureException(error);
            });
          }),
        )
        .toPromise();
    }
  }

  // yeah UA parsing is bad blah blah but catching large failures quickly is
  // more important than being flooded by exotic browsers.
  private isCurrentBrowser() {
    const ua = new UAParser(window.navigator.userAgent);
    const { name, version = '' } = ua.getBrowser();
    if (
      (name === 'IE' && parseInt(version, 10) >= 11) ||
      (name === 'Edge' && parseInt(version, 10) >= 17) ||
      (name === 'Firefox' &&
        parseInt(version, 10) >= 65 &&
        !(ua.getOS().name === 'Android')) ||
      (name === 'Chrome' && parseInt(version, 10) >= 72) ||
      (name === 'Chromium' && parseInt(version, 10) >= 72) ||
      (name === 'Safari' && parseInt(version, 10) >= 11)
    ) {
      return true;
    }
    return false;
  }
}
