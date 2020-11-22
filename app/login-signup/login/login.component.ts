import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AppleSignInResponse,
  AppleSSO,
  SSOResponseData,
  SSOUser,
} from '@freelancer/auth';
import { ResponseData } from '@freelancer/datastore';
import { TotpMethod } from '@freelancer/datastore/collections';
import { Facebook, FacebookAuthResponse } from '@freelancer/facebook';
import {
  AuthResponse,
  AuthSuccessResponseAjax,
  LoginError,
  LoginSignupService,
  TwoFactorResponse,
} from '@freelancer/login-signup';
import { ThreatmetrixService } from '@freelancer/threatmetrix';
import { ContainerSize } from '@freelancer/ui/container';
import { BackgroundColor } from '@freelancer/ui/page-layout';
import { required } from '@freelancer/ui/validators';
import { isDefined } from '@freelancer/utils';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import { SuccessAction } from '../success-redirect/success-redirect.component';

export enum LoginStep {
  CREDENTIALS = 0,
  TWO_FACTOR_AUTH = 1,
  SUCCESS = 2,
  RESET_PASSWORD = 3,
  FACEBOOK_LINK = 4,
}

@Component({
  selector: 'app-login',
  template: `
    <ng-container [ngSwitch]="currentStep">
      <app-credentials-form
        *ngSwitchCase="LoginStep.CREDENTIALS"
        [response]="loginPromise && (loginPromise | async)"
        [showAppleSignin]="showAppleSignin"
        [facebookLoginStatusLoaded]="
          facebookLoginStatusPromise &&
          (facebookLoginStatusPromise | async) === true
        "
        [formGroup]="formGroup"
        [subHeader]="subHeader"
        (complete)="handleLogin()"
        (resetPassword)="handleResetPassword()"
        (appleClick)="handleSSOLogin('apple')"
        (facebookClick)="handleSSOLogin('facebook')"
        (switchToSignup)="handleSwitchToSignup()"
      ></app-credentials-form>
      <app-two-factor-form
        *ngSwitchCase="LoginStep.TWO_FACTOR_AUTH"
        [method]="twoFactorMethodPromise | async"
        [resendResponse]="resendPromise && (resendPromise | async)"
        [response]="twoFactorPromise && (twoFactorPromise | async)"
        [formGroup]="twoFactorFormGroup"
        (back)="handleBack()"
        (complete)="handleVerify()"
        (resend)="handleResend()"
      ></app-two-factor-form>
      <app-reset-password
        *ngSwitchCase="LoginStep.RESET_PASSWORD"
        [domain]="domain"
        [email]="formGroup.get('user')?.value"
        [resetService]="loginSignup"
        (back)="handleBack()"
      ></app-reset-password>
      <app-facebook-link
        *ngSwitchCase="LoginStep.FACEBOOK_LINK"
        [user]="ssoDetailsPromise | async"
        [response]="ssoLinkPromise && (ssoLinkPromise | async)"
        [formGroup]="formGroup"
        (back)="handleBack()"
        (complete)="handleSSOLink()"
        (resetPassword)="handleResetPassword()"
      ></app-facebook-link>
      <app-success-redirect
        *ngSwitchCase="LoginStep.SUCCESS"
        [action]="SuccessAction.LOGIN"
      ></app-success-redirect>
    </ng-container>
  `,
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  BackgroundColor = BackgroundColor;
  ContainerSize = ContainerSize;

  LoginStep = LoginStep;
  SuccessAction = SuccessAction;

  showAppleSignin: boolean;

  currentStep = LoginStep.CREDENTIALS;
  formGroup = this.fb.group(
    {
      user: ['', required($localize`Please enter your username or email`)],
      password: ['', required($localize`Please enter your password`)],
      rememberMe: [false],
    },
    {
      updateOn: 'submit',
    },
  );
  twoFactorFormGroup = this.fb.group({
    totp: '',
  });

  twoFactorMethodPromise: Promise<TotpMethod | undefined>;

  loginPromise: Promise<ResponseData<AuthResponse, LoginError>>;
  resendPromise: Promise<ResponseData<TwoFactorResponse, LoginError>>;
  twoFactorPromise: Promise<ResponseData<AuthSuccessResponseAjax, LoginError>>;

  /**
   * SSO promise via the appropriate SDK.
   * Returns the SSO details for the provider
   */
  ssoAuthPromise: Promise<
    | SSOResponseData<'facebook', FacebookAuthResponse>
    | SSOResponseData<'apple', AppleSignInResponse>
  >;
  ssoDetailsPromise: Promise<SSOUser | undefined>;
  ssoLinkPromise: Promise<ResponseData<AuthSuccessResponseAjax, LoginError>>;
  facebookLoginStatusPromise: Promise<boolean>;

  @Input() isModal = false;
  @Input() subHeader?: string;
  @Input() domain = 'Freelancer.com';

  @Output() success = new EventEmitter<number>();
  @Output() switchToSignup = new EventEmitter();

  constructor(
    public loginSignup: LoginSignupService,
    private apple: AppleSSO,
    private facebook: Facebook,
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private threatmetrix: ThreatmetrixService,
  ) {}

  ngOnInit() {
    this.facebookLoginStatusPromise = this.facebook.loadLoginStatus();

    this.showAppleSignin = this.apple.isEnabled();

    const savedState = this.loginSignup.getSavedState();
    if ('user' in savedState) {
      this.formGroup.controls.user.setValue(savedState.user);
      this.formGroup.controls.password.setValue(savedState.password);
    } else {
      this.ssoAuthPromise = savedState.ssoAuthPromise;
      this.ssoDetailsPromise = savedState.ssoDetailsPromise;
      this.loginPromise = savedState.ssoActionPromise;
      this.setStep(LoginStep.FACEBOOK_LINK);
    }

    this.threatmetrix.load();
  }

  setStep(step: LoginStep) {
    this.currentStep = step;
    this.changeDetectorRef.markForCheck();
  }

  handleLogin() {
    this.loginPromise = this.loginSignup
      .login(this.formGroup.value.user, this.formGroup.value.password)
      .then(async response => {
        // if the user is suspended, we redirect them to a special page
        // suspended users can't log in so we can't do this as part of handleSuccess
        if (
          response.status === 'error' &&
          response.errorCode === ErrorCodeApi.AUTH_ACCOUNT_SUSPENDED
        ) {
          // maintain busy state until the navigation goes through
          await this.router.navigate(['users/usersuspended.php']);
          return response;
        }
        return response;
      });

    this.twoFactorMethodPromise = this.loginPromise.then(response => {
      if (
        // failed login; no 2FA message
        response.status !== 'success' ||
        // successful login; no 2FA message
        !('preLoginToken' in response.result)
      ) {
        return;
      }
      return response.result.method;
    });
    this.loginPromise.then(response => {
      if (response.status === 'success') {
        if ('preLoginToken' in response.result) {
          this.setStep(LoginStep.TWO_FACTOR_AUTH);
        } else if ('token' in response.result) {
          this.handleSuccess(response.result.user, response.result.token);
        } else {
          // do nothing
          // this case should only happen for linking
        }
      }
    });
  }

  handleVerify() {
    this.twoFactorPromise = this.loginPromise.then(response => {
      if (
        response.status !== 'success' ||
        !('preLoginToken' in response.result)
      ) {
        // this shouldn't happen because we shouldn't be able to call `handleVerify`
        // when the loginPromise hasn't returned success
        return {
          status: 'error',
          errorCode: 'UNKNOWN_ERROR',
        };
      }

      return this.loginSignup.verify(
        response.result.preLoginToken,
        this.twoFactorFormGroup.value.totp,
      );
    });

    this.twoFactorPromise.then(response => {
      if (response.status === 'success') {
        this.handleSuccess(response.result.user, response.result.token);
      }
    });
  }

  handleResend() {
    this.resendPromise = this.loginPromise.then(response => {
      if (
        response.status !== 'success' ||
        !('preLoginToken' in response.result)
      ) {
        // this shouldn't happen because we shouldn't be able to call `handleVerify`
        // when the loginPromise hasn't returned success
        return {
          status: 'error',
          errorCode: 'UNKNOWN_ERROR',
        } as const;
      }

      return this.loginSignup.resend2FACode(
        response.result.preLoginToken,
        response.result.method,
      );
    });
    // update preLoginToken in loginPromise.
    this.loginPromise = this.resendPromise;
  }

  handleSuccess(userId: number, authToken: string) {
    this.setStep(LoginStep.SUCCESS);

    this.loginSignup
      .handleSuccess(
        'login',
        userId,
        authToken,
        this.formGroup.value.rememberMe,
        {
          redirectDisabled: this.isModal,
        },
      )
      .then(() => this.success.emit(userId));
  }

  handleBack() {
    // always go back to credentials form
    this.setStep(LoginStep.CREDENTIALS);
  }

  handleResetPassword() {
    this.setStep(LoginStep.RESET_PASSWORD);
  }

  handleSSOLogin(provider: 'apple' | 'facebook') {
    const {
      authPromise,
      detailsPromise,
      loginPromise,
    } = this.loginSignup.triggerSSOLogin(provider);

    this.ssoAuthPromise = authPromise;
    this.ssoDetailsPromise = detailsPromise;
    this.loginPromise = loginPromise.then(async loginResponse => {
      if (loginResponse.status === 'error') {
        return loginResponse;
      }

      if ('token' in loginResponse.result) {
        this.handleSuccess(
          loginResponse.result.user,
          loginResponse.result.token,
        );
      } else if (loginResponse.result.action === 'signup') {
        this.handleSSOSwitchToSignup();
      } else if (loginResponse.result.action === 'link') {
        // don't return until the next step is fully ready to render
        const details = await this.ssoDetailsPromise;
        if (!details) {
          return {
            status: 'error',
            errorCode:
              provider === 'facebook'
                ? ErrorCodeApi.AUTH_FACEBOOK_LINK_FAILED
                : ErrorCodeApi.AUTH_APPLE_LINK_FAILED,
          } as const;
        }
        this.setStep(LoginStep.FACEBOOK_LINK);
      }
      return loginResponse;
    });
  }

  handleSSOLink() {
    this.ssoLinkPromise = Promise.all([
      this.loginPromise,
      this.ssoAuthPromise,
    ]).then(([loginResponse, ssoResponse]) => {
      if (
        ssoResponse.status !== 'success' ||
        loginResponse.status !== 'success'
      ) {
        // just typeguarding
        // this shouldn't happen because we shouldn't be able to call `handleFacebookLoginLink`
        // when the ssoAuthPromise hasn't returned success
        return {
          status: 'error',
          errorCode: 'UNKNOWN_ERROR',
        };
      }

      if (ssoResponse.provider === 'facebook') {
        return this.loginSignup.facebookLinkLogin(
          this.formGroup.value.user,
          this.formGroup.value.password,
          ssoResponse.result,
        );
      }

      // extra check for apple, which needs the `ssoToken` from the loginResponse
      if (
        !('action' in loginResponse.result) ||
        !isDefined(loginResponse.result.ssoToken)
      ) {
        // just typeguarding
        // this also shouldn't happen because we shouldn't be able to call `handleSSOLoginLink`
        // when we haven't been told to `link` with an SSOActionResponse
        return {
          status: 'error',
          errorCode: 'UNKNOWN_ERROR',
        };
      }

      return this.loginSignup.appleLoginLink(
        this.formGroup.value.user,
        this.formGroup.value.password,
        loginResponse.result.ssoToken,
      );
    });
    this.ssoLinkPromise.then(response => {
      if (response.status === 'success') {
        this.handleSuccess(response.result.user, response.result.token);
      }
    });
  }

  handleSwitchToSignup() {
    this.loginSignup.saveState({
      user: this.formGroup.value.user,
      password: this.formGroup.value.password,
    });

    this.switchToSignup.emit();
  }

  handleSSOSwitchToSignup() {
    // save facebook state and redirect to login to access link components
    this.loginSignup.saveState({
      ssoAuthPromise: this.ssoAuthPromise,
      ssoDetailsPromise: this.ssoDetailsPromise,
      ssoActionPromise: this.loginPromise,
    });

    this.switchToSignup.emit();
  }
}
