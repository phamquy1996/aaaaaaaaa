import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthConfig, AUTH_CONFIG } from '@freelancer/auth';
import {
  Datastore,
  DatastoreCollection,
  ResponseData,
} from '@freelancer/datastore';
import {
  CountriesCollection,
  Country,
  EmailIsAvailableForArrowGetResultAjaxApi,
  UserRequiresGdprCollection,
} from '@freelancer/datastore/collections';
import {
  ArrowAuthResponseAjaxApi,
  ArrowLoginSignupError,
  ArrowLoginSignupService,
  LoginSignupService,
} from '@freelancer/login-signup';
import { Seo } from '@freelancer/seo';
import { ErrorTracking } from '@freelancer/tracking';
import { ContainerSize } from '@freelancer/ui/container';
import { LinkColor } from '@freelancer/ui/link';
import { LogoSize } from '@freelancer/ui/logo';
import { Margin } from '@freelancer/ui/margin';
import { BackgroundColor } from '@freelancer/ui/page-layout';
import { SelectItem } from '@freelancer/ui/select';
import { FontType, FontWeight, TextSize } from '@freelancer/ui/text';
import {
  maxLength,
  minLength,
  pattern,
  required,
  requiredTruthy,
  validEmailRegex,
  validUsernameRegex,
} from '@freelancer/ui/validators';
import { CookieService } from '@laurentgoudet/ngx-cookie';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import { ModalSource } from 'app/login-signup/arrow-login-signup-modal/arrow-login-signup-modal.component';
import { SuccessAction } from 'app/login-signup/success-redirect';
import * as Rx from 'rxjs';
import { map, take } from 'rxjs/operators';

enum SignupStep {
  DETAILS = 0,
  USERNAME_SELECT,
  ACCOUNT_TYPE,
  GDPR,
  SUCCESS,
}

