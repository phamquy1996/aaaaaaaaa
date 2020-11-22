import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AppleSignInResponse,
  AppleSSO,
  AuthConfig,
  AUTH_CONFIG,
  SSOResponseData,
  SSOUser,
} from '@freelancer/auth';
import { Datastore, ResponseData } from '@freelancer/datastore';
import { UserRequiresGdprCollection } from '@freelancer/datastore/collections';
import { Facebook, FacebookAuthResponse } from '@freelancer/facebook';
import {
  AuthResponse,
  AuthSuccessResponseAjax,
  LoginError,
  LoginSignupService,
  UserCheckError,
} from '@freelancer/login-signup';
import { ThreatmetrixService } from '@freelancer/threatmetrix';
import { ContainerSize } from '@freelancer/ui/container';
import { BackgroundColor } from '@freelancer/ui/page-layout';
import {
  maxLength,
  minLength,
  notEqualOtherControl,
  pattern,
  required,
  requiredTruthy,
  validEmailRegex,
  validUsernameRegex,
} from '@freelancer/ui/validators';
import { CookieService } from '@laurentgoudet/ngx-cookie';
import { RoleApi } from 'api-typings/common/common';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import * as Rx from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SuccessAction } from '../success-redirect/success-redirect.component';

enum SignupStep {
  DETAILS = 0,
  USERNAME_SELECT,
  ACCOUNT_TYPE,
  GDPR,
  FACEBOOK,
  CAPTCHA,
  SUCCESS,
  LOGIN_SUCCESS,
}

