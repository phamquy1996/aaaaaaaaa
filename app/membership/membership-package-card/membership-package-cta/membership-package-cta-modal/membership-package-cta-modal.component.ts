import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  BackendDeleteResponse,
  BackendPushResponse,
  Datastore,
} from '@freelancer/datastore';
import {
  Currency,
  MembershipDowngrade,
  MembershipDowngradesCollection,
  MembershipPackagePrice,
  MembershipRenewal,
  MembershipSubscriptionCollection,
  MembershipSubscriptionHistory,
  MembershipSubscriptionHistoryCollection,
  Package,
} from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import {
  FontColor,
  FontType,
  FontWeight,
  TextSize,
  TextTransform,
} from '@freelancer/ui/text';
import { assertNever } from '@freelancer/utils';
import { TimeUnitApi } from 'api-typings/common/common';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import {
  DowngradeStatusApi,
  SubscriptionTypeApi,
} from 'api-typings/memberships/memberships_types';
import {
  LegacyMembershipPackages,
  MEMBERSHIP_BADGES,
  SubscriptionAction,
  SubscriptionType,
} from 'app/membership/membership.types';

@Component({
  template: `
    <ng-container flTrackingSection="ModalMembershipPlanChangeConfirm">
      <fl-heading
        [flMarginBottom]="Margin.LARGE"
        [headingType]="HeadingType.H4"
        [ngSwitch]="actionType"
        [size]="TextSize.MID"
      >
        <ng-container
          *ngSwitchCase="SubscriptionAction.UPGRADE"
          i18n="Upgrade membership heading"
        >
          You are about to upgrade your membership
        </ng-container>
        <ng-container
          *ngSwitchCase="SubscriptionAction.DOWNGRADE"
          i18n="Downgrade membership heading"
        >
          You are about to downgrade your membership
        </ng-container>
        <ng-container
          *ngSwitchCase="SubscriptionAction.CONTINUE"
          i18n="Continue membership heading"
        >
          You are about to continue your membership
        </ng-container>
        <ng-container
          *ngSwitchCase="SubscriptionAction.TRIAL"
          i18n="Free membership trial heading"
        >
          You are about to start your free membership trial
        </ng-container>
      </fl-heading>
      <fl-bit [flMarginBottom]="Margin.LARGE">
        <ng-container *ngIf="fromPackage">
          <fl-text
            *ngIf="toPackage"
            i18n="From package label"
            [color]="FontColor.MID"
            [flMarginBottom]="Margin.XSMALL"
            [size]="TextSize.XXSMALL"
            [textTransform]="TextTransform.UPPERCASE"
            [weight]="FontWeight.BOLD"
          >
            From
          </fl-text>
          <fl-bit
            class="MembershipPackageModal-package"
            [flMarginBottom]="Margin.MID"
          >
            <fl-picture
              class="MembershipPackageModal-package-badge"
              [alt]="fromBadge"
              [flMarginRight]="Margin.SMALL"
              [src]="'badges/membership/' + fromBadge + '.svg'"
            ></fl-picture>
            <fl-bit class="MembershipPackageModal-package-details">
              <fl-text
                [flMarginBottom]="Margin.XXXSMALL"
                [size]="TextSize.SMALL"
              >
                {{ fromPackage.displayName | titlecase }}
              </fl-text>
              <fl-text
                i18n="Current membership monthly cost"
                [color]="FontColor.MID"
                [size]="TextSize.SMALL"
              >
                {{ currency.sign + fromMonthly.toFixed(2) }} monthly
              </fl-text>
              <fl-text
                *ngIf="fromPrice?.amount != fromMonthly"
                i18n="New membership annual cost"
                [color]="FontColor.MID"
              >
                or
                {{ currency.sign + fromPrice?.amount.toFixed(2) }}
                billed annually
              </fl-text>
            </fl-bit>
          </fl-bit>
        </ng-container>
        <ng-container *ngIf="toPackage">
          <fl-text
            *ngIf="fromPackage"
            i18n="To package label"
            [color]="FontColor.MID"
            [flMarginBottom]="Margin.XSMALL"
            [size]="TextSize.XXSMALL"
            [textTransform]="TextTransform.UPPERCASE"
            [weight]="FontWeight.BOLD"
          >
            To
          </fl-text>
          <fl-bit
            class="MembershipPackageModal-package"
            [flMarginBottom]="Margin.MID"
          >
            <fl-picture
              class="MembershipPackageModal-package-badge"
              [alt]="toBadge"
              [flMarginRight]="Margin.SMALL"
              [src]="'badges/membership/' + toBadge + '.svg'"
            ></fl-picture>
            <fl-bit class="MembershipPackageModal-package-details">
              <fl-text
                [flMarginBottom]="Margin.XXXSMALL"
                [size]="TextSize.SMALL"
              >
                {{ toPackage.displayName | titlecase }}
              </fl-text>
              <fl-text
                *ngIf="actionType !== SubscriptionAction.TRIAL; else freeTrial"
                i18n="New membership monthly cost"
                [color]="FontColor.MID"
                [size]="TextSize.SMALL"
              >
                {{ currency.sign + toMonthly.toFixed(2) }} monthly
              </fl-text>
              <ng-template #freeTrial>
                <fl-bit>
                  <fl-text
                    class="MembershipPackageModal-trial-price"
                    [flMarginRight]="Margin.XXSMALL"
                    [fontType]="FontType.SPAN"
                  >
                    {{ currency.sign + toMonthly.toFixed(2) }}
                  </fl-text>
                  <fl-text
                    i18n="Free monthly membership"
                    [color]="FontColor.SUCCESS"
                    [fontType]="FontType.SPAN"
                  >
                    FREE Monthly
                  </fl-text>
                </fl-bit>
              </ng-template>
              <fl-text
                *ngIf="toPrice?.amount != toMonthly"
                i18n="New membership annual cost"
                [color]="FontColor.MID"
              >
                or
                {{ toPrice?.amount | flCurrency: currency.code }}
                billed annually
              </fl-text>
            </fl-bit>
          </fl-bit>
        </ng-container>
      </fl-bit>
      <fl-bit [flMarginBottom]="Margin.MID" [ngSwitch]="actionType">
        <fl-text
          *ngSwitchCase="SubscriptionAction.UPGRADE"
          i18n="Upgrade membership start"
        >
          Your new membership plan will take effect immediately and will renew
          on
          {{ endDate | date: 'MMM d, y' }}
        </fl-text>
        <fl-text
          *ngSwitchCase="SubscriptionAction.DOWNGRADE"
          i18n="Downgrade membership start"
        >
          Your new membership plan will take effect when your old plan expires
          on
          {{ activeSubscription.timeEndedExpected | date: 'MMM d, y' }}.
        </fl-text>
        <fl-text
          *ngSwitchCase="SubscriptionAction.TRIAL"
          i18n="Free membership trial start"
        >
          Your free trial will take effect immediately and end on
          {{ endDate | date: 'MMM d, y' }}
        </fl-text>
      </fl-bit>
      <fl-text
        *ngIf="subscriptionType === SubscriptionType.ANNUAL"
        i18n="Annual monthly terms of agreement"
        [flMarginBottom]="Margin.MID"
      >
        By confirming, you are committing to a one year contract.
        <fl-tooltip
          i18n-message="Early cancellation agreement"
          message="If you cancel before one year, you agree to pay for the remaining months left on your plan."
        >
          <fl-icon [name]="'ui-info-v2'" [size]="IconSize.SMALL"></fl-icon>
        </fl-tooltip>
      </fl-text>
      <fl-bit class="MembershipPackageModal-buttons">
        <fl-button
          flTrackingLabel="CancelMembershipChangeButton"
          i18n="Cancel membership upgrade or downgrade"
          [color]="ButtonColor.TRANSPARENT_DARK"
          [disabled]="response && (response | async) === null"
          [flMarginRight]="Margin.SMALL"
          (click)="cancel()"
        >
          Cancel
        </fl-button>
        <fl-button
          flTrackingLabel="ConfirmMembershipChangeButton"
          flTrackingReferenceType="package_id"
          i18n="confirm membership upgrade or downgrade"
          [busy]="response && (response | async) === null"
          [color]="ButtonColor.SECONDARY"
          [flTrackingReferenceId]="toPackage.id"
          (click)="confirm()"
        >
          Confirm
        </fl-button>
      </fl-bit>
    </ng-container>
  `,
  styleUrls: ['./membership-package-cta-modal.component.scss'],
})
export class MembershipPackageCtaModalComponent implements OnInit {
  ButtonColor = ButtonColor;
  FontColor = FontColor;
  FontType = FontType;
  FontWeight = FontWeight;
  HeadingType = HeadingType;
  IconSize = IconSize;
  Margin = Margin;
  SubscriptionAction = SubscriptionAction;
  SubscriptionType = SubscriptionType;
  TextSize = TextSize;
  TextTransform = TextTransform;