@Component({
  selector: 'app-arrow-signup',
  template: `
    <!-- only wrap in page-layout if not modal -->

    <fl-page-layout
      *ngIf="!isModal; else signUpContent"
      class="SignupPage"
      flTrackingSection="SignupPageArrow"
      [pageSize]="ContainerSize.FLUID"
      [backgroundColor]="BackgroundColor.DARK"
    >
      <fl-page-layout-single class="Container">
        <fl-card>
          <ng-container [ngTemplateOutlet]="signUpContent"></ng-container>
        </fl-card>
      </fl-page-layout-single>
    </fl-page-layout>

    <ng-template #signUpContent>
      <fl-page-layout-single
        flTrackingSection="SignupPageArrow"
        [ngSwitch]="currentStep"
      >
        <app-details-form
          i18n="Create your ArrowPlus account"
          *ngSwitchCase="SignupStep.DETAILS"
          [logoSize]="LogoSize.SMALL"
          [countryOptions]="countryOptions$ | async"
          [formGroup]="detailsFormGroup"
          [enableLoginSignupSwitch]="enableLoginSignupSwitch"
          [partnerName]="'Arrow Electronics'"
          [partnerDomain]="'Arrow'"
          [platformName]="'ArrowPlus'"
          [promotionalAgreement]="true"
          [response]="detailsFormPromise && (detailsFormPromise | async)"
          (complete)="handleDetailsFormComplete()"
          (switchToLogin)="handleSwitchToLogin()"
        >
          <app-details-form-header>
            Create your Arrow<fl-text
              [fontType]="FontType.SPAN"
              [size]="TextSize.SMALL"
              [weight]="FontWeight.BOLD"
              >Plus</fl-text
            >
            account.
          </app-details-form-header>
        </app-details-form>
        <app-username-select-form
          *ngSwitchCase="SignupStep.USERNAME_SELECT"
          [logoSize]="LogoSize.SMALL"
          [email]="detailsFormGroup.get('email')?.value"
          [formGroup]="usernameSelectFormGroup"
          [response]="signupPromise && (signupPromise | async)"
          (back)="handleNextStep(SignupStep.DETAILS)"
          (complete)="handleUsernameSelectFormComplete()"
        ></app-username-select-form>
        <app-account-type-form
          *ngSwitchCase="SignupStep.ACCOUNT_TYPE"
          [logoSize]="LogoSize.SMALL"
          [formGroup]="accountTypeFormGroup"
          [response]="signupPromise && (signupPromise | async)"
          (back)="handleNextStep(SignupStep.USERNAME_SELECT)"
          (complete)="handleAccountTypeSelectFormComplete()"
        ></app-account-type-form>
        <app-signup-gdpr-form
          *ngSwitchCase="SignupStep.GDPR"
          [logoSize]="LogoSize.SMALL"
          [formGroup]="gdprFormGroup"
          [response]="signupPromise && (signupPromise | async)"
          (back)="handleNextStep(SignupStep.ACCOUNT_TYPE)"
          (complete)="completeSignup()"
        ></app-signup-gdpr-form>
        <app-success-redirect
          *ngSwitchCase="SignupStep.SUCCESS"
          [logoSize]="LogoSize.SMALL"
          [action]="SuccessAction.SIGNUP"
        >
        </app-success-redirect>
      </fl-page-layout-single>
    </ng-template>
  `,
  styleUrls: ['./arrow-signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrowSignupComponent implements OnInit {
  BackgroundColor = BackgroundColor;
  ContainerSize = ContainerSize;
  TextSize = TextSize;
  FontType = FontType;
  FontWeight = FontWeight;
  LinkColor = LinkColor;
  LogoSize = LogoSize;
  Margin = Margin;
  SignupStep = SignupStep;
  SuccessAction = SuccessAction;

  detailsFormPromise: Promise<
    ResponseData<
      unknown | EmailIsAvailableForArrowGetResultAjaxApi,
      ArrowLoginSignupError
    >
  >;
  signupPromise: Promise<
    ResponseData<ArrowAuthResponseAjaxApi, ArrowLoginSignupError>
  >;

  currentStep = SignupStep.DETAILS;
  countriesCollection: DatastoreCollection<CountriesCollection>;

  detailsFormGroup = this.fb.group(
    {
      fullName: [null, [required($localize`Please provide your full name.`)]],
      email: [
        null,
        [
          required($localize`Please enter an email address.`),
          pattern(
            validEmailRegex,
            $localize`Please enter a valid email address.`,
          ),
        ],
      ],
      password: [
        null,
        [
          required($localize`Please enter a password.`),
          minLength(8, $localize`Password must be at least 8 characters.`),
          maxLength(25, $localize`Password must be at most 25 characters.`),
          pattern(/\d/, $localize`Password must contain a number.`),
          pattern(
            /[a-z]/,
            $localize`Password must contain a lowercase letter.`,
          ),
          pattern(
            /[A-Z]/,
            $localize`Password must contain an uppercase letter.`,
          ),
          pattern(
            /^[\w~!@#$%^*()\-_=+[\]|;:,.<>/?]*$/,
            $localize`Password must only contain letters, numbers, and the following special characters: ~!@#$%^*()-_=+[]|;:,.<>/?.`,
          ),
        ],
      ],
      country: ['', [required($localize`Please select a country.`)]],
      termsOfUse: [
        null,
        [
          requiredTruthy(''), // Do not put an error message as it will not appear at the bottom of the <fl-label>
        ],
      ],
      receivePromotionalEmail: [null],
    },
    {
      updateOn: 'submit',
    },
  );

  usernameSelectFormGroup = this.fb.group(
    {
      username: [
        null,
        [
          required($localize`Please provide a username.`),
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
    accountType: [null, [required($localize`Please select an account type.`)]],
  });

  gdprFormGroup = this.fb.group({
    privacyConsent: [false],
    personalUse: [false],
  });

  // This is the list of countries that we support, but Arrow doesn't.
  // We remove these from the country options we display on signup,
  // as we only want to display countries support by both
  unsupportedCountries: ReadonlyArray<string> = [
    'AF', // Afhganistan
    'CU', // Cuba
    'IQ', // Iraq
    'IR', // Iran, Islamic Republic of
    'KP', // Korea, Democratic People's Republic of
    'LY', // Libya
    'SD', // Sudan
    'SY', // Syrian Arab Republic
    'UM', // United States Minor Outlying Islands
    'VA', // Holy See (Vatican City State)
    'VI', // Virgin Islands, U.S.
    'WS', // Samoa
    'XC', // Northern Cyprus
  ];

  @Input() isModal = false;
  @Input() modalSource?: ModalSource;
  @Input() enableLoginSignupSwitch = true;

  @Input() countryOptions$: Rx.Observable<ReadonlyArray<SelectItem | String>>;
  @Output() switchToLogin = new EventEmitter();
  @Output() success = new EventEmitter<number>();

  constructor(
    @Inject(AUTH_CONFIG) private authConfig: AuthConfig,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cookies: CookieService,
    private datastore: Datastore,
    private errorTracking: ErrorTracking,
    private fb: FormBuilder,
    private arrowLoginSignupService: ArrowLoginSignupService,
    private loginSignupService: LoginSignupService,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private seo: Seo,
  ) {}

  ngOnInit() {
    if (!this.isModal) {
      this.seo.setPageTags({
        title: 'User Signup',
        description:
          'Sign up to join ArrowPlus, powered by Freelancer, as a new user to find and hire engineers.',
      });
    }

    this.countriesCollection = this.datastore.collection<CountriesCollection>(
      'countries',
    );
    this.countryOptions$ = this.countriesCollection.valueChanges().pipe(
      map(countries => [
        '',
        ...countries
          .filter(country => !this.unsupportedCountries.includes(country.code))
          .map((country: Country) => ({
            value: country.id,
            displayText: country.name,
          })),
      ]),
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
  }

  handleNextStep(nextStep: SignupStep) {
    this.currentStep = nextStep;
    this.changeDetectorRef.markForCheck();
  }

  handleDetailsFormComplete() {
    this.detailsFormPromise = Promise.all([
      this.loginSignupService.checkUserDetails({
        email: this.detailsFormGroup.value.email,
      }),
      this.arrowLoginSignupService.checkArrowUserEmail(
        this.detailsFormGroup.value.email,
      ),
    ]).then(([freelancerResponse, arrowResponse]) => {
      if (freelancerResponse.status === 'error') {
        return freelancerResponse;
      }

      if (
        arrowResponse.status === 'success' &&
        !arrowResponse.result.isAvailable
      ) {
        return {
          status: 'error',
          errorCode: ErrorCodeApi.EMAIL_ALREADY_IN_USE,
        } as const;
      }
      this.handleNextStep(SignupStep.USERNAME_SELECT);
      this.usernameSelectFormGroup.reset();
      delete this.signupPromise;
      return freelancerResponse;
    });
  }

  handleUsernameSelectFormComplete() {
    if (this.modalSource === 'pjp' || this.modalSource === 'zero-commission') {
      this.completeSignup();
    } else {
      this.handleNextStep(SignupStep.ACCOUNT_TYPE);
    }
  }

  handleAccountTypeSelectFormComplete() {
    if (
      this.authConfig.gdprCookie &&
      this.cookies.get(this.authConfig.gdprCookie) === 'true' &&
      this.route.snapshot.queryParams.debug_skip_gdpr !== 'true'
    ) {
      this.handleNextStep(SignupStep.GDPR);
    } else {
      this.gdprFormGroup.patchValue({
        privacyConsent: true,
        personalUse: undefined,
      });
      this.completeSignup();
    }
  }

  completeSignup() {
    const {
      fullName,
      email,
      password,
      country,
      receivePromotionalEmail,
    } = this.detailsFormGroup.value;
    const { username } = this.usernameSelectFormGroup.value;
    const accountType =
      this.modalSource === 'pjp'
        ? 'employer'
        : this.accountTypeFormGroup.controls.accountType.value;
    const { privacyConsent, personalUse } = this.gdprFormGroup.value;
    this.signupPromise = this.arrowLoginSignupService
      .signup({
        email,
        country,
        password,
        username,
        fullname: fullName,
        userType: accountType,
        privacyConsent,
        personalUse,
        receivePromotionalEmail,
      })
      .then(response => {
        if (response.status === 'success') {
          if (receivePromotionalEmail) {
            const registerForArrowMarketingPromise = this.arrowLoginSignupService.registerForArrowMarketing(
              email,
            );
            if (registerForArrowMarketingPromise) {
              registerForArrowMarketingPromise.then(
                res => res,
                (error: Error) => {
                  this.errorTracking.captureMessage(
                    `Failed to send signed up email to Arrow marketing. : ${error.message}`,
                  );
                },
              );
            }
          }
          this.handleNextStep(SignupStep.SUCCESS);
          const { user, token } = response.result;
          this.loginSignupService
            .handleSuccess('signup', user, token, false, {
              redirectDisabled: this.isModal,
            })
            .then(_ => {
              this.arrowLoginSignupService.setExternalCookies(response.result);
              this.success.emit(user);
            });
        }
        return response;
      });
  }

  handleSwitchToLogin(): void {
    if (this.isModal) {
      this.switchToLogin.emit();
    } else {
      this.router.navigate(['/login'], { queryParamsHandling: 'preserve' });
    }
  }
}
