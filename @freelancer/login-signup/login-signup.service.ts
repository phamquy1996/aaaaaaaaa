import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  AppleSignInError,
  AppleSSO,
  Auth,
  AuthConfig,
  AUTH_CONFIG,
  CrossDomainSSODomainsGetResultAjax,
  SSOResponseData,
  SSOUser,
} from '@freelancer/auth';
import { ResponseData } from '@freelancer/datastore';
import { TotpMethod } from '@freelancer/datastore/collections';
import {
  Facebook,
  FacebookAuthResponse,
  FacebookSignInError,
} from '@freelancer/facebook';
import { FreelancerHttp } from '@freelancer/freelancer-http';
import { Location } from '@freelancer/location';
import { assertNever, isDefined } from '@freelancer/utils';
import { AppleSignInResponse } from '@laurentgoudet/ionic-native-sign-in-with-apple/ngx';
import { CookieService } from '@laurentgoudet/ngx-cookie';
import { RoleApi } from 'api-typings/common/common';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import { UserCreateResultApi } from 'api-typings/users/users';
import * as Rx from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import {
  AuthResponseAjax,
  AuthSuccessResponseAjax,
  CrossDomainSsoPostResultAjax,
  LoginError,
  RedirectUrlGetResultAjax,
  SSOResponseAjax,
  TwoFactorResponseAjax,
  UserCheckError,
} from './login-signup.backend-model';
import {
  AuthResponse,
  SSOActionResponse,
  TwoFactorResponse,
} from './login-signup.model';
import {
  transformAuthResponse,
  transformResponseData,
  transformTwoFactorResponse,
  transformUserCreateResonse,
} from './login-signup.transformers';

interface RedirectParams {
  redirectDisabled?: boolean;
  queryParams?: Params;
}

type SavedState =
  | {
      user: string;
      password: string;
    }
  | {
      ssoAuthPromise: Promise<
        ResponseData<any, string> & {
          provider: 'apple' | 'facebook';
        }
      >;
      ssoDetailsPromise: Promise<SSOUser | undefined>;
      /**
       * The original response from the appropriate FLN login endpoint
       * Should always be an `SSOActionResponse` but is typed as AuthResponse
       * to reduce type messiness in the usages
       */
      ssoActionPromise: Promise<ResponseData<AuthResponse, LoginError>>;
    };

/**
 * Service which provides an interface to backend endpoints for the login/signup funnel
 */
@Injectable({
  providedIn: 'root',
})
export class LoginSignupService {
  private savedState: SavedState = {
    user: '',
    password: '',
  };

  constructor(
    private auth: Auth,
    @Inject(AUTH_CONFIG) private authConfig: AuthConfig,
    private rawHttp: HttpClient,
    private freelancerHttp: FreelancerHttp,
    private activatedRoute: ActivatedRoute,
    private facebook: Facebook,
    private apple: AppleSSO,
    private location: Location,
    private cookies: CookieService,
    private router: Router,
  ) {}

  login(
    user: string,
    password: string,
  ): Promise<ResponseData<AuthResponse, LoginError>> {
    return this.auth.deviceToken$
      .pipe(take(1))
      .toPromise()
      .then(deviceToken => {
        // return a custom error because passing undefined
        // to the backend will result in `InvalidInput`
        if (!deviceToken) {
          return {
            status: 'error',
            errorCode: ErrorCodeApi.AUTH_DEVICE_TOKEN_INVALID,
          };
        }
        return this.freelancerHttp
          .post<AuthResponseAjax, LoginError>(
            'auth/login.php',
            {
              user,
              password,
              device_token: deviceToken,
            },
            {
              isGaf: true,
              serializeBody: true,
            },
          )
          .pipe(
            take(1),
            map(responseData =>
              transformResponseData(responseData, transformAuthResponse),
            ),
          )
          .toPromise();
      });
  }

