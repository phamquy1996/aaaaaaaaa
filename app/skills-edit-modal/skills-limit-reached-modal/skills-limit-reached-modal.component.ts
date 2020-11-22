import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  BackendPushErrorResponse,
  Datastore,
  DatastoreDocument,
} from '@freelancer/datastore';
import {
  MembershipPackageBenefit,
  RecommendedMembershipCollection,
  RecommendedMembershipPackage,
} from '@freelancer/datastore/collections';
import { Location } from '@freelancer/location';
import {
  BadgeSize,
  BadgeType,
  MembershipBadgeType,
} from '@freelancer/ui/badge';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { ListItemPadding, ListItemType } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';
import { isDefined } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Component({
  selector: 'app-skills-limit-reached',
  template: `
    <ng-container
      *ngIf="
        (recommendedMembershipDocument.status$ | async)?.ready;
        else loading
      "
    >
      <fl-container
        *ngIf="recommendedMembershipPackage$ | async as recommendedMembership"
        class="LimitReachedModal"
        flTrackingSection="SkillsEditModalLimitReachedModal"
      >
        <fl-heading
          i18n="Skills Edit Modal Limit Reached Modal Header Text"
          [flMarginBottom]="Margin.XSMALL"
          [size]="TextSize.MID"
          [headingType]="HeadingType.H2"
        >
          You've maxed out your skills
        </fl-heading>
        <fl-text
          i18n="Skills Edit Modal Limit Reached Modal Description"
          [flMarginBottom]="Margin.MID"
        >
          Subscribe to
          {{ recommendedMembership.displayNameFirstUpper }} to add up to
          {{ maxSkills$ | async }} skills!
        </fl-text>
        <fl-bit class="LimitReachedModal-body" [flMarginBottom]="Margin.SMALL">
          <fl-bit
            class="LimitReachedModal-body-logoColumn"
            [flMarginRight]="Margin.LARGE"
            [flHideMobile]="true"
          >
            <fl-badge
              [badge]="{
                type: BadgeType.MEMBERSHIP,
                badge: getBadge(
                  recommendedMembership.isAnnual || false,
                  recommendedMembership.level
                )
              }"
              [flMarginBottom]="Margin.XXSMALL"
              [size]="BadgeSize.LARGE"
            >
            </fl-badge>
            <fl-bit *ngIf="recommendedMembership.isTrial; else nonTrialText">
              <fl-text
                i18n="Skills Edit Modal Limit Reached Modal Free Text"
                [color]="FontColor.INHERIT"
                [weight]="FontWeight.BOLD"
              >
                FREE
              </fl-text>
              <fl-text
                i18n="Skills Edit Modal Limit Reached Modal One Month Free Text"
                [color]="FontColor.INHERIT"
                [weight]="FontWeight.BOLD"
              >
                1 month trial
              </fl-text>
            </fl-bit>
            <ng-template #nonTrialText>
              <fl-text [color]="FontColor.INHERIT" [weight]="FontWeight.BOLD">
                {{ recommendedMembership.currencyDetails.sign }}
                {{ recommendedMembership.monthlyPriceIntegerPart }}
                <sup>{{ recommendedMembership.monthlyPriceDecimalPart }}</sup>
              </fl-text>
              <fl-text
                *ngIf="recommendedMembership.withTax; else withoutTax"
                i18n="
                   Skills Edit Modal Limit Reached Modal Per Month With Tax Text

                "
                [color]="FontColor.INHERIT"
                [flMarginBottom]="Margin.SMALL"
                [weight]="FontWeight.BOLD"
              >
                per month with {{ recommendedMembership.taxName }}
              </fl-text>
              <ng-template #withoutTax>
                <fl-text
                  i18n="Skills Edit Modal Limit Reached Modal Per Month Text"
                  [color]="FontColor.INHERIT"
                  [flMarginBottom]="Margin.SMALL"
                  [weight]="FontWeight.BOLD"
                >
                  per month
                </fl-text>
              </ng-template>
            </ng-template>
            <fl-text
              *ngIf="
                recommendedMembership.isAnnual && recommendedMembership.withTax;
                else annualWithoutTax
              "
              i18n="
                 Skills Edit Modal Limit Reached Modal Billed Annually With Tax
                Text
              "
            >
              {{ recommendedMembership.currencyDetails.sign }}
              {{ recommendedMembership.priceAfterTax }} billed annually with
              {{ recommendedMembership.taxName }}
            </fl-text>
            <ng-template #annualWithoutTax>
              <fl-text
                *ngIf="
                  recommendedMembership.isAnnual &&
                  !recommendedMembership.withTax
                "
                i18n="
                   Skills Edit Modal Limit Reached Modal Billed Annually Text
                "
              >
                {{ recommendedMembership.currencyDetails.sign }}
                {{ recommendedMembership.priceAfterTax }} billed annually
              </fl-text>
            </ng-template>
          </fl-bit>
          <fl-grid class="LimitReachedModal-body-columns">
            <fl-col [col]="12" [colTablet]="6">
              <fl-list
                [padding]="ListItemPadding.XXSMALL"
                [type]="ListItemType.NON_BORDERED"
              >
                <fl-list-item
                  *ngFor="let benefitWithValue of benefitsWithValue$ | async"
                >
                  <fl-bit class="LimitReachedModal-body-columns-listItem">
                    <fl-icon
                      [color]="IconColor.SUCCESS"
                      [name]="'ui-tick'"
                      [flMarginRight]="Margin.XXSMALL"
                      [size]="IconSize.SMALL"
                    ></fl-icon>
                    <fl-text
                      class="LimitReachedModal-body-columns-listItem-number"
                      [weight]="FontWeight.BOLD"
                      [flMarginRight]="Margin.XXXSMALL"
                    >
                      {{
                        benefitWithValue.benefitValue
                          ? benefitWithValue.benefitValue
                          : benefitWithValue.benefit.value
                      }}
                    </fl-text>
                    <fl-text>
                      {{ benefitWithValue.benefit.displayName }}
                    </fl-text>
                  </fl-bit>
                </fl-list-item>
              </fl-list>
            </fl-col>
            <fl-col [col]="12" [colTablet]="6">
              <fl-list
                [padding]="ListItemPadding.XXSMALL"
                [type]="ListItemType.NON_BORDERED"
              >
                <fl-list-item
                  *ngFor="
                    let benefitWithoutValue of benefitsWithoutValue$ | async
                  "
                >
                  <fl-bit class="LimitReachedModal-body-columns-listItem">
                    <fl-icon
                      [color]="IconColor.SUCCESS"
                      [name]="'ui-tick'"
                      [flMarginRight]="Margin.XXSMALL"
                      [size]="IconSize.SMALL"
                    ></fl-icon>
                    <fl-text
                      *ngIf="benefitWithoutValue.benefitValue <= UNLIMITED"
                      i18n="Skills Limit Reached Modal Unlimited Text"
                      [flMarginRight]="Margin.XXXSMALL"
                    >
                      Unlimited
                    </fl-text>
                    <fl-text>
                      {{ benefitWithoutValue.benefit.displayName }}
                    </fl-text>
                  </fl-bit>
                </fl-list-item>
              </fl-list>
            </fl-col>
          </fl-grid>
        </fl-bit>
        <fl-bit class="LimitReachedModal-footer">
          <fl-bit
            *ngIf="showConfirmation$ | async; else footerButtons"
            class="LimitReachedModal-footer-banners"
          >
            <fl-banner-alert
              bannerTitle="Confirm your subscription"
              i18n-bannerTitle="
                 Skills Edit Modal Limit Reached Modal Confirm Banner Alert
                Title
              "
              [closeable]="false"
              [type]="BannerAlertType.INFO"
            >
              <fl-text
                i18n="
                   Skills Edit Modal Limit Reached Modal Confirm Banner Alert
                  Description
                "
                [flMarginBottom]="Margin.XXSMALL"
              >
                You're almost done - we just need to confirm your subscription.
              </fl-text>
              <fl-bit>
                <fl-button
                  i18n="
                     Skills Edit Modal Limit Reached Modal Confirm Subscription
                    Button
                  "
                  flTrackingLabel="ConfirmSubscription"
                  [busy]="subscribeNowButtonLoading$ | async"
                  [color]="ButtonColor.SECONDARY"
                  [flMarginRight]="Margin.SMALL"
                  (click)="handleSubscribeNowClicked(recommendedMembership)"
                >
                  Confirm Subscription
                </fl-button>
                <fl-button
                  i18n="Skills Edit Modal Limit Reached Modal Not Now Button"
                  flTrackingLabel="NotNow"
                  [color]="ButtonColor.TRANSPARENT_DARK"
                  [flMarginRight]="Margin.SMALL"
                  (click)="handleNotNowClicked()"
                >
                  Not Now
                </fl-button>
              </fl-bit>
            </fl-banner-alert>
            <app-skills-limit-reached-modal-errors
              *ngIf="apiError$ | async as apiError"
              [error]="apiError"
              (close)="handleErrorClosed()"
            ></app-skills-limit-reached-modal-errors>
          </fl-bit>
          <ng-template #footerButtons>
            <fl-button
              i18n="Skills Edit Modal Limit Reached Modal Maybe Later Button"
              flTrackingLabel="MaybeLater"
              [color]="ButtonColor.TRANSPARENT_DARK"
              [flMarginRight]="Margin.SMALL"
              (click)="close.emit()"
            >
              Maybe Later
            </fl-button>
            <fl-button
              *ngIf="recommendedMembership.isTrial; else nonTrialButton"
              i18n="
                 Skills Edit Modal Limit Reached Modal Start Free Trial Button
              "
              flTrackingLabel="StartFreeTrial"
              [color]="ButtonColor.SECONDARY"
              (click)="
                handleStartFreeTrialClicked(
                  recommendedMembership.trialLandingUrl
                )
              "
            >
              Start Free Trial
            </fl-button>
            <ng-template #nonTrialButton>
              <fl-button
                i18n="
                   Skills Edit Modal Limit Reached Modal Subscribe Now Button
                "
                flTrackingLabel="SubscribeNow"
                [color]="ButtonColor.SECONDARY"
                (click)="handleSubscribeClicked()"
              >
                Subscribe Now
              </fl-button>
            </ng-template>
          </ng-template>
        </fl-bit>
      </fl-container>
    </ng-container>
    <ng-template #loading>
      <fl-bit
        class="LimitReachedModal-loading"
        flTrackingSection="SkillsEditModalLimitReachedModal"
      >
        <fl-spinner flTrackingLabel="SkillsEditModalLimitReachedModalSpinner">
        </fl-spinner>
      </fl-bit>
    </ng-template>
  `,
  styleUrls: ['./skills-limit-reached-modal.component.scss'],
})
export class SkillsLimitReachedModalComponent implements OnInit, OnDestroy {
  BadgeSize = BadgeSize;
  BadgeType = BadgeType;
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  TextSize = TextSize;
  HeadingType = HeadingType;
  FontColor = FontColor;
  FontWeight = FontWeight;
  IconColor = IconColor;
  IconSize = IconSize;
  ListItemPadding = ListItemPadding;
  ListItemType = ListItemType;
  Margin = Margin;
  MembershipBadgeType = MembershipBadgeType;

