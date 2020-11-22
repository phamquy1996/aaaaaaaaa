import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '@freelancer/auth';
import {
  CustomFieldsService,
  CustomFieldsValidator,
  validCustomFieldTextValue,
} from '@freelancer/custom-fields';
import {
  BackendPushErrorResponse,
  Datastore,
  DatastoreCollection,
  RequestError,
} from '@freelancer/datastore';
import {
  Bid,
  BidsCollection,
  CurrenciesCollection,
  CurrenciesIncludingExternalCollection,
  Currency,
  CustomFieldInfoConfigurationsCollection,
  CustomFieldValue,
  DeloitteProjectPostField,
  EncodedUrl,
  EncodedUrlCollection,
  EncodedUrlType,
  Enterprise,
  FieldValue,
  Location,
  MembershipBenefitsCollection,
  ProjectBudgetOption,
  ProjectBudgetOptionsCollection,
  ProjectsCollection,
  ProjectViewProject,
  ProjectViewProjectPushComputedFields,
  ProjectViewProjectsCollection,
  UsersCollection,
  UsersFollowCollection,
  UsersRecommendCollection,
} from '@freelancer/datastore/collections';
import { DeloitteCustomFieldsService } from '@freelancer/deloitte';
import { HireMeDraft, LocalStorage } from '@freelancer/local-storage';
import { ModalService } from '@freelancer/ui';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingColor, HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { ModalSize } from '@freelancer/ui/modal';
import { RadioAlignment } from '@freelancer/ui/radio';
import { SelectItem, SelectSize } from '@freelancer/ui/select';
import { SpinnerSize } from '@freelancer/ui/spinner';
import { SplitButtonOption } from '@freelancer/ui/split-button';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';
import { UI_CONFIG } from '@freelancer/ui/ui.config';
import { UiConfig } from '@freelancer/ui/ui.interface';
import { UpgradeType } from '@freelancer/ui/upgrade-tag';
import {
  currentOrFutureDate,
  dateFormat,
  dirtyAndValidate,
  maxDate,
  maxLength,
  maxValue,
  minLength,
  minValue,
  pattern,
  required,
  requiredTruthy,
} from '@freelancer/ui/validators';
import { isDefined, isFormControl, toNumber } from '@freelancer/utils';
import {
  EnterpriseApi,
  ESCROW_COM_CURRENCIESApi,
  TimeUnitApi,
} from 'api-typings/common/common';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import {
  DeloitteIndustryApi,
  DeloitteOfferingApi,
  INDUSTRY_GROUPSApi,
  OFFERING_PORTFOLIOSApi,
} from 'api-typings/projects/deloitte';
import { ProjectTypeApi } from 'api-typings/projects/projects';
import { ResourceTypeApi } from 'api-typings/resources/metadata';
import { UserFollowStatusApi } from 'api-typings/users/users';
import { AwardModalComponent } from 'app/projects/award-modal/award-modal.component';
import * as Rx from 'rxjs';
import {
  filter,
  map,
  publishReplay,
  refCount,
  startWith,
  take,
  tap,
} from 'rxjs/operators';
import { InviteModalComponent } from '../projects/invite-modal/invite-modal.component';
import { HireMeHourlyConfirmationModalComponent } from './hire-me-hourly-confirmation-modal/hire-me-hourly-confirmation-modal.component';
import { HireMePaymentVerifyModalComponent } from './hire-me-payment-verify-modal/hire-me-payment-verify-modal.component';

export interface HireMeUser {
  readonly authId: number;
  readonly profileUserId: number;
  readonly profileUserDisplayName: string;
  readonly profileUserLocation?: Location;
  readonly profileUserHourlyRate?: number;
  readonly paymentVerified: boolean;
  readonly emailVerified: boolean;
  readonly defaultCurrency?: Currency;
  readonly loggedUserIsRookie: boolean;
  readonly isDeloitteDcUser: boolean;
}

export enum HireType {
  FIXED = 'Fixed Price',
  HOURLY = 'Hourly Rate',
}

export enum HireMeSplitButtonOptions {
  HIRE_ME = 'Hire Me',
  INVITE = 'Invite to Project',
  FOLLOW = 'Follow',
  UNFOLLOW = 'Unfollow',
  RECOMMEND = 'Recommend',
}

export enum FollowUserToastItem {
  FOLLOW_SUCCESS = 'follow_success',
  FOLLOW_ERROR = 'follow_error',
  FOLLOW_ERROR_OVER_LIMIT = 'follow_error_over_limit',
  UNFOLLOW_SUCCESS = 'unfollow_success',
  UNFOLLOW_ERROR = 'unfollow_error',
}

export enum RecommendUserToastItem {
  RECOMMEND_SUCCESS = 'recommend_success',
  RECOMMEND_ERROR = 'recommend_error',
}

export const PAYMENT_VERIFY_WHITE_LIST: ReadonlyArray<number> = [
  11100328, // ipmtranslation06
];

type ApiError =
  | RequestError<BidsCollection>
  | {
      errorCode: ErrorCodeApi.EMAIL_VERIFICATION_REQUIRED;
    }
  | BackendPushErrorResponse<ProjectViewProjectsCollection>
  | undefined;