  verify(
    preLoginToken: string,
    password: string,
  ): Promise<ResponseData<AuthSuccessResponseAjax, LoginError>> {
    return this.auth.deviceToken$
      .pipe(take(1))
      .toPromise()
      .then(deviceToken => {
        if (!deviceToken) {
          return {
            status: 'error',
            errorCode: ErrorCodeApi.AUTH_DEVICE_TOKEN_INVALID,
          };
        }
        return this.freelancerHttp
          .post<AuthSuccessResponseAjax, LoginError>(
            'auth/verify2FALogin.php',
            {
              totp: password,
              device_token: deviceToken,
              pre_login_token: preLoginToken,
            },
            {
              isGaf: true,
              serializeBody: true,
            },
          )
          .pipe(take(1))
          .toPromise();
      });
  }

  resend2FACode(
    preLoginToken: string,
    method?: TotpMethod,
  ): Promise<ResponseData<TwoFactorResponse, LoginError>> {
    return this.auth.deviceToken$
      .pipe(take(1))
      .toPromise()
      .then(deviceToken => {
        if (!deviceToken) {
          return {
            status: 'error',
            errorCode: ErrorCodeApi.AUTH_DEVICE_TOKEN_INVALID,
          };
        }

        return this.freelancerHttp
          .post<TwoFactorResponseAjax, LoginError>(
            'auth/send2FAToken.php',
            {
              '2fa_method': method,
              device_token: deviceToken,
              pre_login_token: preLoginToken,
            },
            {
              isGaf: true,
              serializeBody: true,
            },
          )
          .pipe(
            take(1),
            map(responseData =>
              transformResponseData(responseData, transformTwoFactorResponse),
            ),
          )
          .toPromise();
      });
  }

  appleLogin(
    authResponse: AppleSignInResponse,
  ): Promise<
    ResponseData<AuthSuccessResponseAjax | SSOActionResponse, LoginError>
  > {
    return this.freelancerHttp
      .post<SSOResponseAjax, LoginError>(
        'auth/appleLogin.php',
        {
          code: authResponse.authorizationCode,
          client_type: 1,
          client_id: 'com.freelancer.main',
        },
        {
          isGaf: true,
          serializeBody: true,
        },
      )
      .pipe(take(1))
      .toPromise()
      .then(response => {
        if (response.status === 'error' || 'token' in response.result) {
          return response as ResponseData<AuthSuccessResponseAjax, LoginError>;
        }

        if (response.result.action === 'user_apple_link') {
          return {
            status: 'success',
            result: {
              action: 'link',
              ssoToken: response.result.apple_identity_token,
            },
          };
        }
        if (response.result.action === 'user_apple_signup') {
          return {
            status: 'success',
            result: {
              action: 'signup',
              ssoToken: response.result.apple_identity_token,
            },
          };
        }
        assertNever(response.result.action);
      });
  }

  appleLoginLink(
    email: string,
    password: string,
    appleIdentityToken: string,
  ): Promise<ResponseData<AuthSuccessResponseAjax, LoginError>> {
    return this.freelancerHttp
      .post<AuthSuccessResponseAjax, LoginError>(
        'auth/appleLinkLogin.php',
        {
          email,
          password,
          apple_identity_token: appleIdentityToken,
          client_type: 1,
          client_id: 'com.freelancer.main',
        },
        {
          isGaf: true,
          serializeBody: true,
        },
      )
      .pipe(take(1))
      .toPromise();
  }