  endDate: number;
  fromBadge: string;
  toBadge: string;
  fromPrice: MembershipPackagePrice | undefined;
  fromMonthly: number;
  toMonthly: number;

  response: Promise<
    | BackendDeleteResponse<MembershipDowngradesCollection>
    | BackendPushResponse<MembershipSubscriptionCollection>
  >;

  @Input() actionType: SubscriptionAction;
  @Input() fromPackage: Package;
  @Input() toPackage: Package;
  @Input() toPrice?: MembershipPackagePrice;
  @Input() subscriptionType: SubscriptionType;
  @Input() activeRenewal: MembershipRenewal;
  @Input() activeSubscription: MembershipSubscriptionHistory;
  @Input() isTrialEligible: boolean;
  @Input() currency: Currency;
  @Input() activeDowngrade: MembershipDowngrade;

  constructor(
    private datastore: Datastore,
    private modalRef: ModalRef<MembershipPackageCtaModalComponent>,
    private router: Router,
  ) {}

  ngOnInit() {
    if (
      this.actionType === SubscriptionAction.UPGRADE ||
      this.actionType === SubscriptionAction.TRIAL
    ) {
      const now = new Date();
      now.setMonth(
        now.getMonth() +
          (this.subscriptionType === SubscriptionType.MONTHLY ? 1 : 12),
      );
      this.endDate = now.getTime();
    }

    if (this.fromPackage) {
      this.fromPrice =
        this.activeSubscription.trialPrice ?? this.activeSubscription.price;
      this.fromBadge =
        this.fromPrice?.durationType === TimeUnitApi.YEAR
          ? `annual-${this.getBadgeName(this.fromPackage)}`
          : `monthly-${this.getBadgeName(this.fromPackage)}`;

      if (this.fromPrice) {
        this.fromMonthly =
          this.fromPrice.durationType === TimeUnitApi.YEAR
            ? this.fromPrice.amount / 12
            : this.fromPrice.amount;
      }
    }

    if (this.toPackage) {
      this.toBadge =
        this.subscriptionType === SubscriptionType.ANNUAL_PRE_PAID
          ? `annual-${this.getBadgeName(this.toPackage)}`
          : `monthly-${this.getBadgeName(this.toPackage)}`;

      if (this.toPrice) {
        this.toMonthly =
          this.subscriptionType === SubscriptionType.MONTHLY
            ? this.toPrice.amount
            : this.toPrice.amount / 12;
      }
    }
  }

