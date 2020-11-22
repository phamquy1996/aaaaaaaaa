import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ResponseData } from '@freelancer/datastore';
import { EmailIsAvailableForArrowGetResultAjaxApi } from '@freelancer/datastore/collections';
import { Facebook } from '@freelancer/facebook';
import { FreelancerHttp } from '@freelancer/freelancer-http';
import { Location } from '@freelancer/location';
import { validEmailRegex } from '@freelancer/ui/validators';
import { isDefined } from '@freelancer/utils';
import { CookieService } from '@laurentgoudet/ngx-cookie';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import { take } from 'rxjs/operators';
import { AuthSuccessResponseAjax } from '../login-signup.backend-model';
import { LoginSignupService } from '../login-signup.service';
import { ARROW_LOGIN_SIGNUP_MARKETING_CONFIG } from './arrow-login-signup-marketing.config';
import { ArrowLoginSignupMarketingConfig } from './arrow-login-signup-marketing.interface';
import {
  ArrowAuthResponseAjaxApi,
  ArrowLoginSignupError,
  UserIsArrowCheck,
} from './arrow-login-signup.backend-model';

export enum AccountSource {
  ARROW = 'arrow',
  FREELANCER = 'freelancer',
}

@Injectable({
  providedIn: 'root',
})
export class ArrowLoginSignupService {
  constructor(
    private freelancerHttp: FreelancerHttp,
    private loginSignupService: LoginSignupService,
    private cookies: CookieService,
    private facebook: Facebook,
    private http: HttpClient,
    private location: Location,
    @Inject(ARROW_LOGIN_SIGNUP_MARKETING_CONFIG)
    private arrowLoginSignupMarketingConfig: ArrowLoginSignupMarketingConfig,
  ) {}

  getAccountSource(
    emailOrUsername: string,
  ): Promise<AccountSource | undefined> {
    if (validEmailRegex.test(emailOrUsername)) {
      return Promise.all([
        this.loginSignupService.checkUserDetails({
          email: emailOrUsername,
        }),
        this.checkArrowUserEmail(emailOrUsername),
      ]).then(([emailCheck, arrowResponse]) => {
        if (
          arrowResponse.status === 'success' &&
          !arrowResponse.result.isAvailable
        ) {
          return AccountSource.ARROW;
        }
        if (
          emailCheck.status === 'error' &&
          emailCheck.errorCode === ErrorCodeApi.EMAIL_ALREADY_IN_USE
        ) {
          return AccountSource.FREELANCER;
        }
      });
    }

    return Promise.all([
      this.loginSignupService.checkUserDetails({
        username: emailOrUsername,
      }),
      this.checkUserIsArrow(emailOrUsername),
    ]).then(([freelancerReponse, arrowResponse]) => {
      if (
        arrowResponse.status === 'success' &&
        arrowResponse.result.isArrowUser
      ) {
        return AccountSource.ARROW;
      }
      if (
        freelancerReponse.status === 'error' &&
        freelancerReponse.errorCode === ErrorCodeApi.USERNAME_ALREADY_IN_USE
      ) {
        return AccountSource.FREELANCER;
      }
    });
  }

  checkArrowUserEmail(
    email: string,
  ): Promise<
    ResponseData<
      EmailIsAvailableForArrowGetResultAjaxApi,
      ArrowLoginSignupError
    >
  > {
    return this.freelancerHttp
      .get<EmailIsAvailableForArrowGetResultAjaxApi, ArrowLoginSignupError>(
        'auth/arrow/checkEmailExists.php',
        {
          params: { email },
          isGaf: true,
        },
      )
      .toPromise();
  }

  checkUserIsArrow(
    user: string,
  ): Promise<ResponseData<UserIsArrowCheck, ArrowLoginSignupError>> {
    return this.freelancerHttp
      .get<UserIsArrowCheck, ArrowLoginSignupError>(
        'auth/arrow/checkUserIsArrow.php',
        {
          params: { user },
          isGaf: true,
        },
      )
      .toPromise();
  }

  login(
    user: string,
    password: string,
  ): Promise<ResponseData<ArrowAuthResponseAjaxApi, ArrowLoginSignupError>> {
    return this.freelancerHttp
      .post<ArrowAuthResponseAjaxApi, ErrorCodeApi>(
        `auth/arrow/login.php`,
        {
          user,
          password,
        },
        {
          isGaf: true,
          serializeBody: true,
        },
      )
      .pipe(take(1))
      .toPromise();
  }

  loginCreate(
    email: string,
    password: string,
    username: string,
  ): Promise<ResponseData<ArrowAuthResponseAjaxApi, ArrowLoginSignupError>> {
    return this.freelancerHttp
      .post<ArrowAuthResponseAjaxApi, ErrorCodeApi>(
        'auth/arrow/loginCreate.php',
        {
          email,
          password,
          username,
        },
        {
          isGaf: true,
          serializeBody: true,
        },
      )
      .pipe(take(1))
      .toPromise();
  }

