import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ApplicationRef,
  Inject,
  Injectable,
  PLATFORM_ID,
  RendererFactory2,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import {
  SwUpdate,
  UpdateActivatedEvent,
  UpdateAvailableEvent,
} from '@angular/service-worker';
import { Capacitor, PluginRegistry, Plugins } from '@capacitor/core';
import { FreelancerLocationPwaInterface, Location } from '@freelancer/location';
import { TimeUtils } from '@freelancer/time-utils';
import { CookieService } from '@laurentgoudet/ngx-cookie';
import * as Rx from 'rxjs';
import { filter, first, skip, take } from 'rxjs/operators';

/**
 * Custom AppData from the Ngsw config included in the update notifications.
 */
export interface CustomAppData {
  /* Git SHA of the version */
  gitRevision: string;
  /* Build time as a Unix timestamp of the version */
  buildTimestamp: number;
  /* Minimum version build time to force the upgrade to */
  minimumVersionTimestamp: number;
}

/**
 * Wraps Angular's SwUpdate service & provide additional PWA-related helpers
 */
@Injectable({
  providedIn: 'root',
})
export class Pwa implements FreelancerLocationPwaInterface {
  private backgroundUpdateChecksSubscription?: Rx.Subscription;
  private isInstalledModeActivated = false;

  constructor(
    private appRef: ApplicationRef,
    private cookies: CookieService,
    private location: Location,
    private rendererFactory: RendererFactory2,
    private router: Router,
    private timeUtils: TimeUtils,
    private updates: SwUpdate,
    @Inject(DOCUMENT) private document: HTMLDocument,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  /**
   * Detects if the PWA is running in installed mode, i.e. launched as a
   * standalone app.
   *
   * Use that to hide "Install app" banners & buttons for instance.
   */
  isInstalled(): boolean {
    return (
      isPlatformBrowser(this.platformId) &&
      ((window.navigator && (window.navigator as any).standalone === true) ||
        this.isInstalledModeActivated)
    );
  }

  /*
   * Detects if the PWA is as a native app (through Capacitor)
   *
   * Use that to guard native only features, i.e. Capacitor plugins access
   */
  isNative(): boolean {
    return Capacitor.isNative === true;
  }

  /**
   * Returns the platform the PWA is running as.
   *
   * Use this for specific functionality to comply with requirements on certain app platforms.
   */
  getPlatform(): string {
    return Capacitor.getPlatform();
  }

  /**
   * Promise of the Capacitor Plugins object allowing the PWA to use native
   * APIs
   */
  capacitorPlugins(): Promise<PluginRegistry> {
    return Promise.resolve(Plugins);
  }

  /**
   * @private
   * Activate the PWA installed mode, i.e. tweak a bit the global styles &
   * behaviors
   *
   * This is turned on when the PWA is running in installed mode, or when it is
   * loaded from the `/internal/pwa` route for easier testing.
   */
  activateInstalledMode(): void {
    if (!this.isInstalledModeActivated) {
      // Disable text selection & browser callouts as it's not "app-like"
      const renderer = this.rendererFactory.createRenderer(null, null);
      renderer.setStyle(this.document.body, '-webkit-user-select', 'none');

      if (isPlatformBrowser(this.platformId)) {
        // Turn off the m. redirections
        this.cookies.put('mobile_optout', 'true');
      }

      this.isInstalledModeActivated = true;
    }
  }

  /**
   * @private
   * Use these events to notify the user of a pending update or to refresh
   * their pages when the code they are running is out of date.
   */
  hasPendingUpdate(): Rx.Observable<UpdateAvailableEvent> {
    return this.updates.available;
  }

  /**
   * @private
   * Use these events to notify the user that an update has been downloaded and
   * activated.
   */
  hasActivatedUpdate(): Rx.Observable<UpdateActivatedEvent> {
    return this.updates.activated;
  }

  /**
   * @private
   * Check for available updates
   */
  checkForUpdate(): Promise<void> {
    if (this.updates.isEnabled) {
      return this.updates.checkForUpdate();
    }
    return Promise.resolve();
  }

  /**
   * @private
   * Update to the latest app version immediately
   */
  activateUpdate(): Promise<void> {
    return this.updates
      .activateUpdate()
      .then(() => this.document.location.reload());
  }

  /**
   * @private
   * Update to the latest app version on the next navigation
   */
  activateUpdateOnNavigation(): Promise<void> {
    return this.router.events
      .pipe(
        filter((e): e is NavigationStart => e instanceof NavigationStart),
        take(1),
      )
      .toPromise()
      .then(e =>
        this.updates.activateUpdate().then(() => {
          this.document.location.href = new URL(
            e.url,
            this.location.origin,
          ).toString();
        }),
      );
  }

  /**
   * @private
   * Ask the service worker to check if any updates have been deployed to the
   * server every hour
   */
  startBackgroundUpdateChecks() {
    if (this.updates.isEnabled) {
      const appIsStable$ = this.appRef.isStable.pipe(
        first(isStable => isStable),
      );
      const everyOneHour$ = this.timeUtils.rxInterval(1 * 60 * 60 * 1000);
      const everyOneHourOnceAppIsStable$ = Rx.concat(
        appIsStable$,
        everyOneHour$,
      ).pipe(skip(1));
      this.backgroundUpdateChecksSubscription = everyOneHourOnceAppIsStable$.subscribe(
        () => this.updates.checkForUpdate(),
      );
    }
  }

  /**
   * @private
   * Cancel the background update checks
   */
  stopBackgroundUpdateChecks() {
    if (this.backgroundUpdateChecksSubscription) {
      this.backgroundUpdateChecksSubscription.unsubscribe();
    }
  }
}