  @Output() close = new EventEmitter<number>();
  @Output() undefinedMembershipPackage = new EventEmitter<void>();

  readonly UNLIMITED = -1;

  maxSkills$: Rx.Observable<number>;
  trialLandingUrl$: Rx.Observable<string>;
  benefitsWithValue$: Rx.Observable<ReadonlyArray<MembershipPackageBenefit>>;
  benefitsWithoutValue$: Rx.Observable<ReadonlyArray<MembershipPackageBenefit>>;
  recommendedMembershipPackage$: Rx.Observable<RecommendedMembershipPackage>;

  private showConfirmationSubject$ = new Rx.BehaviorSubject(false);
  showConfirmation$ = this.showConfirmationSubject$.asObservable();

  private apiErrorSubject$ = new Rx.Subject<
    BackendPushErrorResponse<RecommendedMembershipCollection> | undefined
  >();
  apiError$ = this.apiErrorSubject$.asObservable();

  private subscribeNowButtonLoadingSubject$ = new Rx.BehaviorSubject(false);
  subscribeNowButtonLoading$ = this.subscribeNowButtonLoadingSubject$.asObservable();

  recommendedMembershipDocument: DatastoreDocument<
    RecommendedMembershipCollection
  >;

  private undefinedMembershipPackageSubscription?: Rx.Subscription;

