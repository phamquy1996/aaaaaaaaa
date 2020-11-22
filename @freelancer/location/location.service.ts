import {
  isPlatformBrowser,
  isPlatformServer,
  Location as NgLocation,
} from '@angular/common';
import {
  Inject,
  Injectable,
  Injector,
  Optional,
  PLATFORM_ID,
} from '@angular/core';
import { NavigationExtras, Router, UrlTree } from '@angular/router';
import { isEqual } from '@freelancer/utils';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';
import * as Rx from 'rxjs';
import { map, take } from 'rxjs/operators';
import {
  FREELANCER_LOCATION_AUTH_PROVIDER,
  FREELANCER_LOCATION_HTTP_BASE_URL_PROVIDER,
  FREELANCER_LOCATION_PWA_PROVIDER,
} from './location.config';

export interface LocationEvent {
  hash: string; // a '#' followed by the fragment identifier of the URL.
  hostname: string; // the domain of the URL
  href: string; // the entire URL
  origin: string; // the origin of the specific location (protocol + :// + host)
  pathname: string; // an initial '/' followed by the path of the URL
  search: string; // a '?' followed by the parameters or "querystring" of the URL
}

/*
 * Reactive & server-side friendly version of window.location
 * See https://developer.mozilla.org/en-US/docs/Web/API/Location
 *
 * NOTE: Keep this in sync with the LocationTesting service
 */
@Injectable({
  providedIn: 'root',
})
export class Location {
  /**
   * The initial history.length when the app loaded.
   * Popping to state before this would leave the app.
   */
  private initialHistoryLength: number;
  private routeLoaded = false;
  private locationSubject$ = new Rx.ReplaySubject<LocationEvent>(1);

  constructor(
    private injector: Injector,
    private location: NgLocation,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(REQUEST) private request: Request,
    @Inject(FREELANCER_LOCATION_HTTP_BASE_URL_PROVIDER)
    private freelancerLocationHttpBaseUrl: string,
  ) {}

  /**
   * Emits a stream of LocationEvent
   */
  valueChanges(): Rx.Observable<LocationEvent> {
    return this.locationSubject$.asObservable();
  }

  /**
   * Pushes a fake state to absorb a back button click.
   * Returns a subscription for calling `onPop` after the state is popped.
   *
   * PRIVATE: this is for modals/callouts and should not be needed in app code.
   * Discuss with Frontend Infrastructure if you need back button interactions.
   */
  _createBackButtonState({ onPop }: { onPop: Function }): Rx.SubscriptionLike {
    // keep track of the initial state
    const prevState = this.location.getState();
    // non-navigation that just pushes a state for back button compatibility
    this.location.go(this.location.path(), undefined, { fakeId: Date.now() });
    // return a subscription so it can be unsubscribed
    const sub = this.location.subscribe(({ state }) => {
      // if we're back at the original state, call the onPop
      if (isEqual(state, prevState)) {
        if (onPop) {
          onPop();
        }
        // unsubscribe after first pop event
        sub.unsubscribe();
      }
    });
    return sub;
  }

  /**
   * Navigates to the previous state in the route history,
   * returning a Promise that resolves when the navigation is complete
   */
  back(): Promise<void> {
    if (isPlatformServer(this.platformId)) {
      throw new Error('Attempted to back() on the server');
    }

    // if .back() would leave the app, navigate to a primary view instead.
    if (
      // we are about to pop before the first page
      window.history.length <= this.initialHistoryLength &&
      // and there is no previous page
      (!document.referrer ||
        // or the previous page is not on our website
        new URL(document.referrer).origin !== this.origin)
    ) {
      // using navigate rather than replace means the user can still
      // reach the current page, although the history state is reversed
      return this.navigateByUrl('/')
        .pipe(take(1))
        .toPromise()
        .then(); // remove the return value to make typescript happy

      // TODO: navigate to views contextually (eg. message thread => inbox)
    }

    // otherwise, use the natural location.back()
    if (this.routeLoaded) {
      return new Promise(resolve => {
        // wait for the next `popstate event to be finished
        // otherwise if you try to back().then() navigate, it will be cancelled
        const sub = this.location.subscribe(() => {
          setTimeout(() => resolve());
          sub.unsubscribe();
        });
        this.location.back();
      });
    }
    // not `routeLoaded` implies compat layer,
    // where we don't track locationSubject$ and can't do the wait logic.
    this.location.back();
    return new Promise(resolve => {
      setTimeout(() => resolve());
    });
  }

  /**
   * SSR-friendly version of Router::navigateByUrl() without query parameters
   *
   * @remark
   *
   * WARNING: Please prefer using `router.navigate` if you need to pass in query
   * params to the router
   */
  navigateByUrl(
    url: string | UrlTree,
    extras?: NavigationExtras,
  ): Rx.Observable<boolean> {
    if (isPlatformBrowser(this.platformId)) {
      // tslint:disable-next-line:no-navigate-by-url
      return Rx.from(this.router.navigateByUrl(url, extras));
    }
    this.request._SSR_handleRedirect(`${this.origin}${url}`);
    // tslint:disable-next-line:no-navigate-by-url
    return Rx.from(this.router.navigateByUrl('/internal/blank'));
  }

