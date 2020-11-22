import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ErrorHandler,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { StatusBarStyle } from '@capacitor/core';
import { LANGUAGE_COOKIE, Localization } from '@freelancer/localization';
import { Location } from '@freelancer/location';
import { CookieService } from '@laurentgoudet/ngx-cookie';
import * as Rx from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { FREELANCER_PWA_TRACKING_PROVIDER } from './config';
import { FreelancerPwaTrackingInterface } from './interface';
import { CustomAppData, Pwa } from './pwa.service';

/**
 * Initialize the app PWA functionalities
 */
@Component({
  selector: 'fl-pwa',
  template: ``,
  styleUrls: ['./pwa.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PwaComponent implements OnInit, OnDestroy {
  hideNativeSplashScreenSubscrition?: Rx.Subscription;

  constructor(
    private cookies: CookieService,
    private errorHandler: ErrorHandler,
    private location: Location,
    private localization: Localization,
    private updates: SwUpdate,
    private pwa: Pwa,
    @Inject(FREELANCER_PWA_TRACKING_PROVIDER)
    private pwaTracking: FreelancerPwaTrackingInterface,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(LANGUAGE_COOKIE) private languageCookie: string,
  ) {}

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.updates.isEnabled) {
        if (window.webapp && window.webapp.version) {
          console.log(
            `Running version ${window.webapp.version.gitRevision.slice(
              0,
              7,
            )} (${new Date(
              window.webapp.version.buildTimestamp,
            ).toUTCString()})`,
          );
          // TODO: change that to SwUpdate::checkVersion() once it has been
          // implemented
          // This is used by the ngsw webapp e2e test to make it more reliable
          if (navigator.serviceWorker.controller !== null) {
            window.webapp.debugIsServiceWorkerReady = true;
          } else {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
              if (navigator.serviceWorker.controller !== null) {
                window.webapp.debugIsServiceWorkerReady = true;
              }
            });
          }
        } else {
          this.errorHandler.handleError(
            new Error(`Invalid app version "${JSON.stringify(window.webapp)}"`),
          );
        }
      }

      // If the app language doesn't match the user selected one, bypass the
      // service worker to reload the correct app shell from the server
      if (
        this.cookies.get(this.languageCookie) &&
        this.localization.languageCode !== this.cookies.get(this.languageCookie)
      ) {
        const url = new URL(this.location.href);
        if (!url.searchParams.has('ngsw-bypass')) {
          console.log(
            `App language "${
              this.localization.languageCode
            }" does not match user language "${this.cookies.get(
              this.languageCookie,
            )}", reloading...`,
          );
          // setting the lang param here isn't stricky necessary but allows to
          // bypass the browser cache (and no, that's a different thing from
          // the service worker cache itself).
          url.searchParams.set('lang', this.cookies.get(this.languageCookie));
          url.searchParams.set('ngsw-bypass', '');
          return this.location.redirect(url.toString());
        }
        this.errorHandler.handleError(
          new Error(
            `App language "${
              this.localization.languageCode
            }" does not match user language "${this.cookies.get(
              this.languageCookie,
            )}" after reload`,
          ),
        );
      }

      // If the app is running in installed mode, activate the global installed
      // mode overrides
      if (this.pwa.isInstalled()) {
        this.pwa.activateInstalledMode();
      }

      // Start the background update checks (every hour)
      this.pwa.startBackgroundUpdateChecks();

      // Also check for updates every 15 minutes on webapp navigations
      // We don't want to do that at every single navigation as the Service
      // Worker manifest (ngsw.json) still has a decent size (~50kB gzipped)
      let lastNavigationCheckTime = Date.now();
      this.router.events
        .pipe(filter((event: Event) => event instanceof NavigationEnd))
        .subscribe(() => {
          const currentTime = Date.now();
          if (currentTime - lastNavigationCheckTime > 15 * 60 * 1000) {
            this.pwa.checkForUpdate();
            lastNavigationCheckTime = currentTime;
          }
        });

      // Force upgrade to the new version
      this.pwa.hasPendingUpdate().subscribe(event => {
        if (
          this.isCustomAppData(event.available.appData) &&
          this.isCustomAppData(event.current.appData)
        ) {
          this.pwaTracking.trackCustomEvent('available_version', 'pwa', {
            current_manifest_hash: event.current.hash,
            current_git_revision: event.current.appData.gitRevision,
            current_build_timestamp: event.current.appData.buildTimestamp,
            current_minimum_version_timestamp:
              event.current.appData.minimumVersionTimestamp,
            available_manifest_hash: event.available.hash,
            available_git_revision: event.available.appData.gitRevision,
            available_build_timestamp: event.available.appData.buildTimestamp,
            available_minimum_version_timestamp:
              event.available.appData.minimumVersionTimestamp,
          });

          const data = event.available.appData;
          console.log(
            `New version ${data.gitRevision.slice(0, 7)} (${new Date(
              data.buildTimestamp,
            ).toUTCString()}) available`,
          );
          // Bumping minimumVersionTimestamp is a fail-safe that should only be
          // activated when a version is badly broken, as it would cause data
          // loss on the client-side, since users will be hard-refreshed while
          // potentially filling forms
          if (data.minimumVersionTimestamp > data.buildTimestamp) {
            this.pwa.activateUpdate();
          }
          // If the current version is a week's older than the new one, force
          // upgrade the user at the next navigation. This ensures users
          // infrequently using the app still gets the latest features quickly,
          // and prevents us from maintaining our API backwards compatibility
          // for months.
          if (
            data.buildTimestamp - window.webapp.version.buildTimestamp >
            // a week in ms
            7 * 24 * 60 * 60 * 1000
          ) {
            console.log(
              `Current version is older than a week, new version will be activated on the next navigation`,
            );
            this.pwa.activateUpdateOnNavigation();
          }
        } else {
          this.errorHandler.handleError(
            new Error(
              `Invalid SwUpdate available update appData: ${JSON.stringify(
                event,
              )}`,
            ),
          );
        }
      });

      this.pwa.hasActivatedUpdate().subscribe(event => {
        if (this.isCustomAppData(event.current.appData)) {
          this.pwaTracking.trackCustomEvent('activated_version', 'pwa', {
            ...(event.previous && this.isCustomAppData(event.previous.appData)
              ? {
                  previous_manifest_hash: event.previous.hash,
                  previous_git_revision: event.previous.appData.gitRevision,
                  previous_build_timestamp:
                    event.previous.appData.buildTimestamp,
                  previous_minimum_version_timestamp:
                    event.previous.appData.minimumVersionTimestamp,
                }
              : {}),
            current_manifest_hash: event.current.hash,
            current_git_revision: event.current.appData.gitRevision,
            current_build_timestamp: event.current.appData.buildTimestamp,
            current_minimum_version_timestamp:
              event.current.appData.minimumVersionTimestamp,
          });
        }
      });

      // Disable the PWA install banners
      window.addEventListener('beforeinstallprompt', e => {
        e.preventDefault();
      });

      if (this.pwa.isNative()) {
        // Set the status bar styles
        const { StatusBar } = await this.pwa.capacitorPlugins();
        StatusBar.setStyle({
          style: StatusBarStyle.Light,
        });
        /**
         * StatusBar.setBackgroundColor() only works for Android.
         * We're using CSS to create a background for the status bar in IOS
         * see pwa.component.scss
         */
        StatusBar.setBackgroundColor({ color: '#ffffff' });

        // Set the keyboard styles
        const { Keyboard } = await this.pwa.capacitorPlugins();
        Keyboard.setAccessoryBarVisible({ isVisible: true });

        // Hide the native splash screen (if any) once the navigation is completed
        console.log('Hidding native splash screen...');
        await this.router.events
          .pipe(
            filter(
              e => e instanceof NavigationEnd && e.url !== '/internal/pwa',
            ),
            take(1),
          )
          .toPromise();
        const { SplashScreen } = await this.pwa.capacitorPlugins();
        // setTimeout here ensures Angular view pixels are flushed to the
        // screen before hiding the native splash screen
        setTimeout(() => {
          SplashScreen.hide();
          console.log('Native splash screen has been hidden');
        });
      }
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.pwa.stopBackgroundUpdateChecks();
    }
    if (this.hideNativeSplashScreenSubscrition) {
      this.hideNativeSplashScreenSubscrition.unsubscribe();
    }
  }

  private isCustomAppData(appData: any): appData is CustomAppData {
    return (
      appData &&
      appData.gitRevision &&
      typeof appData.gitRevision === 'string' &&
      appData.buildTimestamp &&
      typeof appData.buildTimestamp === 'number' &&
      appData.minimumVersionTimestamp &&
      typeof appData.minimumVersionTimestamp === 'number'
    );
  }
}