  facebookLogin(
    authResponse: FacebookAuthResponse,
  ): Promise<
    ResponseData<AuthSuccessResponseAjax | SSOActionResponse, LoginError>
  > {
    return this.freelancerHttp
      .post<AuthSuccessResponseAjax, LoginError>(
        'auth/facebookLogin.php',
        {
          // mobile and desktop facebook sso take slightly different params
          // due to differences in the auth response from the Facebook SDK
          // mobile has no signed response and uses the facebook ID instead
          mobile: !isDefined(authResponse.signedRequest),
          app_id: this.facebook.appId,
          credentials: authResponse.signedRequest,
          access_token: authResponse.accessToken,
          facebook_id: authResponse.userID,
        },
        {
          isGaf: true,
          serializeBody: true,
          errorWhitelist: [
            ErrorCodeApi.AUTH_FACEBOOK_EMAIL_EXISTS, // need to link
            ErrorCodeApi.AUTH_USER_MISSING, // need to signup
            ErrorCodeApi.FACEBOOK_EMAIL_NOT_FOUND, // can signup by using their own email
          ],
        },
      )
      .pipe(take(1))
      .toPromise()
      .then(response => {
        if (response.status === 'success') {
          return response;
        }

        switch (response.errorCode) {
          case ErrorCodeApi.AUTH_FACEBOOK_EMAIL_EXISTS:
            return {
              status: 'success',
              result: {
                action: 'link',
              },
            };

          case ErrorCodeApi.AUTH_USER_MISSING:
            return {
              status: 'success',
              result: {
                action: 'signup',
              },
            };
          default:
            return response;
        }
      });
  }

  facebookLinkLogin(
    email: string,
    password: string,
    authResponse: FacebookAuthResponse,
  ): Promise<ResponseData<AuthSuccessResponseAjax, LoginError>> {
    return this.freelancerHttp
      .post<AuthSuccessResponseAjax, LoginError>(
        'auth/facebookLinkLogin.php',
        {
          mobile: !isDefined(authResponse.signedRequest),
          email,
          password,
          credentials: authResponse.signedRequest,
          access_token: authResponse.accessToken,
          facebook_id: authResponse.userID,
        },
        {
          isGaf: true,
          serializeBody: true,
        },
      )
      .pipe(take(1))
      .toPromise();
  }

  checkUserDetails(
    user: {
      username?: string;
      email?: string;
    },
    password?: string,
  ): Promise<ResponseData<undefined, UserCheckError>> {
    return this.freelancerHttp
      .post<undefined, UserCheckError>('users/0.1/users/check', {
        user,
        password,
      })
      .pipe(take(1))
      .toPromise();
  }

  signup({
    email,
    username,
    role,
    password,
    privacyConsent,
    personalUse,
    ssoDetails,
    ssoResponseToken,
    captcha,
  }: {
    email: string;
    username: string;
    role: RoleApi;
    password: string;
    privacyConsent: boolean;
    personalUse?: boolean;
    // todo make this facebookOauthDetails and appleOauthToken
    ssoDetails?: FacebookAuthResponse | AppleSignInResponse;
    ssoResponseToken?: string;
    captcha?: {
      challenge: string;
      response: string;
    };
  }): Promise<ResponseData<AuthSuccessResponseAjax, LoginError>> {
    const {
      project_collaboration_invitation,
      contest_collaboration_invitation,
    } = this.activatedRoute.snapshot.queryParams;
    const referralSignup = this.authConfig.referralCookie
      ? this.cookies.get(this.authConfig.referralCookie)
      : undefined;

    // if facebook data is provided, use facebook endpoint
    const endpoint = !ssoDetails
      ? 'users/0.1/users'
      : 'userID' in ssoDetails
      ? 'users/0.1/users/facebook'
      : 'users/0.1/users/apple';
    return this.freelancerHttp
      .post<UserCreateResultApi, LoginError>(
        endpoint,
        {
          user: {
            email,
            username,
            role,
          },
          password,
          captcha,
          signup_meta: {
            privacy_consent: privacyConsent,
          },
          facebook_id:
            ssoDetails && 'userID' in ssoDetails
              ? ssoDetails.userID
              : undefined,
          access_token:
            ssoDetails && 'userID' in ssoDetails
              ? ssoDetails.accessToken
              : undefined,
          apple_identity_token: ssoResponseToken,
          // submit recovery email when needed for apple email
          recovery_email: ssoResponseToken ? email : undefined,
          extra: {
            referral_signup: referralSignup,
            project_collaboration_invitation,
            contest_collaboration_invitation,
            business_user:
              // use value if set; defaults to false
              isDefined(personalUse) && !personalUse
                ? // this endpoint only accepts strings
                  'true'
                : 'false',
            // send this here as well because facebook signup doesn't use signup_meta
            privacy_consent:
              // use value if set; defauls to true
              isDefined(privacyConsent) && !privacyConsent ? 'false' : 'true',
          },
        },
        {},
      )
      .pipe(
        take(1),
        map(response =>
          transformResponseData(response, transformUserCreateResonse),
        ),
      )
      .toPromise();
  }