  loginLink(
    email: string,
    credentials: string,
    loginType: 'password' | 'facebook' = 'password',
  ): Promise<ResponseData<ArrowAuthResponseAjaxApi, ArrowLoginSignupError>> {
    return this.freelancerHttp
      .post<ArrowAuthResponseAjaxApi, ErrorCodeApi>(
        'auth/arrow/loginLink.php',
        {
          email,
          credentials,
          login_type: loginType,
        },
        {
          isGaf: true,
          serializeBody: true,
        },
      )
      .pipe(take(1))
      .toPromise();
  }

  loginFacebookLink(
    email: string,
  ): Promise<ResponseData<ArrowAuthResponseAjaxApi, ArrowLoginSignupError>> {
    return this.facebook.login().then(response => {
      if (response.status === 'error' || !response.result.signedRequest) {
        return {
          status: 'error',
          errorCode: ErrorCodeApi.AUTH_FACEBOOK_LINK_FAILED,
        } as const;
      }
      return this.loginLink(email, response.result.signedRequest, 'facebook');
    });
  }

  resetPassword(
    email: string,
  ): Promise<ResponseData<undefined, ArrowLoginSignupError>> {
    return this.freelancerHttp
      .post<undefined, ErrorCodeApi>(
        'auth/arrow/resetPassword.php',
        {
          email,
        },
        {
          isGaf: true,
          serializeBody: true,
        },
      )
      .pipe(take(1))
      .toPromise();
  }

  signup({
    email,
    country,
    password,
    username,
    fullname,
    userType,
    privacyConsent,
    personalUse,
    receivePromotionalEmail,
  }: {
    email: string;
    country: string;
    password: string;
    username: string;
    fullname: string;
    userType: string;
    privacyConsent?: boolean;
    personalUse?: boolean;
    receivePromotionalEmail?: boolean;
  }): Promise<ResponseData<ArrowAuthResponseAjaxApi, ArrowLoginSignupError>> {
    return this.freelancerHttp
      .post<ArrowAuthResponseAjaxApi, ErrorCodeApi>(
        'auth/arrow/signup.php',
        {
          email,
          country,
          password,
          username,
          fullname,
          userType,
          privacy_consent: privacyConsent,
          // default to false if unset
          business_user: isDefined(personalUse) ? !personalUse : false,
          arrow_marketing: receivePromotionalEmail,
        },
        {
          isGaf: true,
          serializeBody: true,
        },
      )
      .pipe(take(1))
      .toPromise();
  }

  signupLink(
    email: string,
    country: string,
    password: string,
    flnPassword: string,
    fullname: string,
  ): Promise<ResponseData<ArrowAuthResponseAjaxApi, ArrowLoginSignupError>> {
    return this.freelancerHttp
      .post<ArrowAuthResponseAjaxApi, ErrorCodeApi>(
        'auth/arrow/signupLink.php',
        {
          email,
          country,
          password,
          flnPassword,
          fullname,
        },
        {
          isGaf: true,
          serializeBody: true,
        },
      )
      .pipe(take(1))
      .toPromise();
  }

  setExternalCookies(response: ArrowAuthResponseAjaxApi) {
    Object.values(response.external_cookies).forEach(cookie => {
      this.cookies.put(cookie.name, cookie.value, {
        expires: new Date(cookie.expiry * 1000),
      });
    });
  }

  isArrowAuthResponseAjaxApi(
    response: ArrowAuthResponseAjaxApi | AuthSuccessResponseAjax,
  ): response is ArrowAuthResponseAjaxApi {
    return (
      (response as ArrowAuthResponseAjaxApi).external_cookies !== undefined
    );
  }

  registerForArrowMarketing(email: string): Promise<Object | void> | undefined {
    if (this.arrowLoginSignupMarketingConfig) {
      // Make request to external endpoint for tracking new signups who
      // opt in to receiving promotional emails. See T140948
      return this.http
        .post(
          this.arrowLoginSignupMarketingConfig.arrowMarketingEndpoint,
          {
            userEmail: email,
            userAnonymousIdGids: this.cookies.get('_gid'),
            userAnonymousIdGAs: this.cookies.get('_ga'),
            userId: this.cookies.get(
              this.arrowLoginSignupMarketingConfig.userIdCookie,
            ),
            preferredLanguage: this.cookies.get(
              this.arrowLoginSignupMarketingConfig.languageCookie,
            ),
            pageUrl: this.location.href,
          },
          {
            headers: new HttpHeaders().append(
              'Content-Type',
              'application/json',
            ),
          },
        )
        .pipe(take(1))
        .toPromise();
    }
  }
}