  /**
   * Sets the location to a provided url. This will leave the webapp, DO NOT
   * use it for internal redirects, use navigateByUrl instead
   */
  redirect(url: string): Rx.Observable<boolean> {
    const redirectUrl = new URL(url);
    // Explicitly bypass the service worker if hard-redirecting to another
    // internal page (if it's external, the service worker won't kick in
    // anyway)
    if (redirectUrl.origin === this.origin) {
      redirectUrl.searchParams.set('ngsw-bypass', '');
    }
    if (isPlatformBrowser(this.platformId)) {
      // We can't use static injection here as the Pwa stuff uses the Location
      // service itself
      if (this.injector.get(FREELANCER_LOCATION_PWA_PROVIDER).isNative()) {
        return Rx.from(
          this.injector
            .get(FREELANCER_LOCATION_PWA_PROVIDER)
            .capacitorPlugins()
            .then(async ({ Browser, Modals }) => {
              // If internal redirect, pop-up the exit modal
              if (
                redirectUrl.origin === this.origin ||
                redirectUrl.origin === this.freelancerLocationHttpBaseUrl
              ) {
                const { value: isYes } = await Modals.confirm({
                  title: 'Leave the app?',
                  message:
                    'This functionality is not yet available inside the app. You will be redirected to the web version of Freelancer',
                });
                if (isYes) {
                  // We can't use static injection here as the Auth service
                  // uses the Location service itself
                  const authState = await this.injector
                    .get(FREELANCER_LOCATION_AUTH_PROVIDER)
                    .authState$.pipe(take(1))
                    .toPromise();
                  if (authState) {
                    return Browser.open({
                      url: `${redirectUrl.origin}/internal/auth/callback?uid=${
                        authState.userId
                      }&token=${encodeURIComponent(
                        authState.token,
                      )}&next=${encodeURIComponent(
                        redirectUrl.pathname + redirectUrl.search,
                      )}`,
                      presentationStyle: 'popover',
                    });
                  }
                  return Browser.open({
                    url: redirectUrl.toString(),
                    presentationStyle: 'popover',
                  });
                }
              } else {
                return Browser.open({
                  url: redirectUrl.toString(),
                  presentationStyle: 'popover',
                });
              }
            }),
        ).pipe(
          map(() => {
            // FIXME: This is needed as returning false still creates a new
            // state, even though the navigation is cancelled, because of
            // urlUpdateStrategy: eager. Arguably though this is an Angular bug
            // & the new state should be reverted on cancelled navigations.
            setTimeout(() => this.location.back());
            return false;
          }),
        );
      }
      if (this.routeLoaded) {
        window.location.assign(redirectUrl.toString());
      } else {
        window.location.replace(redirectUrl.toString());
      }
      return Rx.NEVER as Rx.Observable<boolean>;
    }
    this.request._SSR_handleRedirect(redirectUrl.toString());
    // tslint:disable-next-line:no-navigate-by-url
    return Rx.from(this.router.navigateByUrl('/internal/blank'));
  }

  /*
   * Returns the current origin in a platform friendly way
   */
  get origin(): string {
    if (isPlatformBrowser(this.platformId)) {
      return window.location.origin;
    }
    return `${this.request.protocol}://${this.host}`;
  }

  /*
   * Returns the current host, that is the hostname, a ':', and the port of the
   * URL, in a platform friendly way
   */
  get host(): string {
    if (isPlatformBrowser(this.platformId)) {
      return window.location.host;
    }
    // FIXME: we should be using `req.host` here but Express incorrectly strips
    // off the port number, which breaks local dev. This has been fixed in
    // Express 5 -> https://expressjs.com/en/guide/migrating-5.html#req.host
    // Note: X-Forwarded-Host is normally only ever a single value, but Fastly
    // seems to append the values.
    const header =
      this.request.get('X-Forwarded-Host') ||
      (this.request.get('Host') as string);
    const index = header.indexOf(',');
    return index !== -1 ? header.substring(0, index).trim() : header.trim();
  }

  /*
   * Returns the current hostname, that is the domain of the URL, in a platform
   * friendly way
   */
  get hostname(): string {
    if (isPlatformBrowser(this.platformId)) {
      return window.location.hostname;
    }
    return this.request.hostname;
  }

  /*
   * Returns the current (absolute) URL in a platform friendly way
   */
  get href(): string {
    if (isPlatformBrowser(this.platformId)) {
      return window.location.href;
    }
    return `${this.origin}${this.request.originalUrl}`;
  }

  /*
   * Returns the current URL in a platform friendly way
   */
  get url(): string {
    if (isPlatformBrowser(this.platformId)) {
      return `${window.location.pathname}${window.location.search}`;
    }
    return this.request.originalUrl;
  }

  /**
   * Returns the current pathname in a platform friendly way
   */
  get pathname(): string {
    if (isPlatformBrowser(this.platformId)) {
      return window.location.pathname;
    }
    return this.request.path;
  }

  /**
   * Returns the current protocol in a platform friendly way
   */
  get protocol(): string {
    if (isPlatformBrowser(this.platformId)) {
      return window.location.protocol;
    }
    return this.request.protocol;
  }

  /**
   * [PRIVATE] Exported private API.
   * To be used only by the LocationComponent to push new locations
   */
  _setLocation(pathname: string, hash: string, search: string): void {
    this.locationSubject$.next({
      hash,
      hostname: this.hostname,
      href: `${this.origin}${pathname}`,
      origin: this.origin,
      pathname,
      search,
    });
  }

  /**
   * [PRIVATE] exported private API
   * To be used only by the LocationComponent to mark that routes are loaded
   */
  _routeHasLoaded() {
    this.routeLoaded = true;
    if (isPlatformBrowser(this.platformId)) {
      this.initialHistoryLength = window.history.length;
    }
  }
}