  /**
   * Handle successful authentication, be it on login or signup
   */
  handleSuccess(
    action: 'login' | 'signup',
    userId: number,
    authToken: string,
    rememberLogin: boolean,
    redirectParams?: RedirectParams,
  ): Promise<boolean | undefined> {
    // set auth session (automatically sets cookies)
    this.auth.setSession(userId.toString(), authToken);
    // clear referral signup cookies if set
    if (this.authConfig.referralCookie) {
      this.cookies.remove(this.authConfig.referralCookie);
    }

    const crossDomainSSOPromise = this.setCrossDomainSSO(
      userId,
      authToken,
      rememberLogin,
    );

    const redirectPromise = this.getRedirectUrl(action, redirectParams);

    // wait for both reqest chains to finish, then redirect
    return Promise.all([redirectPromise, crossDomainSSOPromise]).then(
      ([redirectUrl]) => {
        if (!redirectUrl) {
          return;
        }

        // absolute URL: do a hard navigate
        if (redirectUrl.startsWith('http')) {
          return this.location.redirect(redirectUrl).toPromise();
        }

        // parse query params and fragments in the nextUrl
        const urlTree = this.router.parseUrl(redirectUrl);

        return this.location.navigateByUrl(urlTree).toPromise();
      },
    );
  }

  /**
   * Logs a user in on other domains that they should be logged in on.
   * Fetches domains from `getCrossDomainSSODomains.php`, then sends requests
   * to those domains to set cookies on them.
   */
  setCrossDomainSSO(
    userId: number,
    authToken: string,
    rememberLogin: boolean,
  ): Promise<void> {
    // this is equivalent to the `serializeBody` option for freelancerHttp
    // needs to be manually done since we're using raw httpClient for the other domains
    const formBody = this.freelancerHttp._serialize({
      userId,
      authToken,
      rememberLogin,
    });

    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/x-www-form-urlencoded',
    );

