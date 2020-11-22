import { isPlatformBrowser } from '@angular/common';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { ErrorHandler, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Location } from '@freelancer/location';
import { UserAgent } from '@freelancer/user-agent';
import { isDefined } from '@freelancer/utils';
import { Keychain } from '@laurentgoudet/ionic-native-keychain/ngx';
import { CookieService } from '@laurentgoudet/ngx-cookie';
import * as Rx from 'rxjs';
import {
  catchError,
  filter,
  finalize,
  map,
  mapTo,
  publishReplay,
  refCount,
  skip,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { AUTH_CONFIG } from './auth.config';
import {
  AuthConfig,
  AuthServiceInterface,
  AuthState,
  DeviceTokenResultAjax,
  NavigationSwitchAccountResultAjax,
  RawAuthResponseData,
  SwitchAccountResultAjax,
} from './auth.interface';

@Injectable({
  providedIn: 'root',
})
export class Auth implements AuthServiceInterface {
  private _authStateSubject$: Rx.ReplaySubject<AuthState | undefined>;
  private beforeLogoutActions: (() => Promise<void>)[] = [];
  private isInitialized: boolean;

  private _deviceToken$: Rx.Observable<string | undefined>;
  get deviceToken$(): Rx.Observable<string | undefined> {
    if (!this.isInitialized) {
      this.init();
    }
    return this._deviceToken$;
  }

  get authState$(): Rx.Observable<AuthState | undefined> {
    if (!this.isInitialized) {
      this.init();
    }
    return this._authStateSubject$.asObservable();
  }

  private authCookiesExpires = new Date(
    new Date().setMonth(new Date().getMonth() + 1),
  );

  constructor(
    @Inject(AUTH_CONFIG) private authConfig: AuthConfig,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cookies: CookieService,
    private http: HttpClient,
    private location: Location,
    private userAgent: UserAgent,
    private iosKeychain: Keychain,
    private errorHandler: ErrorHandler,
  ) {}

  init() {
    this._authStateSubject$ = new Rx.ReplaySubject(1);
    // read session from cookie if any
    let userId;
    let token;
    if (isPlatformBrowser(this.platformId)) {
      userId = this.cookies.get(this.authConfig.userIdCookie);
      token = this.cookies.get(this.authConfig.authHashCookie);
    }
    if (userId && token) {
      this._authStateSubject$.next({ userId, token });
    } else if (Capacitor.isNative && Capacitor.getPlatform() === 'ios') {
      // In case we don't have any auth token in the cookie,
      // attempts to retrieve it from the IOS keychain.
      this.iosKeychain
        .getJson(this.authConfig.authIosKeychainToken)
        .then(value => {
          if (isDefined(value)) {
            this._authStateSubject$.next({
              userId: value.userId,
              token: value.token,
            });
          } else {
            this._authStateSubject$.next(undefined);
          }
        })
        .catch(err => {
          this._authStateSubject$.next(undefined);
          this.errorHandler.handleError(err);
        });
    } else {
      this._authStateSubject$.next(undefined);
    }
    // keep auth cookies in sync with session
    this._authStateSubject$.pipe(skip(1)).subscribe(s => {
      if (s) {
        this.storeAuthSession(s.userId, s.token, this.authCookiesExpires);
      } else {
        this.cookies.remove(this.authConfig.userIdCookie);
        this.cookies.remove(this.authConfig.authHashCookie);
        if (this.authConfig.arrowFedCookie) {
          this.cookies.remove(this.authConfig.arrowFedCookie);
        }

        // Remove the user ID and token from the ios keychain.
        if (Capacitor.isNative && Capacitor.getPlatform() === 'ios') {
          this.iosKeychain.remove(this.authConfig.authIosKeychainToken);
        }
      }
    });

    this._deviceToken$ = this.http
      .get<RawAuthResponseData<DeviceTokenResultAjax>>(
        `${this.authConfig.baseUrl}/device`,
      )
      .pipe(
        map(response => response.result.token),
        catchError(_ => Rx.of(undefined)),
        publishReplay(1),
        refCount(),
      );

    // Enables the `webapp_local` query param to be used to pass down the
    // current auth state to a localhost instance of the webapp for easier
    // debugging/session sharing.
    const url = new URL(this.location.href);
    if (url.searchParams.has('webapp_local') && url.hostname !== 'localhost') {
      url.searchParams.delete('webapp_local');
      const absoluteUrl = url.toString().replace(url.origin, '');
      if (userId && token) {
        this.location.redirect(
          `http://localhost:7766/internal/auth/callback?uid=${userId}&token=${encodeURIComponent(
            token,
          )}&next=${encodeURIComponent(absoluteUrl)}`,
        );
      } else {
        this.location.redirect(`http://localhost:7766${absoluteUrl}`);
      }
    }

    this.isInitialized = true;
  }

  getUserId(): Rx.Observable<string> {
    if (!this.isInitialized) {
      this.init();
    }
    return this.authState$.pipe(
      filter(isDefined),
      map(auth => auth.userId),
    );
  }

  isLoggedIn(): Rx.Observable<boolean> {
    if (!this.isInitialized) {
      this.init();
    }
    return this.authState$.pipe(map(state => !!state));
  }

  getAuthorizationHeader(): Rx.Observable<HttpHeaders> {
    if (!this.isInitialized) {
      this.init();
    }
    return this.authState$.pipe(
      map(auth => {
        let headers = new HttpHeaders();
        if (!auth) {
          return headers;
        }
        headers = headers.set(
          this.authConfig.authHeaderName,
          `${auth.userId};${auth.token}`,
        );
        if (
          this.authConfig.arrowFedCookie &&
          this.cookies.get(this.authConfig.arrowFedCookie)
        ) {
          headers = headers.set(
            this.authConfig.arrowFedCookie,
            this.cookies.get(this.authConfig.arrowFedCookie),
          );
        }
        return headers;
      }),
    );
  }

  setSession(userId: string, token: string) {
    if (!this.isInitialized) {
      this.init();
    }
    this._authStateSubject$.next({ userId, token });
  }

  deleteSession() {
    if (!this.isInitialized) {
      this.init();
    }
    this._authStateSubject$.next(undefined);
  }

  // FIXME T38832: This needs 2 AJAX calls because GAF.
  switchUser(newUserId: string): Promise<string | undefined> {
    if (!this.isInitialized) {
      this.init();
    }
    if (!this.authConfig.switchAccountHackyEndpoint) {
      throw new Error('missing authConfig.switchAccountHackyEndpoint');
    }
    return this.authState$
      .pipe(
        take(1),
        switchMap(auth => {
          if (!auth) {
            throw new Error('no user to switch account from');
          }
          const body = new FormData();
          body.append('user', auth.userId);
          body.append('other_user', newUserId);
          body.append('token', auth.token);

          return this.http
            .post<RawAuthResponseData<SwitchAccountResultAjax>>(
              `${this.authConfig.baseUrl}/switch_account/`,
              body,
            )
            .pipe(map(response => response.result.token));
        }),
        withLatestFrom(this.getAuthorizationHeader()),
        switchMap(async ([newUserToken, authHeader]) => {
          await Promise.all(this.beforeLogoutActions.map(action => action()));

          const body = new FormData();
          body.append('user', newUserId);
          body.append('token', newUserToken);
          return this.http
            .post<RawAuthResponseData<NavigationSwitchAccountResultAjax>>(
              this.authConfig.switchAccountHackyEndpoint as string,
              body,
              {
                headers: authHeader,
              },
            )
            .pipe(
              map(response => ({ response, newUserToken })),
              take(1),
            )
            .toPromise();
        }),
        tap(({ newUserToken }) =>
          this._authStateSubject$.next({
            userId: newUserId,
            token: newUserToken,
          }),
        ),
        map(({ response }) =>
          'gotoUrl' in response.result ? response.result.gotoUrl : undefined,
        ),
      )
      .toPromise();
  }

  logout(): Rx.Observable<undefined> {
    if (!this.isInitialized) {
      this.init();
    }
    return this.authState$.pipe(
      take(1),
      switchMap(async auth => {
        if (!auth) {
          throw new Error('no user to logout');
        }

        await Promise.all(this.beforeLogoutActions.map(action => action()));

        const body = new FormData();
        body.append('user', auth.userId);
        body.append('token', auth.token);

        return this.http
          .post(`${this.authConfig.baseUrl}/logout/`, body)
          .pipe(take(1))
          .toPromise();
      }),
      mapTo(undefined),
      finalize(() => this._authStateSubject$.next(undefined)),
      catchError((err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          // A client-side or network error occurred.
          throw err.error;
        }

        // The backend returned an unsuccessful response code.
        console.error(err.message, err.error);
        return Rx.of(undefined);
      }),
    );
  }

  /**
   * Register an action to be ran before logging the user out, allowing
   * authenticated calls to be made before the auth state is reset.
   */
  registerBeforeLogoutAction(action: () => Promise<void>) {
    if (!this.isInitialized) {
      this.init();
    }
    this.beforeLogoutActions.push(action);
  }

  getCSRFToken(): string {
    if (!this.isInitialized) {
      this.init();
    }
    if (!this.authConfig.csrfCookie) {
      throw new Error('missing authConfig.switchAccountHackyEndpoint');
    }
    let token = this.cookies.get(this.authConfig.csrfCookie);
    if (!token) {
      token = this.generateCSRFToken(
        64,
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
      );
      this.cookies.put(this.authConfig.csrfCookie, token, {
        expires: this.authCookiesExpires,
      });
    }
    return token;
  }

  refreshSession(expiryHours: number): void {
    if (!this.isInitialized) {
      this.init();
    }
    this.authState$
      .pipe(take(1))
      .toPromise()
      .then(authState => {
        const date = new Date();
        date.setHours(date.getHours() + expiryHours);
        if (authState) {
          this.storeAuthSession(authState.userId, authState.token, date);
        }
      });
  }

  private generateCSRFToken(length: number, charset: string): string {
    let result = '';
    for (let i = length; i > 0; --i) {
      result += charset[Math.floor(Math.random() * charset.length)];
    }
    return result;
  }

  /**
   * Returns if the browser can properly set a cookie with SameSite=None
   * The page must be secure and the browser cannot be incompatible:
   * https://www.chromium.org/updates/same-site/incompatible-clients
   */
  private canSetSameSiteNone(): boolean {
    // can't set SameSite=None on non-secure cookies
    if (this.location.protocol !== 'https:') {
      return false;
    }

    // for most incompatible browsers, we can just test functionality
    // if it rejects a cookie with SameSite=None, it's incompatible
    this.cookies.remove('testsamesitenone');
    this.cookies.put('testsamesitenone', '1', { sameSite: 'None' });
    if (this.cookies.get('testsamesitenone') !== '1') {
      return false;
    }
    this.cookies.remove('testsamesitenone');

    // for Safari on Mac OS 10.14 and any browser on iOS 12,
    // the cookie is set but the option is wrong
    // so we need some manual UA-parsing logic
    const ua = this.userAgent.getUserAgent();
    const browser = ua.getBrowser();
    const os = ua.getOS();
    if (
      (browser.name === 'Safari' &&
        os.name === 'Mac OS' &&
        os.version === '10.14') ||
      (os.name === 'iOS' && os.version === '12')
    ) {
      return false;
    }

    return true;
  }

  private storeAuthSession(
    userId: string,
    token: string,
    authCookiesExpires: Date,
  ) {
    // FIXME: as any is needed to explicitly not set the SameSite property,
    // otherwise it will just default to Lax as specified in cookieOptionsFactory.
    const sameSite = this.canSetSameSiteNone() ? 'None' : ('' as any);
    this.cookies.put(this.authConfig.userIdCookie, userId, {
      expires: authCookiesExpires,
      sameSite,
    });
    this.cookies.put(this.authConfig.authHashCookie, token, {
      expires: authCookiesExpires,
      sameSite,
    });

    // Store the user ID and auth token to keychain for IOS client.
    if (Capacitor.isNative && Capacitor.getPlatform() === 'ios') {
      this.iosKeychain
        .setJson(
          this.authConfig.authIosKeychainToken,
          {
            userId,
            token,
          },
          false, // useTouchID
        )
        .catch(err => {
          this.errorHandler.handleError(err);
        });
    }
  }
}