@Component({
  selector: 'app-hire-me',
  template: `
    <form
      *ngIf="!(error$ | async); else error"
      class="Form"
      [formGroup]="hireMeFormGroup"
    >
      <fl-bit>
        <fl-heading
          i18n="Hire Me Message label"
          [color]="HeadingColor.LIGHT"
          [headingType]="HeadingType.H3"
          [size]="TextSize.SMALL"
        >
          Send a private message
        </fl-heading>
        <ng-container *ngIf="hireMeFormGroup.get('message') as control">
          <fl-textarea
            *ngIf="isFormControl(control)"
            flTrackingLabel="PrivateMessageTextArea"
            i18n-placeholder="Hire Me private message placeholder"
            placeholder="Tell them a bit about yourself and your project, and include details of what you need done."
            [control]="control"
            [flMarginBottom]="Margin.SMALL"
            [rows]="6"
          >
          </fl-textarea>
        </ng-container>

        <ng-container *ngIf="!hireMeUser.isDeloitteDcUser">
          <ng-container
            *ngIf="currentCurrency$ | async as currentCurrency; else loading"
          >
            <fl-bit [flMarginBottom]="Margin.SMALL">
              <fl-text
                i18n="Hire Me Project Type label"
                [weight]="FontWeight.BOLD"
                [color]="FontColor.LIGHT"
              >
                Hire for
              </fl-text>
              <ng-container *ngIf="hireMeFormGroup.get('hireFor') as control">
                <fl-radio
                  *ngIf="isFormControl(control)"
                  flTrackingLabel="HireForSelection"
                  [control]="control"
                  [options]="options"
                  [alignment]="RadioAlignment.HORIZONTAL"
                ></fl-radio>
              </ng-container>
            </fl-bit>

            <fl-text [weight]="FontWeight.BOLD" [color]="FontColor.LIGHT">
              <ng-container
                *ngIf="isHourly$ | async; else fixedBudgetLabel"
                i18n="Hire Me hourly rate label"
              >
                Hourly rate
              </ng-container>
              <ng-template #fixedBudgetLabel>
                <ng-container i18n="Hire Me budget label">
                  Budget
                </ng-container>
              </ng-template>
            </fl-text>

            <fl-bit class="BudgetContainer" [flMarginBottom]="Margin.SMALL">
              <ng-container *ngIf="isHourly$ | async; else fixedBudgetInput">
                <ng-container
                  *ngIf="hireMeFormGroup.get('hourlyBudget') as control"
                >
                  <fl-input
                    *ngIf="isFormControl(control)"
                    class="BudgetContainer-budget"
                    flTrackingLabel="ProjectBudgetInput"
                    [beforeLabel]="currentCurrency.sign"
                    afterLabel="/hr"
                    i18n-afterLabel="
                       HireMe form budget input label representing units
                    "
                    [control]="control"
                  >
                  </fl-input>
                </ng-container>
              </ng-container>

              <ng-template #fixedBudgetInput>
                <ng-container
                  *ngIf="hireMeFormGroup.get('fixedBudget') as control"
                >
                  <fl-input
                    *ngIf="isFormControl(control)"
                    class="BudgetContainer-budget"
                    flTrackingLabel="ProjectBudgetInput"
                    [beforeLabel]="currentCurrency.sign"
                    [control]="control"
                  ></fl-input>
                </ng-container>
              </ng-template>

              <ng-container
                *ngIf="hireMeFormGroup.get('currencyId') as control"
              >
                <fl-select
                  *ngIf="isFormControl(control)"
                  class="BudgetContainer-currency"
                  flTrackingLabel="ProjectBudgetCurrency"
                  [control]="control"
                  [options]="currencyOptions$ | async"
                  [size]="SelectSize.MID"
                ></fl-select>
              </ng-container>
            </fl-bit>
          </ng-container>

          <fl-bit *ngIf="isHourly$ | async" [flMarginBottom]="Margin.MID">
            <fl-text
              i18n="Hire Me weekly tracking limit label"
              [weight]="FontWeight.BOLD"
              [color]="FontColor.LIGHT"
            >
              Weekly tracking limit
            </fl-text>
            <ng-container
              *ngIf="hireMeFormGroup.get('hoursPerWeek') as control"
            >
              <fl-input
                *ngIf="isFormControl(control)"
                afterLabel="hours"
                i18n-afterLabel="Hire Me weekly tracking limit input suffix"
                flTrackingLabel="HourlyProjectHoursInput"
                [control]="control"
              ></fl-input>
            </ng-container>
          </fl-bit>
        </ng-container>

        <ng-container *ngIf="hireMeUser.isDeloitteDcUser">
          <app-hire-me-deloitte-time-frame
            [isResponsive]="isResponsive"
            [hireMeFormGroup]="hireMeFormGroup"
          ></app-hire-me-deloitte-time-frame>
          <app-hire-me-deloitte-billing-details
            [isResponsive]="isResponsive"
            [hireMeFormGroup]="hireMeFormGroup"
          ></app-hire-me-deloitte-billing-details>
          <app-hire-me-deloitte-project-details
            [isResponsive]="isResponsive"
            [hireMeFormGroup]="hireMeFormGroup"
          ></app-hire-me-deloitte-project-details>
          <app-hire-me-deloitte-terms-and-conditions
            [hireMeFormGroup]="hireMeFormGroup"
          ></app-hire-me-deloitte-terms-and-conditions>
        </ng-container>

        <ng-template #loading>
          <fl-bit class="LoadingSpinner" [flMarginBottom]="Margin.XSMALL">
            <fl-spinner
              flTrackingLabel="HireMeInitialisationSpinner"
              [size]="SpinnerSize.SMALL"
            ></fl-spinner>
          </fl-bit>
        </ng-template>

        <!-- For Arrow projects, they get upgrades applied automatically for free -->
        <fl-bit
          *ngIf="uiConfig.theme === 'arrow'"
          [flMarginBottom]="Margin.XXSMALL"
        >
          <fl-text
            i18n="Arrow hire me project upgrades applied message"
            [color]="FontColor.LIGHT"
            [flMarginBottom]="Margin.XXXSMALL"
          >
            Your project will have the following upgrades applied for free:
          </fl-text>
          <fl-upgrade-tag
            [upgradeType]="UpgradeType.NDA"
            [flMarginBottom]="Margin.XXSMALL"
            [flMarginRight]="Margin.XXXSMALL"
          ></fl-upgrade-tag>
          <fl-upgrade-tag
            [upgradeType]="UpgradeType.PRIVATE"
            [flMarginBottom]="Margin.XXSMALL"
          ></fl-upgrade-tag>
        </fl-bit>
      </fl-bit>

      <fl-bit>
        <ng-container *ngIf="showSplitButton">
          <ng-container
            *ngIf="
              hireMeSplitButtonOptions$ | async as options;
              else loadingSplitButtonOptions
            "
          >
            <app-hire-me-split-button
              [busy]="buttonBusy$ | async"
              [flMarginBottom]="Margin.SMALL"
              [options]="options"
              (primaryClicked)="handleSubmit()"
              (optionSelected)="onOptionSelected($event)"
            ></app-hire-me-split-button>
          </ng-container>

          <ng-template #loadingSplitButtonOptions>
            <fl-button
              class="WideButton"
              flTrackingLabel="HireMeButtonLoading"
              [busy]="true"
              [color]="ButtonColor.SECONDARY"
              [size]="ButtonSize.LARGE"
              [display]="'block'"
              [flMarginBottom]="Margin.SMALL"
            >
              <!-- Text is here to ensure the button is full size. Does not need translating. -->
              {{ 'LOADING' }}
            </fl-button>
          </ng-template>
        </ng-container>

        <app-hire-me-errors
          *ngIf="apiError$ | async as apiError"
          [error]="apiError"
          [userId]="hireMeUser.authId"
          [sellerId]="hireMeUser.profileUserId"
        >
        </app-hire-me-errors>
        <fl-bit *ngIf="!hireMeUser.isDeloitteDcUser">
          <fl-text
            i18n="User agreement button message"
            [color]="FontColor.LIGHT"
            [flMarginBottom]="Margin.SMALL"
          >
            By clicking the button, you have read and agree to our
            <fl-link
              flTrackingLabel="HireMeTermsAndConditionsClicked"
              [link]="'/info/plainterms.html'"
              [newTab]="true"
            >
              User Agreement
            </fl-link>
            and
            <fl-link
              flTrackingLabel="HireMePrivacyPolicyClicked"
              [newTab]="true"
              [link]="'/page.php'"
              [queryParams]="{ p: 'info/privacy' }"
            >
              Privacy Policy
            </fl-link>
            .
          </fl-text>
        </fl-bit>
        <app-hire-me-rookie-message
          *ngIf="showRookieMessage"
          (close)="closeRookieMessage()"
          (proceed)="handleProceed()"
        ></app-hire-me-rookie-message>

        <fl-button
          *ngIf="!showSplitButton && !showRookieMessage"
          class="WideButton"
          i18n="Hire Me Button"
          flTrackingLabel="HireMeButtonClicked"
          [busy]="buttonBusy$ | async"
          [color]="ButtonColor.SECONDARY"
          [size]="ButtonSize.SMALL"
          [flMarginBottom]="Margin.XSMALL"
          [submit]="true"
          (click)="handleSubmit()"
        >
          Hire {{ hireMeUser.profileUserDisplayName }}
        </fl-button>

        <fl-bit *ngIf="hireMeUser.isDeloitteDcUser">
          <fl-text
            i18n="User agreement button message"
            [color]="FontColor.LIGHT"
            [flMarginBottom]="Margin.SMALL"
          >
            By clicking the button, you have read and agree to our
            <fl-link
              flTrackingLabel="HireMeTermsAndConditionsClicked"
              [link]="'/info/plainterms.html'"
              [newTab]="true"
            >
              User Agreement
            </fl-link>
            and
            <fl-link
              flTrackingLabel="HireMePrivacyPolicyClicked"
              [newTab]="true"
              [link]="'/page.php'"
              [queryParams]="{ p: 'info/privacy' }"
            >
              Privacy Policy
            </fl-link>
            .
          </fl-text>
        </fl-bit>
      </fl-bit>
    </form>
    <ng-template #error>
      <fl-banner-alert
        i18n="Hire Me general error message"
        i18n-bannerTitle="Error banner title"
        bannerTitle="Error"
        [closeable]="false"
        [type]="BannerAlertType.ERROR"
        [flMarginBottom]="Margin.XXSMALL"
      >
        Unable to load the data. Please try again or contact support.
      </fl-banner-alert>
    </ng-template>
  `,
  styleUrls: ['./hire-me.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HireMeComponent implements OnInit, OnChanges, OnDestroy {
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  FontColor = FontColor;
  isFormControl = isFormControl;
  FontWeight = FontWeight;
  HeadingColor = HeadingColor;
  HeadingType = HeadingType;
  Margin = Margin;
  RadioAlignment = RadioAlignment;
  SelectSize = SelectSize;
  SpinnerSize = SpinnerSize;
  TextSize = TextSize;
  UpgradeType = UpgradeType;

  /**
   * When isResponsive is set, the Billing and Project Details will split
   * into two columns instead of one when the screen is wide enough.
   */
  @Input() isResponsive = false;

  @Input() hireMeUser: HireMeUser;
  @Input() defaultHireType: HireType = HireType.FIXED;
  @Input() defaultMessage: string;
  @Input() defaultHoursPerWeek = 10;
  @Input() showSplitButton = false;
  @Input() refProject?: ProjectViewProject;

  @Output() showToastAlert = new EventEmitter<
    FollowUserToastItem | RecommendUserToastItem
  >();

  private _buttonBusy$ = new Rx.Subject<boolean>();
  buttonBusy$ = this._buttonBusy$.asObservable();

  apiError$ = new Rx.Subject<ApiError>();
  error$: Rx.Observable<boolean>;
  isHourly$: Rx.Observable<boolean>;
  budgetMinimum$: Rx.Observable<number>;
  budgetDetails$: Rx.Observable<ProjectBudgetOption>;
  currencies$: Rx.Observable<ReadonlyArray<Currency>>;
  currencyOptions$: Rx.Observable<ReadonlyArray<SelectItem>>;
  currentCurrency$: Rx.Observable<Currency>;
  deloitteCurrency$: Rx.Observable<Currency>;
  userProfileEncodedUrl$: Rx.Observable<EncodedUrl>;

  userFollowsCollection: DatastoreCollection<UsersFollowCollection>;
  userRecommendCollection$: DatastoreCollection<UsersRecommendCollection>;

  paymentVerifyWhiteListedPromise: Promise<boolean>;

  private defaultCurrencyId: number;
  private hasSeenRookieMessage = false;
  showRookieMessage = false;

  followedUsersCount: number;
  maxFollowLimit: number;

  hireMeFormGroup: FormGroup;
  options: ReadonlyArray<HireType> = [HireType.FIXED, HireType.HOURLY];
  enableFormControls: { [key: string]: ReadonlyArray<string> } = {
    all: ['message'],
    default: [
      'hourlyBudget',
      'fixedBudget',
      'hireFor',
      'hoursPerWeek',
      'currencyId',
    ],
    [EnterpriseApi.DELOITTE_DC]: [
      'startDate',
      'completionDate',
      DeloitteProjectPostField.BILLING_CODE,
      'billableHours',
      DeloitteProjectPostField.BUSINESS_LINE,
      DeloitteProjectPostField.PROJECT_TYPE,
      DeloitteProjectPostField.PRACTICE,
      DeloitteProjectPostField.INDUSTRY_SECTOR,
      DeloitteProjectPostField.MARKET_OFFERING,
      'agreeToTermsAndConditions',
      DeloitteProjectPostField.IS_CLEARANCE_REQUIRED,
      DeloitteProjectPostField.CLEARANCE,
      DeloitteProjectPostField.IS_SUBJECT_TO_ITAR,
      DeloitteProjectPostField.UTILIZATION,
      DeloitteProjectPostField.INDUSTRY_GROUP,
      DeloitteProjectPostField.OFFERING_PORTFOLIO,
    ],
    [EnterpriseApi.ARROW]: [
      'hourlyBudget',
      'fixedBudget',
      'hireFor',
      'hoursPerWeek',
      'currencyId',
    ],
  };

  bidsErrorSubscription = new Rx.Subscription();
  bidsSubscription = new Rx.Subscription();
  billingCodeSeparatorSubscription = new Rx.Subscription();
  budgetMinimumSubscription = new Rx.Subscription();
  convertSubscription = new Rx.Subscription();
  encodedUrlSubscription = new Rx.Subscription();
  hireForValidatorSubscription = new Rx.Subscription();
  isClearanceRequiredSubscription = new Rx.Subscription();
  industryGroupSubscription = new Rx.Subscription();
  offeringPortfolioSubscription = new Rx.Subscription();
  showFollowButtonSubscription = new Rx.Subscription();
  startDateValidatorsSubscription = new Rx.Subscription();
  updateDefaultsSubscription = new Rx.Subscription();
  projectCustomFieldConfigCollection: DatastoreCollection<
    CustomFieldInfoConfigurationsCollection
  >;
  private hireMeUser$ = new Rx.ReplaySubject<HireMeUser>();
  private refProject$ = new Rx.ReplaySubject<ProjectViewProject>();
  refProjectSubscription?: Rx.Subscription;

  hireMeSplitButtonOptions$: Rx.Observable<ReadonlyArray<SplitButtonOption>>;

  private DEFAULT_CURRENCY_ID = 1; // Currency ID (US Dollar)
  private DEFAULT_PERIOD = 7; // Days to complete project
  private DEFAULT_MINIMUM_HOURS_PER_WEEK = 1;
  private DEFAULT_MAXIMUM_HOURS_PER_WEEK = 7 * 24;
  private DEFAULT_BUDGET = 250; // Initial budget in USD
  private DEFAULT_PERIOD_ARROW = 45;
  private DEFAULT_MINIMUM_HOURLY_IF_NO_BUDGET_FOR_CURRENCY = 2;
  private MINIMUM_AUSTRALIA_HOURLY_WAGE_IN_AUD = 25;

  constructor(
    @Inject(UI_CONFIG) public uiConfig: UiConfig,
    private auth: Auth,
    private customFieldsService: CustomFieldsService,
    private customFieldsValidator: CustomFieldsValidator,
    private datastore: Datastore,
    private fb: FormBuilder,
    private modalService: ModalService,
    private router: Router,
    private localStorage: LocalStorage,
    private deloitteCustomFields: DeloitteCustomFieldsService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      'hireMeUser' in changes &&
      !changes.hireMeUser.isFirstChange() &&
      changes.hireMeUser.currentValue.profileUserId !==
        changes.hireMeUser.previousValue.profileUserId
    ) {
      this.setDefaultCurrencyId();
      this.resetFormGroupValue();
    }

    if ('refProject' in changes) {
      this.refProject$.next(this.refProject);
    }

    if ('hireMeUser' in changes) {
      this.hireMeUser$.next(this.hireMeUser);
    }
  }

  ngOnInit() {
    this.paymentVerifyWhiteListedPromise = this.auth
      .getUserId()
      .pipe(
        map(id =>
          PAYMENT_VERIFY_WHITE_LIST.some(
            whitelistId => whitelistId === toNumber(id),
          ),
        ),
        take(1),
      )
      .toPromise();

    this.deloitteCurrency$ = this.datastore
      .document<CurrenciesIncludingExternalCollection>(
        'currenciesIncludingExternal',
        'TKN',
        { index: 'code' },
      )
      .valueChanges();
    this.setDefaultCurrencyId();

    this.projectCustomFieldConfigCollection = this.datastore.collection<
      CustomFieldInfoConfigurationsCollection
    >('customFieldInfoConfigurations', query =>
      query.where('resourceType', '==', ResourceTypeApi.PROJECT),
    );

    // Define form group
    this.initFormGroup();
    this.setupSubscriptions();
    this.loadDraft();

    const hasFollowBenefit$ = this.datastore
      .document<MembershipBenefitsCollection>(
        'membershipBenefits',
        'employer_following',
      )
      .valueChanges()
      .pipe(
        tap(benefit => {
          this.maxFollowLimit = benefit.value;
        }),
        map(benefit => benefit.value !== 0),
      );

    this.userRecommendCollection$ = this.datastore.collection<
      UsersRecommendCollection
    >('usersRecommend', query =>
      query.where('recommendedUserId', '==', this.hireMeUser.profileUserId),
    );
    this.userFollowsCollection = this.datastore.collection<
      UsersFollowCollection
    >('usersFollow');

    this.refProjectSubscription = this.refProject$
      .asObservable()
      .pipe(filter(isDefined))
      .subscribe(refProject => {
        this.defaultMessage = refProject.description || this.defaultMessage;
        if (refProject.hourlyProjectInfo) {
          this.defaultHireType = HireType.HOURLY;
          const { commitment } = refProject.hourlyProjectInfo;
          if (commitment) {
            this.defaultHoursPerWeek = commitment.hours;
          }
        }
        this.resetFormGroupValue();
      });

    this.hireMeSplitButtonOptions$ = Rx.combineLatest([
      hasFollowBenefit$,
      this.userFollowsCollection.valueChanges(),
      this.userRecommendCollection$.valueChanges(),
      this.hireMeUser$.asObservable(),
    ]).pipe(
      map(([hasFollowBenefit, userFollows, userRecommends, hireMeUser]) => {
        this.followedUsersCount = userFollows.length;
        const hasRecommendedProfile = userRecommends.length > 0;

        const isFollowingUser = userFollows.find(
          userFollow =>
            userFollow.followedUserId === this.hireMeUser.profileUserId,
        );

        const userFollowingButton = isFollowingUser
          ? { copy: HireMeSplitButtonOptions.UNFOLLOW }
          : { copy: HireMeSplitButtonOptions.FOLLOW };

        const defaultHireMeOptions = [
          { copy: HireMeSplitButtonOptions.INVITE },
        ];

        return [
          { copy: `Hire ${hireMeUser.profileUserDisplayName}` },
          ...defaultHireMeOptions,
          ...(hasFollowBenefit ? [userFollowingButton] : []),
          ...(!hasRecommendedProfile
            ? [{ copy: HireMeSplitButtonOptions.RECOMMEND }]
            : []),
        ];
      }),
    );
  }

  initFormGroup() {
    this.hireMeFormGroup = this.fb.group({
      // All
      message: [
        this.defaultMessage,
        [
          required($localize`Please enter a message.`),
          minLength(10, $localize`Please enter at least 10 characters.`),
          maxLength(500, $localize`Please enter at most 500 characters.`),
        ],
      ],

      // Deloitte
      startDate: [
        new Date(new Date().setHours(0, 0, 0, 0)),
        [
          dateFormat($localize`Please enter a valid date`),
          currentOrFutureDate($localize`You cannot enter a past date`),
          required($localize`Please enter a valid date`),
        ],
      ],
      completionDate: [
        null,
        [
          dateFormat($localize`Please enter a valid date`),
          currentOrFutureDate($localize`You cannot enter a past date`),
          required($localize`Please enter a valid date`),
        ],
      ],
      // example billing code - (ABC00123-AB-01-01-0000)
      [DeloitteProjectPostField.BILLING_CODE]: [
        '',
        {
          validators: [
            required($localize`Please enter a billing code.`),
            pattern(
              /^(?!GAA).+$/i,
              $localize`You may not use a WBS code beginning with GAA to post a gig.`,
            ),
          ],
          updateOn: 'blur',
        },
      ],
      billableHours: [
        null,
        [
          required($localize`Please enter a billable hours.`),
          minValue(1, $localize`Please enter at least 1.`),
          maxValue(1000, $localize`Please enter at most 1000.`),
        ],
      ],
      [DeloitteProjectPostField.BUSINESS_LINE]: [
        '',
        [required($localize`Please select Business line.`)],
      ],
      [DeloitteProjectPostField.PROJECT_TYPE]: [
        '',
        [required($localize`Please select project type.`)],
      ],
      [DeloitteProjectPostField.PRACTICE]: [
        '',
        [required($localize`Please select project practice.`)],
      ],
      [DeloitteProjectPostField.INDUSTRY_SECTOR]: [
        '',
        [required($localize`Please select project industry.`)],
      ],
      [DeloitteProjectPostField.MARKET_OFFERING]: [
        '',
        [required($localize`Please select project offering.`)],
      ],
      [DeloitteProjectPostField.UTILIZATION]: [
        '',
        [required($localize`Please select utilization.`)],
      ],
      agreeToTermsAndConditions: [false, [requiredTruthy('')]],
      [DeloitteProjectPostField.IS_CLEARANCE_REQUIRED]: [false],
      [DeloitteProjectPostField.CLEARANCE]: [''],
      [DeloitteProjectPostField.IS_SUBJECT_TO_ITAR]: [false],
      [DeloitteProjectPostField.INDUSTRY_GROUP]: [''],
      [DeloitteProjectPostField.OFFERING_PORTFOLIO]: [''],

      // FLN / Arrow
      hourlyBudget: [''],
      fixedBudget: [''],
      hireFor: [this.defaultHireType],
      hoursPerWeek: [this.defaultHoursPerWeek],
      currencyId: this.defaultCurrencyId,
    });

    this.toggleFormControls();
  }

  resetFormGroupValue() {
    if (this.hireMeFormGroup) {
      this.hireMeFormGroup.setValue(
        {
          // All
          message: this.defaultMessage,

          // Deloitte
          startDate: new Date(new Date().setHours(0, 0, 0, 0)),
          completionDate: null,
          billableHours: null,
          agreeToTermsAndConditions: false,
          [DeloitteProjectPostField.IS_CLEARANCE_REQUIRED]: false,
          [DeloitteProjectPostField.IS_SUBJECT_TO_ITAR]: false,
          [DeloitteProjectPostField.CLEARANCE]: null,
          [DeloitteProjectPostField.UTILIZATION]: '',
          [DeloitteProjectPostField.BILLING_CODE]: '',
          [DeloitteProjectPostField.PROJECT_TYPE]: '',
          [DeloitteProjectPostField.PRACTICE]: '',
          [DeloitteProjectPostField.BUSINESS_LINE]: '',
          [DeloitteProjectPostField.INDUSTRY_SECTOR]: '',
          [DeloitteProjectPostField.MARKET_OFFERING]: '',
          [DeloitteProjectPostField.INDUSTRY_GROUP]: '',
          [DeloitteProjectPostField.OFFERING_PORTFOLIO]: '',

          // FLN / Arrow
          hourlyBudget: [''],
          fixedBudget: [''],
          hireFor: this.defaultHireType,
          hoursPerWeek: this.defaultHoursPerWeek,
          currencyId: this.defaultCurrencyId,
        },
        { emitEvent: false },
      );

      this.toggleFormControls();

      Object.values(this.hireMeFormGroup.controls).forEach(control => {
        control.markAsPristine();
        control.markAsUntouched();
        control.updateValueAndValidity({ onlySelf: true });
      });
      this.hireMeFormGroup.markAsPristine();
      this.hireMeFormGroup.markAsUntouched();
      this.hireMeFormGroup.updateValueAndValidity();
    }
  }

  toggleFormControls(): void {
    Object.entries(this.hireMeFormGroup.controls).forEach(([key, control]) => {
      if (!this.getEnableFormControls().includes(key)) {
        control.disable();
      } else {
        control.enable();
      }
      control.updateValueAndValidity({ onlySelf: true });
    });
    this.hireMeFormGroup.updateValueAndValidity();
  }

  setupSubscriptions() {
    // Deloitte
    this.startDateValidatorsSubscription = this.hireMeFormGroup.controls.completionDate.valueChanges.subscribe(
      value => {
        const completionDate = new Date(value);
        const completionDateMinusOneDay = completionDate.setDate(
          completionDate.getDate() - 1,
        );

        this.hireMeFormGroup.controls.startDate.setValidators([
          dateFormat('Please enter a valid date'),
          currentOrFutureDate('You cannot enter a past date'),
          maxDate(
            completionDateMinusOneDay,
            'The expected end date must be after the expected start date.',
          ),
          required('Please enter a valid date'),
        ]);

        dirtyAndValidate(this.hireMeFormGroup.controls.startDate);
      },
    );

    this.isClearanceRequiredSubscription = this.hireMeFormGroup.controls[
      DeloitteProjectPostField.IS_CLEARANCE_REQUIRED
    ].valueChanges
      .pipe(startWith(false))
      .subscribe(clearanceRequired => {
        const clearanceControl = this.hireMeFormGroup.controls[
          DeloitteProjectPostField.CLEARANCE
        ];
        clearanceControl.setValidators(
          clearanceRequired
            ? [required('Please enter clearance details')]
            : null,
        );
        clearanceControl.updateValueAndValidity();
      });

    // Format billing code (e.g. ABC00123-AB-01-01-0000)
    this.billingCodeSeparatorSubscription = this.deloitteCustomFields.formatDeloitteBillingCodeFormControl(
      this.hireMeFormGroup.controls[DeloitteProjectPostField.BILLING_CODE],
    );

    // Set Async Validator for billing code
    this.customFieldsService
      .getCustomFieldIdByName(
        DeloitteProjectPostField.BILLING_CODE,
        ResourceTypeApi.PROJECT,
      )
      .pipe(take(1))
      .toPromise()
      .then(id =>
        this.hireMeFormGroup.controls[
          DeloitteProjectPostField.BILLING_CODE
        ].setAsyncValidators(
          validCustomFieldTextValue(
            id,
            'enterprise',
            Enterprise.DELOITTE_DC,
            ResourceTypeApi.PROJECT,
            this.customFieldsValidator,
            'Invalid WBS code provided.',
          ),
        ),
      );

    // Set industry group on industry sector being selected
    this.industryGroupSubscription = this.hireMeFormGroup.controls[
      DeloitteProjectPostField.INDUSTRY_SECTOR
    ].valueChanges.subscribe(industrySector => {
      const industryGroupValue =
        INDUSTRY_GROUPSApi[industrySector as DeloitteIndustryApi];
      this.hireMeFormGroup.controls[
        DeloitteProjectPostField.INDUSTRY_GROUP
      ].setValue(industryGroupValue);
    });

    // Set offering portfolio on market offering being selected
    this.offeringPortfolioSubscription = this.hireMeFormGroup.controls[
      DeloitteProjectPostField.MARKET_OFFERING
    ].valueChanges.subscribe(marketOffering => {
      const offeringPortfolioValue =
        OFFERING_PORTFOLIOSApi[marketOffering as DeloitteOfferingApi];
      this.hireMeFormGroup.controls[
        DeloitteProjectPostField.OFFERING_PORTFOLIO
      ].setValue(offeringPortfolioValue);
    });

    // FLN / Arrow
    const useCalifornianFlow$ = this.datastore
      .collection<UsersCollection>(
        'users',
        this.auth
          .getUserId()
          .pipe(
            map(authUid => [toNumber(authUid), this.hireMeUser.profileUserId]),
          ),
      )
      .valueChanges()
      .pipe(map(users => users.some(u => u.escrowComInteractionRequired)));

    this.currencies$ = this.datastore
      .collection<CurrenciesCollection>('currencies')
      .valueChanges();

    this.currencyOptions$ = Rx.combineLatest([
      this.currencies$,
      useCalifornianFlow$,
    ]).pipe(
      map(([options, useCalifornianFlow]) =>
        options
          .filter(option =>
            useCalifornianFlow
              ? ESCROW_COM_CURRENCIESApi.includes(option.code)
              : true,
          )
          .map(option => ({
            value: option.id,
            displayText: option.code,
          })),
      ),
    );

    const currencyControl = this.hireMeFormGroup.get('currencyId');
    const fixedBudget = this.hireMeFormGroup.get('fixedBudget');
    const hireForControl = this.hireMeFormGroup.get('hireFor');
    const hourlyBudget = this.hireMeFormGroup.get('hourlyBudget');

    if (hireForControl && currencyControl && hourlyBudget && fixedBudget) {
      // Define current selected currency ID
      const selectedCurrency$ = Rx.combineLatest([
        this.currencyOptions$,
        currencyControl.valueChanges.pipe(startWith(this.defaultCurrencyId)),
      ]).pipe(
        map(([options, selected]) =>
          // When switching to Californian resident there might be no selected currency
          !options.some(option => option.value === selected) && options[0]
            ? options[0].value
            : selected,
        ),
      );

      // Get currently selected currency object
      this.currentCurrency$ = Rx.combineLatest([
        this.currencies$,
        selectedCurrency$,
      ]).pipe(
        map(([currencies, selected]) =>
          currencies.filter(currency => currency.id === selected),
        ),
        map(currencies => currencies[0]),
      );

      // Define observable to check project type
      this.isHourly$ = hireForControl.valueChanges.pipe(
        startWith(this.defaultHireType),
        map(hireType => hireType === HireType.HOURLY),
        publishReplay(1),
        refCount(),
      );

      // Get current currency project budget details
      const budgetCollection = this.datastore.collection<
        ProjectBudgetOptionsCollection
      >('projectBudgetOptions', query =>
        this.isHourly$.pipe(
          map(isHourly =>
            query
              .where('currencyId', '==', selectedCurrency$)
              .where(
                'projectType',
                '==',
                isHourly ? ProjectTypeApi.HOURLY : ProjectTypeApi.FIXED,
              ),
          ),
        ),
      );

      this.error$ = budgetCollection.status$.pipe(
        map(status => !!status.error),
      );

      this.budgetDetails$ = budgetCollection
        .valueChanges()
        .pipe(map(budgets => budgets[0]));

      // Set initial currency
      const initialBudget$ = this.currentCurrency$.pipe(take(1));
      initialBudget$.toPromise().then(initialCurrency => {
        if (!currencyControl.dirty) {
          currencyControl.setValue(initialCurrency.id);
        }
      });

      // Set budget minimum depending on project type selection
      this.budgetMinimum$ = Rx.combineLatest([
        this.budgetDetails$,
        currencyControl.valueChanges,
        this.deloitteCurrency$,
        this.currencies$,
      ]).pipe(
        map(([budget, currentCurrency, deloitteCurrency, currencies]) => {
          const currentCurrencyObject = currencies.find(
            currency => currency.id === currentCurrency,
          );
          const audCurrencyObject = currencies.find(
            currency => currency.code === 'AUD',
          );

          // Condition for minimum Aussie hourly wage based on SellerBidHandler.php
          return currentCurrency !== deloitteCurrency.id &&
            this.hireMeUser.profileUserLocation &&
            this.hireMeUser.profileUserLocation.country &&
            this.hireMeUser.profileUserLocation.country.name === 'Australia' &&
            currentCurrencyObject &&
            currentCurrencyObject.exchangeRate &&
            audCurrencyObject &&
            audCurrencyObject.exchangeRate
            ? Math.round(
                (this.MINIMUM_AUSTRALIA_HOURLY_WAGE_IN_AUD *
                  audCurrencyObject.exchangeRate) /
                  currentCurrencyObject.exchangeRate,
              )
            : budget
            ? toNumber(budget.minimum)
            : this.DEFAULT_MINIMUM_HOURLY_IF_NO_BUDGET_FOR_CURRENCY;
        }),
      );

      // Set budget validators depending on selected currency
      this.budgetMinimumSubscription = Rx.combineLatest([
        this.budgetMinimum$,
        this.currentCurrency$,
      ]).subscribe(([minimumBudget, currency]) => {
        this.setBudgetValidators(
          this.roundBudget(minimumBudget),
          currency,
          hireForControl.value === HireType.HOURLY ? hourlyBudget : fixedBudget,
        );
      });

      this.convertSubscription = Rx.combineLatest([
        this.isHourly$,
        this.budgetMinimum$,
      ]).subscribe(([isHourly, budgetMinimum]) => {
        if (isHourly && !(hourlyBudget.touched || hourlyBudget.dirty)) {
          this.setDefaultBudget(hourlyBudget, budgetMinimum, true);

          return;
        }

        if (!isHourly && !(fixedBudget.touched || fixedBudget.dirty)) {
          this.setDefaultBudget(fixedBudget, budgetMinimum, false);
        }
      });
    }
    // Set validators depending on project type selection
    this.setHoursPerWeekValidators();

    this.userProfileEncodedUrl$ = this.datastore
      .collection<EncodedUrlCollection>('encodedUrl', query =>
        query
          .where('type', '==', EncodedUrlType.USER_PROFILE)
          .where('userId', '==', this.hireMeUser.profileUserId),
      )
      .valueChanges()
      .pipe(
        take(1),
        map(results => results[0]),
      );
  }

  setDefaultCurrencyId() {
    this.defaultCurrencyId = this.hireMeUser.defaultCurrency
      ? this.hireMeUser.defaultCurrency.id
      : this.DEFAULT_CURRENCY_ID;
  }

  setDefaultBudget(
    budgetControl: AbstractControl,
    budgetMinimum: number,
    isHourly: boolean,
  ) {
    let defaultBudget: number;

    if (isHourly) {
      defaultBudget = this.hireMeUser.profileUserHourlyRate
        ? this.hireMeUser.profileUserHourlyRate
        : budgetMinimum;
    } else {
      defaultBudget = this.DEFAULT_BUDGET;
    }
    budgetControl.setValue(Math.ceil(defaultBudget));
  }

  roundBudget(budget: number, maxRoundFigures = 3) {
    // Legacy logic: quickhire/module-quickhire.js:150

    // Get the number of digits of budget value
    const digits = String(Math.floor(Math.abs(budget))).length;

    let roundFigures = 1;
    if (digits > maxRoundFigures + 1) {
      // eg. budget = 12345, maxRoundFigures = 3, roundFigures = 1000
      roundFigures = 10 ** maxRoundFigures;
    } else if (digits > 1) {
      // eg. budget = 123, maxRoundFigures = 3, roundFigures = 10
      roundFigures = 10 ** (digits - 2);
    }
    return Math.ceil(budget / roundFigures) * roundFigures;
  }

  setBudgetValidators(
    budgetMinimum: number,
    currency: Currency,
    budgetControl: AbstractControl,
  ) {
    budgetControl.setValidators([
      required('Please enter a budget.'),
      minValue(
        budgetMinimum,
        `Minimum budget is ${currency.sign}${budgetMinimum}`,
      ),
    ]);
    budgetControl.updateValueAndValidity();
  }

  setHoursPerWeekValidators() {
    const hireForControl = this.hireMeFormGroup.get('hireFor');

    // Change hours per week validator based on project type
    const hoursPerWeekControl = this.hireMeFormGroup.get('hoursPerWeek');
    if (hireForControl && hoursPerWeekControl) {
      this.hireForValidatorSubscription = hireForControl.valueChanges.subscribe(
        hireFor => {
          if (hireFor === HireType.HOURLY) {
            hoursPerWeekControl.setValidators([
              required('Hours per Week required for Hourly Projects'),
              minValue(
                this.DEFAULT_MINIMUM_HOURS_PER_WEEK,
                `Minimum hours per week is ${this.DEFAULT_MINIMUM_HOURS_PER_WEEK}`,
              ),
              maxValue(
                this.DEFAULT_MAXIMUM_HOURS_PER_WEEK,
                `Maximum hours per week is ${this.DEFAULT_MAXIMUM_HOURS_PER_WEEK}`,
              ),
            ]);
          }
          if (hireFor === HireType.FIXED) {
            hoursPerWeekControl.setValidators(null);
          }
          hoursPerWeekControl.updateValueAndValidity();
        },
      );
    }
  }

  handleSubmit() {
    if (
      this.hireMeUser.loggedUserIsRookie &&
      !this.hasSeenRookieMessage &&
      !this.isDeloitteUser()
    ) {
      this.showRookieMessage = true;
      this.hasSeenRookieMessage = true;
    } else if (this.hireMeUser.isDeloitteDcUser) {
      this.submitDeloitteProject();
    } else {
      // Force to validate the form
      this.touchFields();
      // Show the hourly confirmation modal for hourly project.
      const hireForControl = this.hireMeFormGroup.get('hireFor');
      if (hireForControl && hireForControl.value === HireType.HOURLY) {
        this.openHireMeHourlyConfirmationModal();
      } else {
        this.submitProject();
      }
    }
  }

  async openHireMeHourlyConfirmationModal() {
    const currencyControl = this.hireMeFormGroup.get('currencyId');
    const hourlyBudget = this.hireMeFormGroup.get('hourlyBudget');
    const hoursPerWeekControl = this.hireMeFormGroup.get('hoursPerWeek');

    if (
      this.hireMeFormGroup.valid &&
      currencyControl &&
      hourlyBudget &&
      hoursPerWeekControl
    ) {
      const weeklyLimit = toNumber(hoursPerWeekControl.value);
      const hourlyRate = toNumber(hourlyBudget.value);

      const encodedUrlResult = await this.userProfileEncodedUrl$.toPromise();

      const currencies = await this.currencies$.pipe(take(1)).toPromise();
      const currency = currencies.find(
        currencyObject => currencyObject.id === currencyControl.value,
      );

      const paymentVerifyWhiteListed = await this
        .paymentVerifyWhiteListedPromise;

      const modalCloseResult = await this.modalService
        .open(HireMeHourlyConfirmationModalComponent, {
          inputs: {
            hireMeUser: this.hireMeUser,
            currency,
            weeklyLimit,
            hourlyRate,
            maxWeeklyBill: weeklyLimit * hourlyRate,
            paymentVerifyWhiteListed,
          },
          size: ModalSize.LARGE,
          edgeToEdge: true,
        })
        .afterClosed()
        .toPromise();

      if (modalCloseResult === true) {
        if (paymentVerifyWhiteListed || this.hireMeUser.paymentVerified) {
          this.submitProject();
        } else {
          // Save the hire me project setting into local storage.
          this.saveDraft({
            confirmed: true,
          });

          // Redirect employer to the payment verify page.
          // When completed, redirect employer back to the freelnacer profile page.
          this.router.navigate(['/verify'], {
            queryParams: {
              ref: 'hourly',
              createProject: true,
              successUrl: encodedUrlResult.url,
              skipTrial: 'true',
            },
          });
        }
      }
    }
  }

  submitProject() {
    // Force to validate the form
    this.touchFields();

    this._buttonBusy$.next(true);
    this.apiError$.next(undefined);

    const currencyControl = this.hireMeFormGroup.get('currencyId');
    const fixedBudget = this.hireMeFormGroup.get('fixedBudget');
    const hireForControl = this.hireMeFormGroup.get('hireFor');
    const hourlyBudget = this.hireMeFormGroup.get('hourlyBudget');
    const hoursPerWeekControl = this.hireMeFormGroup.get('hoursPerWeek');
    const messageControl = this.hireMeFormGroup.get('message');

    if (
      this.hireMeFormGroup.valid &&
      messageControl &&
      hourlyBudget &&
      fixedBudget &&
      hireForControl &&
      currencyControl
    ) {
      const newProject = {
        title: this.getTitle(),
        description: messageControl.value,
        currency: {
          id: toNumber(currencyControl.value),
          code: '',
          sign: '',
        },
        budget: {
          minimum:
            hireForControl.value === HireType.HOURLY
              ? toNumber(hourlyBudget.value)
              : toNumber(fixedBudget.value),
          currencyId: toNumber(currencyControl.value),
        },
        skills: [],
        type:
          hireForControl.value === HireType.HOURLY
            ? ProjectTypeApi.HOURLY
            : ProjectTypeApi.FIXED,
        hireme: true,
        hiremeInitialBid: {
          bidderId: this.hireMeUser.profileUserId,
          amount:
            hireForControl.value === HireType.HOURLY
              ? toNumber(hourlyBudget.value)
              : toNumber(fixedBudget.value),
          period: this.DEFAULT_PERIOD,
        },
        local: false,
        hourlyProjectInfo:
          hireForControl.value === HireType.HOURLY
            ? {
                commitment: {
                  hours: hoursPerWeekControl
                    ? toNumber(hoursPerWeekControl.value)
                    : this.DEFAULT_PERIOD,
                  interval: TimeUnitApi.WEEK,
                },
              }
            : undefined,
        upgrades: {
          assisted: false,
          featured: false,
          NDA: false,
          urgent: false,
          nonpublic: false,
          fulltime: false,
          ipContract: false,
          listed: false,
          projectManagement: false,
          qualified: false,
          sealed: false,
          extend: false,
        },

        // FIXME: Make these the real values
        language: '',
        ndaDetails: { signatures: [] },
        customFieldValues: [],
      };

      // Set automatic upgrades for AFLN hire me projects
      if (this.uiConfig.theme === 'arrow') {
        newProject.upgrades.NDA = true;
        newProject.upgrades.nonpublic = true;
        newProject.hiremeInitialBid.period = this.DEFAULT_PERIOD_ARROW;
      }

      this.createProject(newProject);
    } else {
      this.handleFormErrors();
    }
  }

  private getTitle() {
    return this.refProject
      ? `${this.refProject.title} - Rehire`
      : `Project for ${this.hireMeUser.profileUserDisplayName}`;
  }

  submitDeloitteProject() {
    const form = this.hireMeFormGroup.value;
    dirtyAndValidate(this.hireMeFormGroup);

    this.hireMeFormGroup.statusChanges
      .pipe(take(1))
      .toPromise()
      .then(status => {
        if (status === 'INVALID') {
          return false;
        }

        this._buttonBusy$.next(true);
        this.apiError$.next(undefined);
        // get currency for deloitte projects
        const projectObject = Rx.combineLatest([
          this.deloitteCurrency$,
          this.getCustomFieldValuesForProjectObject(),
        ])
          .pipe(take(1))
          .toPromise()
          .then(([currency, customFieldValues]) => ({
            title: this.getTitle(),
            description: form.message,
            currency,
            type: ProjectTypeApi.HOURLY,
            budget: {
              minimum: 1,
              maximum: 1,
            },
            skills: [],
            ndaDetails: {
              hiddenDescription: '',
              signatures: [],
            },
            hourlyProjectInfo: {
              commitment: {
                hours: toNumber(form.billableHours),
                interval: TimeUnitApi.WEEK,
              },
            },
            files: [],
            timeframe: {
              startDate: form.startDate.getTime(),
              endDate: form.completionDate.getTime(),
            },
            // TODO: T213935 - This is deprecated and will be removed.
            deloitteDetails: {
              billingCode: form[DeloitteProjectPostField.BILLING_CODE],
              industryOffering: {
                projectType: form[DeloitteProjectPostField.PROJECT_TYPE],
                practice: form[DeloitteProjectPostField.PRACTICE],
                industry: form[DeloitteProjectPostField.INDUSTRY_SECTOR],
                offering: form[DeloitteProjectPostField.MARKET_OFFERING],
              },
              itar: form[DeloitteProjectPostField.IS_SUBJECT_TO_ITAR],
              clearance: form[DeloitteProjectPostField.IS_CLEARANCE_REQUIRED]
                ? form[DeloitteProjectPostField.CLEARANCE]
                : undefined,
            },
            customFieldValues,
            hireme: true,
            hiremeInitialBid: {
              bidderId: this.hireMeUser.profileUserId,
              amount: 1,
              period: this.DEFAULT_PERIOD,
            },
            upgrades: {
              assisted: false,
              NDA: false,
              nonpublic: false,
              sealed: false,
              featured: false,
              urgent: false,
              fulltime: false,
              ipContract: false,
              listed: false,
              projectManagement: false,
              qualified: false,
              extend: false,
            },

            // FIXME: Make these the real values
            local: false,
            language: '',
          }));

        Promise.all([projectObject, this.paymentVerifyWhiteListedPromise]).then(
          ([project, paymentVerifyWhiteListed]) => {
            if (!paymentVerifyWhiteListed && !this.hireMeUser.paymentVerified) {
              this.paymentVerification();
            } else if (!this.hireMeUser.emailVerified) {
              this.emailVerification();
            } else {
              this.createProject(project);
            }
          },
        );
      });
  }

  getCustomFieldValuesForProjectObject(): Promise<
    ReadonlyArray<CustomFieldValue>
  > {
    return this.projectCustomFieldConfigCollection
      .valueChanges()
      .pipe(take(1))
      .toPromise()
      .then(projectCustomFieldConfig => {
        const form = this.hireMeFormGroup.value;

        const customFieldValues: CustomFieldValue[] = [];
        projectCustomFieldConfig.forEach(customFieldConfigItem => {
          let formFieldValue;

          const customFieldName = customFieldConfigItem.customFieldInfo.name;

          switch (customFieldName) {
            case DeloitteProjectPostField.BILLING_CODE:
            case DeloitteProjectPostField.PROJECT_TYPE:
            case DeloitteProjectPostField.UTILIZATION:
            case DeloitteProjectPostField.BUSINESS_LINE:
            case DeloitteProjectPostField.PRACTICE:
            case DeloitteProjectPostField.INDUSTRY_SECTOR:
            case DeloitteProjectPostField.INDUSTRY_GROUP:
            case DeloitteProjectPostField.MARKET_OFFERING:
            case DeloitteProjectPostField.OFFERING_PORTFOLIO:
            case DeloitteProjectPostField.IS_SUBJECT_TO_ITAR:
              formFieldValue = form[customFieldName];
              break;

            case DeloitteProjectPostField.CLEARANCE:
              if (form[DeloitteProjectPostField.IS_CLEARANCE_REQUIRED]) {
                formFieldValue = form[customFieldName];
              }
              break;

            // No error thrown as it's fine if there are custom fields in the config that aren't used
            default:
              return;
          }

          if (!isDefined(formFieldValue)) {
            return;
          }

          if (customFieldConfigItem.customFieldInfo.isArray) {
            if (!Array.isArray(formFieldValue)) {
              throw new Error(
                `Array custom field ${customFieldConfigItem.id} has values which are not an array`,
              );
            }

            const fieldValues = formFieldValue.map(fieldValue => ({
              value: fieldValue,
              type: customFieldConfigItem.customFieldInfo.fieldType,
            }));

            fieldValues.forEach((fieldValue: FieldValue) => {
              customFieldValues.push({
                customFieldInfoConfigurationId: customFieldConfigItem.id,
                resourceId: -1,
                isDefaultValue:
                  fieldValue.value ===
                  customFieldConfigItem.defaultValue?.value,
                ...fieldValue,
              });
            });
          } else {
            customFieldValues.push({
              customFieldInfoConfigurationId: customFieldConfigItem.id,
              resourceId: -1,
              isDefaultValue:
                formFieldValue === customFieldConfigItem.defaultValue,
              value: formFieldValue,
              type: customFieldConfigItem.customFieldInfo.fieldType,
            });
          }
        });

        return customFieldValues;
      });
  }

  async createProject(
    newProject: Omit<ProjectViewProject, ProjectViewProjectPushComputedFields>,
  ) {
    const response = await this.datastore.createDocument<
      ProjectViewProjectsCollection
    >('projectViewProjects', newProject);

    if (response.status !== 'success') {
      this.handleApiError(response);
      return;
    }

    const projectId = response.id;
    const bidCollection = this.datastore.collection<BidsCollection>(
      'bids',
      query => query.where('projectId', '==', projectId),
    );
    const paymentVerifyWhiteListed = await this.paymentVerifyWhiteListedPromise;

    this.bidsErrorSubscription = bidCollection.status$
      .pipe(
        filter(status => !!status.error),
        map(status => status.error),
      )
      .subscribe(error => this.handleApiError(error));

    this.bidsSubscription = bidCollection
      .valueChanges()
      .pipe(
        map(bids => bids[0]),
        take(1),
      )
      .subscribe(bid => {
        if (!bid) {
          this.redirectToProject(projectId);
          return;
        }

        this.removeDraft();
        return newProject.type === ProjectTypeApi.FIXED
          ? this.openCreateMilestoneModal(bid)
          : paymentVerifyWhiteListed || this.hireMeUser.paymentVerified
          ? this.redirectToProject(bid.projectId, HireType.HOURLY)
          : this.redirectToPaymentVerifyPage(bid.projectId);
      });
  }

  openCreateMilestoneModal(bid: Bid) {
    const showUpgrades = this.uiConfig.theme !== 'arrow';
    this.modalService
      .open(AwardModalComponent, {
        inputs: {
          bidId: bid.id,
          projectId: bid.projectId,
          showUpgrades,
        },
        size: ModalSize.LARGE,
        edgeToEdge: true,
        closeable: false,
      })
      .afterClosed()
      .toPromise()
      .then(res => {
        // Redirect to project if modal was closed manually, do not redirect otherwise
        if (res) {
          this.redirectToProject(bid.projectId);
        } else {
          this._buttonBusy$.next(false);
        }
      });
  }

  redirectToProject(projectId: number, projectType: HireType = HireType.FIXED) {
    this.datastore
      .document<ProjectsCollection>('projects', projectId)
      .valueChanges()
      .pipe(take(1))
      .toPromise()
      .then(project => {
        const pvpTab = projectType === HireType.HOURLY ? 'payments' : 'details';
        this.router.navigate([`/projects/${project.seoUrl}/${pvpTab}`], {
          queryParams: {
            alert_hireme_created: 'true',
          },
        });
      });
  }

  redirectToPaymentVerifyPage(projectId: number) {
    this.router.navigate(['/verify'], {
      queryParams: { ref: 'hourly', projectId },
    });
  }

  paymentVerification() {
    this.encodedUrlSubscription = this.userProfileEncodedUrl$.subscribe(
      result => {
        this.modalService
          .open(HireMePaymentVerifyModalComponent, {
            inputs: {
              encodedUrl: result.url,
            },
            size: ModalSize.SMALL,
            edgeToEdge: true,
          })
          .afterClosed()
          .toPromise()
          .then(() => {
            this._buttonBusy$.next(false);
          });
      },
    );
  }

  emailVerification() {
    this.handleApiError({
      errorCode: ErrorCodeApi.EMAIL_VERIFICATION_REQUIRED,
    });
  }

  handleFormErrors() {
    this._buttonBusy$.next(false);
  }

  // FIXME
  private handleApiError(response: ApiError) {
    this._buttonBusy$.next(false);
    this.saveDraft({
      confirmed: true,
    });

    if (response) {
      switch (response.errorCode) {
        case ErrorCodeApi.PAYMENT_VERIFICATION_REQUIRED:
          this.paymentVerification();
          break;
        default:
          this.apiError$.next(response);
          break;
      }
    }
  }

  touchFields() {
    const hireForControl = this.hireMeFormGroup.get('hireFor');
    if (!hireForControl) {
      return;
    }

    const hourlyBudgetControl = this.hireMeFormGroup.get('hourlyBudget');
    const fixedBudgetControl = this.hireMeFormGroup.get('fixedBudget');

    if (hireForControl.value === HireType.HOURLY) {
      this.touchField(hourlyBudgetControl);
      this.clearValidatorsAndUpdateValidity(fixedBudgetControl);
    } else {
      this.touchField(fixedBudgetControl);
      this.clearValidatorsAndUpdateValidity(hourlyBudgetControl);
    }

    this.touchField(this.hireMeFormGroup.get('message'));
    this.touchHoursPerWeekField();
  }

  touchField(control: AbstractControl | null) {
    if (control) {
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity();
    }
  }

  clearValidatorsAndUpdateValidity(control: AbstractControl | null): void {
    if (control) {
      control.clearValidators();
      control.updateValueAndValidity();
    }
  }

  touchHoursPerWeekField() {
    const hireForControl = this.hireMeFormGroup.get('hireFor');
    const hoursPerWeekControl = this.hireMeFormGroup.get('hoursPerWeek');

    if (
      hireForControl &&
      hoursPerWeekControl &&
      hireForControl.value === HireType.HOURLY
    ) {
      hoursPerWeekControl.markAsTouched({ onlySelf: true });
      hoursPerWeekControl.updateValueAndValidity();
    }
  }

  closeRookieMessage() {
    this.showRookieMessage = false;
  }

  handleProceed() {
    this.showRookieMessage = false;
    const hireForControl = this.hireMeFormGroup.get('hireFor');
    if (hireForControl && hireForControl.value === HireType.HOURLY) {
      this.openHireMeHourlyConfirmationModal();
    } else {
      this.submitProject();
    }
  }

  isDeloitteUser() {
    return this.hireMeUser && this.hireMeUser.isDeloitteDcUser;
  }

  onOptionSelected(option: SplitButtonOption) {
    switch (option.copy) {
      case HireMeSplitButtonOptions.INVITE:
        this.handleHireMeInviteOption();
        break;
      case HireMeSplitButtonOptions.FOLLOW:
        this.handleHireMeFollowUserOption();
        break;
      case HireMeSplitButtonOptions.UNFOLLOW:
        this.handleHireMeUnfollowUserOption();
        break;
      case HireMeSplitButtonOptions.RECOMMEND:
        this.handleHireMeRecommendUserOption();
        break;
      default:
        break;
    }
  }

  handleHireMeRecommendUserOption(): void {
    this.userRecommendCollection$
      .push({
        id: this.hireMeUser.profileUserId,
        recommendedByUserId: this.hireMeUser.authId,
        recommendedUserId: this.hireMeUser.profileUserId,
      })
      .then(result =>
        result.status === 'error'
          ? this.setToastAlert(RecommendUserToastItem.RECOMMEND_ERROR)
          : this.setToastAlert(RecommendUserToastItem.RECOMMEND_SUCCESS),
      );
  }

  handleHireMeFollowUserOption(): void {
    // Show an alert message if the user will go over their follow limit.
    if (this.followedUsersCount >= this.maxFollowLimit) {
      this.setToastAlert(FollowUserToastItem.FOLLOW_ERROR_OVER_LIMIT);
      return;
    }

    this.userFollowsCollection
      .push({
        followedUserId: this.hireMeUser.profileUserId,
        followedByUserId: this.hireMeUser.authId,
        id: this.hireMeUser.profileUserId,
        status: UserFollowStatusApi.FOLLOWING,
      })
      .then(result =>
        result.status === 'error'
          ? this.setToastAlert(FollowUserToastItem.FOLLOW_ERROR)
          : this.setToastAlert(FollowUserToastItem.FOLLOW_SUCCESS),
      );
  }

  handleHireMeUnfollowUserOption(): void {
    this.userFollowsCollection
      .remove(this.hireMeUser.profileUserId)
      .then(result =>
        result.status === 'error'
          ? this.setToastAlert(FollowUserToastItem.UNFOLLOW_ERROR)
          : this.setToastAlert(FollowUserToastItem.UNFOLLOW_SUCCESS),
      );
  }

  setToastAlert(item: FollowUserToastItem | RecommendUserToastItem): void {
    this.showToastAlert.emit(item);
  }

  handleHireMeInviteOption(): void {
    this.modalService.open(InviteModalComponent, {
      size: ModalSize.SMALL,
      edgeToEdge: false,
      mobileFullscreen: true,
      inputs: {
        freelancerId: this.hireMeUser.profileUserId,
        freelancerName: this.hireMeUser.profileUserDisplayName,
      },
    });
  }

  getEnableFormControls() {
    let enableFormControls: string[];
    if (this.isDeloitteUser()) {
      enableFormControls = [
        ...this.enableFormControls[EnterpriseApi.DELOITTE_DC],
      ];
    } else {
      enableFormControls = [...this.enableFormControls.default];
    }
    return [...enableFormControls, ...this.enableFormControls.all];
  }

  private loadDraft() {
    this.localStorage
      .get('hireMeDraft')
      .pipe(take(1))
      .toPromise()
      .then(draft => {
        if (!(draft && draft.freelancerId === this.hireMeUser.profileUserId)) {
          return;
        }

        const currencyIdControl = this.hireMeFormGroup.controls.currencyId;
        const hireForControl = this.hireMeFormGroup.controls.hireFor;

        /**
         * Mark `hireFor` and `currencyId` as dirty so it doesn't conflict with
         * options$ and initialCurrency$ manually setting field values
         */
        currencyIdControl.markAsDirty();
        currencyIdControl.setValue(draft.currencyId);
        hireForControl.markAsDirty();
        hireForControl.setValue(draft.hireFor);

        this.hireMeFormGroup.controls.hoursPerWeek.setValue(draft.hoursPerWeek);
        this.hireMeFormGroup.controls.message.setValue(draft.message);

        // Need to do this since `setDefaultBudget` changes the budget value dynamically
        const hourlyBudgetControl = this.hireMeFormGroup.controls.hourlyBudget;
        const fixedBudgetControl = this.hireMeFormGroup.controls.fixedBudget;

        if (hireForControl.value === HireType.HOURLY) {
          hourlyBudgetControl.markAsTouched();
          hourlyBudgetControl.setValue(draft.budget);
        } else {
          fixedBudgetControl.markAsTouched();
          fixedBudgetControl.setValue(draft.budget);
        }

        // Show the confirmation modal
        // if the user saw the confirmation modal before,
        if (hireForControl.value === HireType.HOURLY && draft.confirmed) {
          // We won't open the confirmation modal
          // when the user revisit the page with a draft.
          this.saveDraft({
            confirmed: false,
          });
          this.openHireMeHourlyConfirmationModal();
        }
      });
  }

  private saveDraft({
    confirmed = false,
  }: Partial<Pick<HireMeDraft, 'confirmed'>> = {}) {
    const messageControl = this.hireMeFormGroup.controls.message;
    const hireForControl = this.hireMeFormGroup.controls.hireFor;
    const hoursPerWeekControl = this.hireMeFormGroup.controls.hoursPerWeek;
    const currencyIdControl = this.hireMeFormGroup.controls.currencyId;
    const hourlyBudgetControl = this.hireMeFormGroup.controls.hourlyBudget;
    const fixedBudgetControl = this.hireMeFormGroup.controls.fixedBudget;

    const data: HireMeDraft = {
      budget:
        hireForControl.value === HireType.HOURLY
          ? toNumber(hourlyBudgetControl.value)
          : toNumber(fixedBudgetControl.value),
      currencyId: toNumber(currencyIdControl.value),
      freelancerId: this.hireMeUser.profileUserId,
      hireFor: hireForControl.value,
      hoursPerWeek: toNumber(hoursPerWeekControl.value),
      message: messageControl.value,
      // Whether the user has confirmed the hire me project in the
      // confirmation modal.
      confirmed,
    };

    this.localStorage.set('hireMeDraft', data);
  }

  private removeDraft() {
    this.localStorage
      .get('hireMeDraft')
      .pipe(take(1))
      .toPromise()
      .then(draft => {
        if (!(draft && draft.freelancerId === this.hireMeUser.profileUserId)) {
          return;
        }

        this.localStorage.set('hireMeDraft', null);
      });
  }

  ngOnDestroy() {
    this.bidsSubscription.unsubscribe();
    this.bidsErrorSubscription.unsubscribe();
    this.convertSubscription.unsubscribe();
    this.budgetMinimumSubscription.unsubscribe();
    this.encodedUrlSubscription.unsubscribe();
    this.updateDefaultsSubscription.unsubscribe();
    this.isClearanceRequiredSubscription.unsubscribe();
    this.startDateValidatorsSubscription.unsubscribe();
    this.billingCodeSeparatorSubscription.unsubscribe();
    this.hireForValidatorSubscription.unsubscribe();
    this.showFollowButtonSubscription.unsubscribe();
    if (this.industryGroupSubscription) {
      this.industryGroupSubscription.unsubscribe();
    }
    if (this.offeringPortfolioSubscription) {
      this.offeringPortfolioSubscription.unsubscribe();
    }
    if (this.refProjectSubscription) {
      this.refProjectSubscription.unsubscribe();
    }
  }
}