  constructor(private datastore: Datastore, private location: Location) {}

  ngOnInit(): void {
    this.recommendedMembershipDocument = this.datastore.document<
      RecommendedMembershipCollection
    >('recommendedMembership');

    this.recommendedMembershipPackage$ = this.recommendedMembershipDocument.valueChanges();

    this.undefinedMembershipPackageSubscription = this.recommendedMembershipPackage$.subscribe(
      recommendedMembershipPackage => {
        if (!isDefined(recommendedMembershipPackage)) {
          this.undefinedMembershipPackage.emit();
        }
      },
    );

    this.trialLandingUrl$ = this.recommendedMembershipPackage$.pipe(
      map(
        recommendedMembershipPackage =>
          recommendedMembershipPackage.trialLandingUrl,
      ),
      filter(isDefined),
    );

    this.benefitsWithValue$ = this.recommendedMembershipPackage$.pipe(
      map(recommendedMembership =>
        (recommendedMembership.benefits || []).filter(
          packageBenefit =>
            this.hasToDisplay(packageBenefit) &&
            !this.displayOnlyText(packageBenefit),
        ),
      ),
    );

    this.benefitsWithoutValue$ = this.recommendedMembershipPackage$.pipe(
      map(recommendedMembership =>
        (recommendedMembership.benefits || []).filter(
          packageBenefit =>
            this.hasToDisplay(packageBenefit) &&
            this.displayOnlyText(packageBenefit),
        ),
      ),
    );

    this.maxSkills$ = this.recommendedMembershipPackage$.pipe(
      map(
        recommendedMembership =>
          (recommendedMembership.benefits || [])
            .filter(
              packageBenefit =>
                packageBenefit.benefit.internalName === 'skills_limit',
            )
            .map(packageBenefit => packageBenefit.benefitValue)[0] || 0,
      ),
    );
  }