    return this.freelancerHttp
      .get<CrossDomainSSODomainsGetResultAjax>(
        'auth/getCrossDomainSSODomains.php',
        { isGaf: true },
      )
      .pipe(take(1))
      .toPromise()
      .then(response => {
        if (response.status === 'error') {
          return;
        }
        return Promise.all(
          response.result.domains.map(domain =>
            this.rawHttp
              .post<CrossDomainSsoPostResultAjax>(
                `${domain}/ajax-api/auth/crossDomainSSO.php`,
                formBody,
                {
                  headers,
                  withCredentials: true, // send and receive cookies
                },
              )
              .pipe(
                // silence any errors
                catchError(_ => Promise.resolve()),
                take(1),
              )
              .toPromise(),
          ),
        ).then();
      });
  }

  /**
   * Returns the next route to load after logging in or signing up
   *
   * Note that this is only called on successful logins and other redirections
   * may still occur for failed attempts.
   *
   * Eg. Suspended users may be redirected to the suspended account page.
   */
  getRedirectUrl(
    action: 'login' | 'signup',
    { redirectDisabled = false, queryParams }: RedirectParams = {},
  ): Promise<string> {
    const {
      next,
      goto,
      project_collaboration_invitation,
      contest_collaboration_invitation,
    } = queryParams || this.activatedRoute.snapshot.queryParams;

    const endpoint =
      action === 'login'
        ? 'auth/getLoginRedirectUrl.php'
        : 'auth/getSignupRedirectUrl.php';

    // TODO: go to new-freelancer for freelancers on signup.
    const defaultUrl = 'dashboard';

    return this.freelancerHttp
      .post<RedirectUrlGetResultAjax>(
        endpoint,
        {
          redirect_disabled: redirectDisabled.toString(),
          next: next && decodeURIComponent(next),
          goto,
          project_collaboration_invitation,
          contest_collaboration_invitation,
        },
        { isGaf: true, serializeBody: true },
      )
      .pipe(take(1))
      .toPromise()
      .then(response =>
        response.status === 'success'
          ? response.result.redirect_url
          : defaultUrl,
      );
  }

  resetPassword(email: string) {
    return this.rawHttp
      .post(
        `${this.authConfig.baseUrl}/forgot`,
        this.freelancerHttp._serialize({ email }),
      )
      .pipe(
        map(
          () =>
            ({
              status: 'success',
              result: undefined,
            } as const),
        ),
        catchError(_ =>
          Rx.of({
            status: 'error',
            errorCode: 'UNKNOWN_ERROR',
          } as const),
        ),
      )
      .toPromise<ResponseData<undefined, 'UNKNOWN_ERROR'>>();
  }

  /**
   * Change user password (new function from aco)
   */
  changePassword({
    currentPassword,
    newPassword,
  }: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ResponseData<undefined, 'UNKNOWN_ERROR'>> {
    return this.freelancerHttp
      .post<undefined, 'UNKNOWN_ERROR'>(
        `user/updateUserPassword.php`,
        {
          oldPassword: currentPassword,
          newPassword,
          newPasswordConfirmation: newPassword,
        },
        {
          withCredentials: true,
          isGaf: true,
          serializeBody: true,
        },
      )
      .toPromise();
  }

  /**
   * Triggers an SSO login flow.
   *
   * Calls the appropriate SDK to authenticate the user,
   * then fetches user details and sends the data to our auth backend.
   */
  triggerSSOLogin(
    provider: 'facebook' | 'apple',
  ): {
    /**
     * Promise that resolves when the user has submitted or cancelled their login,
     * returning either a successful auth response or an error
     */
    authPromise: Promise<
      | SSOResponseData<'facebook', FacebookAuthResponse>
      | SSOResponseData<'apple', AppleSignInResponse>
    >;
    /**
     * Promise that fetches a user's details through the SSO provider
     * Errors if the initial authPromise errored
     */
    detailsPromise: Promise<SSOUser | undefined>;
    /**
     * Promise that logs the user in via the FLN auth backend
     * Errors if the initial authPromise errored
     */
    loginPromise: Promise<
      ResponseData<AuthSuccessResponseAjax | SSOActionResponse, LoginError>
    >;
  } {
    const ssoService = provider === 'facebook' ? this.facebook : this.apple;
    // trigger the login
    const authPromise: Promise<
      | SSOResponseData<'facebook', FacebookAuthResponse, FacebookSignInError>
      | SSOResponseData<'apple', AppleSignInResponse, AppleSignInError>
    > = ssoService.login();
    // get user details after login
    const detailsPromise = authPromise.then(response => {
      if (response.status === 'error') {
        return undefined;
      }
      // casting `response` here is safe
      // TS is confused because authPromise is typed as facebookresponse | appleresponse
      // but really it can only be whatever type the ssoService is parametrised with
      return ssoService.getUserDetails((response as any).result);
    });
    // try to log in via our backend
    const loginPromise = authPromise.then(response => {
      if (response.status === 'error') {
        // forward error from SSO attempt
        return response;
      }
      if (response.provider === 'facebook') {
        return this.facebookLogin(response.result);
      }
      return this.appleLogin(response.result);
    });

    return {
      authPromise,
      detailsPromise,
      loginPromise,
    };
  }

  /**
   * Saves state that needs to be shared across login / signup when switching routes
   */
  saveState(state: LoginSignupService['savedState']): void {
    this.savedState = state;
  }

  /**
   * Returns and clears the saved state.
   */
  getSavedState() {
    const state = this.savedState;
    this.savedState = {
      user: '',
      password: '',
    };
    return state;
  }
}