  getBadgeName(pkg: Package) {
    switch (pkg.internalName) {
      case LegacyMembershipPackages.INTRO:
      case LegacyMembershipPackages.STARTER:
        return MEMBERSHIP_BADGES[0];
      case LegacyMembershipPackages.BASIC:
      case LegacyMembershipPackages.BASIC_WITH_EXAM:
        return MEMBERSHIP_BADGES[1];
      case LegacyMembershipPackages.PLUS:
      case LegacyMembershipPackages.PLUS_WITH_EXAM:
        return MEMBERSHIP_BADGES[2];
      case LegacyMembershipPackages.PROFESSIONAL:
      case LegacyMembershipPackages.PROFESSIONAL_WITH_EXAM:
        return MEMBERSHIP_BADGES[3];
      case LegacyMembershipPackages.PREMIER:
      case LegacyMembershipPackages.PREMIER_WITH_EXAM:
        return MEMBERSHIP_BADGES[4];
      default:
        return MEMBERSHIP_BADGES[0];
    }
  }

  cancel() {
    this.modalRef.close();
  }

  confirm() {
    switch (this.actionType) {
      case SubscriptionAction.CONTINUE:
        if (
          this.activeDowngrade &&
          this.activeDowngrade.status === DowngradeStatusApi.PENDING
        ) {
          this.response = this.datastore
            .document<MembershipDowngradesCollection>(
              'membershipDowngrades',
              this.activeDowngrade.id,
            )
            .remove()
            .then(res => {
              if (res.status === 'success') {
                this.router.navigate(['/dashboard']);
              } else {
                this.modalRef.close(res);
              }
              return res;
            });
        } else if (this.activeSubscription && !this.activeRenewal) {
          this.datastore
            .document<MembershipSubscriptionHistoryCollection>(
              'membershipSubscriptionHistory',
              this.activeSubscription.id,
            )
            .update({ autoRenew: true })
            .then(res => {
              if (res.status === 'success') {
                this.router.navigate(['/dashboard']);
              } else {
                this.modalRef.close(res);
              }
            });
        }
        break;
      case SubscriptionAction.DOWNGRADE:
      case SubscriptionAction.TRIAL:
      case SubscriptionAction.UPGRADE:
        if (this.toPrice) {
          const request = {
            action: SubscriptionTypeApi.SUBSCRIBE,
            autoRenew: true,
            currencyId: this.toPrice.currencyId,
            contractQuantity: this.toPrice.contractQuantity,
            coupon: this.toPrice.coupon,
            durationType: this.toPrice.durationType,
            durationCycle: this.toPrice.durationCycle,
            isTrial: this.actionType === SubscriptionAction.TRIAL,
            packageId: this.toPackage.id,
            quantity: 1,
          };
          this.response = this.datastore
            .collection<MembershipSubscriptionCollection>(
              'membershipSubscription',
            )
            .push({ request })
            .then(res => {
              if (res.status === 'success') {
                this.router.navigate(['/dashboard']);
              } else {
                // Convert string TimeUnitApi to number (e.g., 'year' => 6)
                const durationType = Object.values(TimeUnitApi).indexOf(
                  request.durationType,
                );

                switch (res.errorCode) {
                  case ErrorCodeApi.PAYMENT_REQUIRED:
                    this.router.navigate(['/deposit/cc'], {
                      queryParams: {
                        package_id: request.packageId,
                        duration_type: durationType,
                        duration_cycle: request.durationCycle,
                        contract_quantity: request.contractQuantity,
                        quantity: request.quantity,
                        auto_renew: request.autoRenew,
                        currency: request.currencyId,
                        amount: this.toPrice?.amount,
                        redirected: 'membership_subscribe',
                        checkBalance: true,
                        membership_coupon: this.toPrice?.coupon,
                      },
                    });
                    break;
                  default:
                    this.modalRef.close(res);
                    break;
                }
              }
              return res;
            });
        }
        break;
      default:
        assertNever(this.actionType);
    }
  }
}