  handleSubscribeClicked(): void {
    this.showConfirmationSubject$.next(true);
  }

  handleNotNowClicked(): void {
    this.showConfirmationSubject$.next(false);
  }

  handleSubscribeNowClicked(
    recommendedMembership: RecommendedMembershipPackage,
  ): void {
    this.subscribeNowButtonLoadingSubject$.next(true);

    this.datastore
      .collection<RecommendedMembershipCollection>('recommendedMembership')
      .push(recommendedMembership)
      .then(response => {
        this.subscribeNowButtonLoadingSubject$.next(false);

        if (response.status === 'success') {
          this.maxSkills$
            .pipe(take(1))
            .toPromise()
            .then(maxSkills => this.close.emit(maxSkills));
        } else {
          this.apiErrorSubject$.next(response);
        }
      });
  }

  handleStartFreeTrialClicked(trialLandingUrl: string): void {
    this.location.navigateByUrl(encodeURI(trialLandingUrl));
  }

  handleErrorClosed(): void {
    this.apiErrorSubject$.next(undefined);
  }

  getBadge(isAnnual: boolean, membershipLevel: number): MembershipBadgeType {
    if (isAnnual) {
      switch (membershipLevel) {
        case 2:
          return MembershipBadgeType.ANNUAL_LEVEL_TWO;
        case 3:
          return MembershipBadgeType.ANNUAL_LEVEL_THREE;
        case 4:
          return MembershipBadgeType.ANNUAL_LEVEL_FOUR;
        case 5:
          return MembershipBadgeType.ANNUAL_LEVEL_FIVE;
        default:
          return MembershipBadgeType.ANNUAL_LEVEL_ONE;
      }
    }

    switch (membershipLevel) {
      case 2:
        return MembershipBadgeType.MONTHLY_LEVEL_TWO;
      case 3:
        return MembershipBadgeType.MONTHLY_LEVEL_THREE;
      case 4:
        return MembershipBadgeType.MONTHLY_LEVEL_FOUR;
      case 5:
        return MembershipBadgeType.MONTHLY_LEVEL_FIVE;
      default:
        return MembershipBadgeType.MONTHLY_LEVEL_ONE;
    }
  }

  private displayOnlyText(packageBenefit: MembershipPackageBenefit): boolean {
    return (
      isDefined(packageBenefit.benefitValue) &&
      (packageBenefit.benefitValue === 1 ||
        packageBenefit.benefitValue <= this.UNLIMITED)
    );
  }

  private hasToDisplay(packageBenefit: MembershipPackageBenefit) {
    return (
      packageBenefit.benefit.value !== 0 ||
      isDefined(packageBenefit.benefitValue)
    );
  }

  ngOnDestroy(): void {
    if (this.undefinedMembershipPackageSubscription) {
      this.undefinedMembershipPackageSubscription.unsubscribe();
    }
  }
}