@Component({
  selector: 'app-signup',
  template: `
    <ng-container [ngSwitch]="currentStep">
      <app-details-form
        i18n="Create your Freelancer account"
        *ngSwitchCase="SignupStep.DETAILS"
        [showSSO]="true"
        [showAppleSignin]="showAppleSignin"
        [partnerDomain]="partnerDomain"
        [facebookLoginStatusLoaded]="
          facebookLoginStatusPromise &&
          (facebookLoginStatusPromise | async) === true
        "
        [formGroup]="detailsFormGroup"
        [response]="
          (checkDetailsPromise && (checkDetailsPromise | async)) ||
          (ssoLoginPromise && (ssoLoginPromise | async))
        "
        (complete)="handleSubmitDetails()"
        (appleClick)="handleSSOSignupClick('apple')"
        (facebookClick)="handleSSOSignupClick('facebook')"
        (switchToLogin)="handleSwitchToLogin()"
      ></app-details-form>
      <app-username-select-form
        *ngSwitchCase="SignupStep.USERNAME_SELECT"
        [email]="detailsFormGroup.get('email')?.value"
        [formGroup]="usernameFormGroup"
        [response]="signupPromise && (signupPromise | async)"
        (back)="handleBackAction()"
        (complete)="handleSubmitUsername()"
      ></app-username-select-form>
      <app-account-type-form
        *ngSwitchCase="SignupStep.ACCOUNT_TYPE"
        [employerLabel]="employerLabel"
        [formGroup]="accountTypeFormGroup"
        [freelancerLabel]="freelancerLabel"
        [response]="signupPromise && (signupPromise | async)"
        [subheaderText]="accountTypeSubheaderText"
        (back)="handleBackAction()"
        (complete)="handleSubmitAccountType()"
      ></app-account-type-form>
      <app-signup-gdpr-form
        *ngSwitchCase="SignupStep.GDPR"
        [formGroup]="gdprFormGroup"
        [response]="signupPromise && (signupPromise | async)"
        (back)="handleBackAction()"
        (complete)="handleSignup()"
      ></app-signup-gdpr-form>
      <app-facebook-signup
        *ngSwitchCase="SignupStep.FACEBOOK"
        [formGroup]="detailsFormGroup"
        [user]="ssoDetailsPromise | async"
        [response]="checkDetailsPromise && (checkDetailsPromise | async)"
        (complete)="handleSubmitDetails()"
        (switchToLogin)="handleSwitchToLogin()"
      ></app-facebook-signup>
      <app-captcha-form
        *ngSwitchCase="SignupStep.CAPTCHA"
        [formGroup]="captchaFormGroup"
        [response]="signupPromise && (signupPromise | async)"
        (back)="handleBackToStart()"
        (complete)="handleSignup()"
      ></app-captcha-form>
      <app-success-redirect
        *ngSwitchCase="SignupStep.SUCCESS"
        [action]="SuccessAction.SIGNUP"
      ></app-success-redirect>
      <!-- used for successful sso login on the /signup route -->
      <app-success-redirect
        *ngSwitchCase="SignupStep.LOGIN_SUCCESS"
        [action]="SuccessAction.LOGIN"
      ></app-success-redirect>
    </ng-container>
  `,
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  BackgroundColor = BackgroundColor;
  ContainerSize = ContainerSize;

  SignupStep = SignupStep;
  SuccessAction = SuccessAction;

  showAppleSignin: boolean;

  currentStep = SignupStep.DETAILS;
  emailControl = this.fb.control(null, [
    required($localize`Please enter an email address.`),
    pattern(validEmailRegex, $localize`Please enter a valid email address.`),
  ]);
  detailsFormGroup = this.fb.group(
    {
      email: this.emailControl,
      password: [
        null,
        [
          required($localize`Please enter a password.`),
          minLength(6, $localize`Password must be at least 6 characters`),
          maxLength(150, $localize`Password must be at most 150 characters`),
          pattern(
            /([a-z].*[0-9A-Z])|([0-9A-Z].*[a-z])/,
            $localize`Password must contain lowercase and uppercase letters or a number. `,
          ),
          notEqualOtherControl(
            this.emailControl,
            $localize`Password cannot be your email.`,
          ),
        ],
      ],
      termsOfUse: [
        null,
        [
          requiredTruthy(''), // Do not put an error message as it will not appear at the bottom of the <fl-label>
        ],
      ],
    },
    {
      updateOn: 'submit',
    },
  );
  usernameFormGroup = this.fb.group(
    {
      username: [
        null,
        [
          required($localize`Please provide a username`),
          pattern(
            validUsernameRegex,
            $localize`Username must be between 3 and 16 characters long and composed of only numbers and letters, starting with a letter.`,
          ),
        ],
      ],
    },
    {
      updateOn: 'submit',
    },
  );
  accountTypeFormGroup = this.fb.group({
    accountType: [null, [required($localize`Please select an account type`)]],
  });
  gdprFormGroup = this.fb.group({
    privacyConsent: [false],
    personalUse: [false],
  });
  captchaFormGroup = this.fb.group({
    response: ['', required($localize`Please fill out the CAPTCHA form`)],
    challenge: [''],
  });

  checkDetailsPromise: Promise<ResponseData<unknown, UserCheckError>>;
  ssoLoginPromise: Promise<ResponseData<AuthResponse, LoginError>>;
  signupPromise?: Promise<ResponseData<AuthSuccessResponseAjax, string>>;

  /**
   * SSO promise via the appropriate SDK.
   * Returns the sso details for the provider
   */
  ssoAuthPromise: Promise<
    | SSOResponseData<'facebook', FacebookAuthResponse>
    | SSOResponseData<'apple', AppleSignInResponse>
  >;
  ssoDetailsPromise: Promise<SSOUser | undefined>;
  facebookLoginStatusPromise: Promise<boolean>;

  private revalidateEmailPasswordSubscription?: Rx.Subscription;

  @Input() forceAccountType?: RoleApi;
  @Input() isModal = false;
  @Input() partnerDomain = 'Freelancer';
  @Input() employerLabel?: string;
  @Input() freelancerLabel?: string;
  @Input() accountTypeSubheaderText?: string;

  @Output() success = new EventEmitter<number>();
  @Output() switchToLogin = new EventEmitter();

  constructor(
    private activatedRoute: ActivatedRoute,
    @Inject(AUTH_CONFIG) private authConfig: AuthConfig,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cookies: CookieService,
    private fb: FormBuilder,
    private loginSignup: LoginSignupService,
    private apple: AppleSSO,
    private facebook: Facebook,
    private changeDetectorRef: ChangeDetectorRef,
    private datastore: Datastore,
    private route: ActivatedRoute,
    private threatmetrix: ThreatmetrixService,
  ) {}

  ngOnInit() {
    this.showAppleSignin = this.apple.isEnabled();
    this.facebookLoginStatusPromise = this.facebook.loadLoginStatus();

    const savedState = this.loginSignup.getSavedState();
    if ('user' in savedState) {
      this.detailsFormGroup.controls.email.setValue(savedState.user);
      this.detailsFormGroup.controls.password.setValue(savedState.password);
    } else if ('ssoAuthPromise' in savedState) {
      this.ssoAuthPromise = savedState.ssoAuthPromise;
      this.ssoDetailsPromise = savedState.ssoDetailsPromise;
      this.ssoLoginPromise = savedState.ssoActionPromise;
      this.setStep(SignupStep.FACEBOOK);
    }

    // Use URL Parameter if Email Address is set in the URL Parameter
    this.detailsFormGroup.controls.email.setValue(
      this.activatedRoute.snapshot.queryParams.email_address,
    );

    // force password control to revalidate when email is updated
    const emailControl = this.detailsFormGroup.controls.email;
    const passwordControl = this.detailsFormGroup.controls.password;
    this.revalidateEmailPasswordSubscription = emailControl.valueChanges.subscribe(
      _ => {
        if (passwordControl.touched && passwordControl.dirty) {
          passwordControl.updateValueAndValidity();
        }
      },
    );

    // This is a temporary solution to set the GDPR cookie.
    // We will move this to the logged out shell at
    // https://phabricator.tools.flnltd.com/T141066
    if (isPlatformBrowser(this.platformId) && this.authConfig.gdprCookie) {
      this.datastore
        .document<UserRequiresGdprCollection>('userRequiresGdpr')
        .valueChanges()
        .pipe(
          map(({ userRequiresGdpr }) => userRequiresGdpr),
          take(1),
        )
        .toPromise()
        .then(userRequiresGdpr => {
          if (this.authConfig.gdprCookie) {
            this.cookies.put(
              this.authConfig.gdprCookie,
              userRequiresGdpr.toString(),
            );
          }
        });
    }

    this.threatmetrix.load();
  }

  ngOnDestroy() {
    if (this.revalidateEmailPasswordSubscription) {
      this.revalidateEmailPasswordSubscription.unsubscribe();
    }
  }

  setStep(step: SignupStep) {
    this.currentStep = step;
    this.changeDetectorRef.markForCheck();
  }

  handleBackAction() {
    this.currentStep--;
  }

  handleBackToStart() {
    this.currentStep = SignupStep.DETAILS;
  }

  handleSubmitDetails() {
    this.checkDetailsPromise = this.loginSignup.checkUserDetails({
      email: this.detailsFormGroup.value.email,
    });
    this.checkDetailsPromise.then(response => {
      if (response.status === 'success') {
        this.setStep(SignupStep.USERNAME_SELECT);
      }
    });
  }

  handleSubmitUsername() {
    // username select step handles the checkUserDetails
    // TODO: move that validation logic into this OnInit for consistency?
    if (this.forceAccountType) {
      this.accountTypeFormGroup.patchValue({
        accountType: this.forceAccountType,
      });
      this.handleSignup();
    } else {
      this.setStep(SignupStep.ACCOUNT_TYPE);
    }
  }

  handleSubmitAccountType() {
    if (
      this.authConfig.gdprCookie &&
      this.cookies.get(this.authConfig.gdprCookie) === 'true' &&
      this.route.snapshot.queryParams.debug_skip_gdpr !== 'true'
    ) {
      // ask for privacy consent if user is European
      this.setStep(SignupStep.GDPR);
    } else {
      // assume privacy consent otherwise since user has no rights
      this.gdprFormGroup.patchValue({
        privacyConsent: true,
        personalUse: undefined,
      });
      this.handleSignup();
    }
  }

  handleSubmitGDPR() {
    this.handleSignup();
  }

  handleSignup() {
    if (this.ssoAuthPromise) {
      this.signupPromise = this.handleSSOSignup();
      return;
    }

    this.signupPromise = this.loginSignup.signup({
      ...this.usernameFormGroup.value,
      ...this.detailsFormGroup.value,
      ...this.gdprFormGroup.value,
      captcha: this.captchaFormGroup.value,
      role: this.accountTypeFormGroup.value.accountType,
    });
    this.signupPromise.then(response => {
      if (response.status === 'success') {
        this.handleSuccess(response.result.user, response.result.token);
        return;
      }
      if (response.errorCode === ErrorCodeApi.SIGNUP_CAPTCHA_REQUIRED) {
        this.captchaFormGroup.patchValue({
          challenge: response.requestId,
        });
        this.signupPromise = undefined;
        this.setStep(SignupStep.CAPTCHA);
      }
    });
  }

  async handleSSOSignup(): Promise<
    ResponseData<AuthSuccessResponseAjax, string>
  > {
    const auth = await this.ssoAuthPromise;
    const userDetails = await this.ssoDetailsPromise;
    const initialRequest = await this.ssoLoginPromise;
    if (
      // if the initial auth request wasn't a success
      // shouldn't happen - this is just for type safety
      initialRequest.status === 'error' ||
      !('action' in initialRequest.result) ||
      // or if sso errored
      auth.status === 'error' ||
      // or if we didn't get their details properly
      !userDetails
    ) {
      const errorCode =
        auth.provider === 'facebook'
          ? ErrorCodeApi.AUTH_FACEBOOK_LINK_FAILED
          : ErrorCodeApi.AUTH_APPLE_LINK_FAILED;
      return {
        status: 'error',
        errorCode,
      };
    }

    const signupResponse = await this.loginSignup.signup({
      ...this.usernameFormGroup.value,
      ...this.gdprFormGroup.value,
      ssoDetails: auth.result,
      ssoResponseToken: initialRequest.result.ssoToken,
      role: this.accountTypeFormGroup.value.accountType,
      email: this.emailControl.value,
    });

    if (signupResponse.status === 'success') {
      this.handleSuccess(
        signupResponse.result.user,
        signupResponse.result.token,
      );
    }
    return signupResponse;
  }

  handleSuccess(userId: number, authToken: string) {
    this.setStep(SignupStep.SUCCESS);

    this.loginSignup
      .handleSuccess('signup', userId, authToken, false, {
        redirectDisabled: this.isModal,
      })
      .then(() => this.success.emit(userId));
  }

  /**
   * Displays "Login Success!" and uses login redirect URL.
   * Called from a successful sso login.
   */
  handleLoginSuccess(userId: number, authToken: string) {
    this.setStep(SignupStep.LOGIN_SUCCESS);
    this.loginSignup
      .handleSuccess('login', userId, authToken, false, {
        redirectDisabled: this.isModal,
      })
      .then(() => this.success.emit(userId));
  }

  handleSwitchToLogin() {
    this.loginSignup.saveState({
      user: this.detailsFormGroup.value.email,
      password: this.detailsFormGroup.value.password,
    });

    this.switchToLogin.emit();
  }

  handleSSOSwitchToLogin() {
    // save sso state and redirect to login to access link components
    this.loginSignup.saveState({
      ssoAuthPromise: this.ssoAuthPromise,
      ssoDetailsPromise: this.ssoDetailsPromise,
      ssoActionPromise: this.ssoLoginPromise,
    });

    this.switchToLogin.emit();
  }

  handleSSOSignupClick(provider: 'apple' | 'facebook') {
    const {
      authPromise,
      detailsPromise,
      loginPromise,
    } = this.loginSignup.triggerSSOLogin(provider);

    this.ssoAuthPromise = authPromise;
    this.ssoDetailsPromise = detailsPromise;
    this.ssoLoginPromise = loginPromise.then(async response => {
      if (response.status === 'error') {
        return response;
      }

      if ('token' in response.result) {
        // this is a facebook login, so we use login success
        this.handleLoginSuccess(response.result.user, response.result.token);
      } else if (response.result.action === 'link') {
        this.handleSSOSwitchToLogin();
      } else if (response.result.action === 'signup') {
        // user needs to signup
        this.setStep(SignupStep.FACEBOOK);
      }
      return response;
    });
  }
}
