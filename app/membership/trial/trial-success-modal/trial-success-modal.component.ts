import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Auth } from '@freelancer/auth';
import { Datastore } from '@freelancer/datastore';
import {
  MembershipPackagesCollection,
  MembershipSubscriptionHistory,
  MembershipSubscriptionHistoryCollection,
  UsersSelfCollection,
} from '@freelancer/datastore/collections';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { IconColor } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import { FontWeight, TextAlign, TextSize } from '@freelancer/ui/text';
import { SubscriptionStatusApi } from 'api-typings/memberships/memberships_types';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  template: `
    <fl-bit class="SuccessModal-container" flTrackingSection="TrialModal">
      <fl-bit class="SuccessModal-header" [flMarginBottom]="Margin.LARGE">
        <fl-picture
          class="SuccessModal-header-image"
          alt="Trial availed successfully"
          i18n-alt="Free trial availed successfully image alt"
          [alignCenter]="true"
          [display]="PictureDisplay.BLOCK"
          [flMarginBottom]="Margin.MID"
          [src]="'dashboard/widgets/polls/celebration.svg'"
        >
        </fl-picture>
        <fl-text
          i18n="Free membership trial subscription success message"
          [size]="TextSize.LARGE"
          [textAlign]="TextAlign.CENTER"
          [weight]="FontWeight.BOLD"
        >
          Congratulations on starting your free
          <app-membership-duration
            *ngIf="trial$ | async as trial"
            [duration]="trial.duration.type"
          ></app-membership-duration
          >!
        </fl-text>
      </fl-bit>
      <fl-bit [flMarginBottom]="Margin.XLARGE">
        <fl-text
          i18n="Extra Bids Benefit"
          [flMarginBottom]="Margin.SMALL"
          [size]="TextSize.SMALL"
          [textAlign]="TextAlign.LEFT"
        >
          <fl-icon
            class="SuccessModal-benefitsIcon"
            [color]="IconColor.SUCCESS"
            [name]="'ui-check-in-circle-v2'"
          ></fl-icon>
          {{ numberOfBids$ | async }} Bids
        </fl-text>
        <fl-text
          i18n="Extra Skills Benefit"
          [flMarginBottom]="Margin.SMALL"
          [size]="TextSize.SMALL"
          [textAlign]="TextAlign.LEFT"
        >
          <fl-icon
            class="SuccessModal-benefitsIcon"
            [color]="IconColor.SUCCESS"
            [name]="'ui-check-in-circle-v2'"
          ></fl-icon>
          {{ numberOfSkills$ | async }} Skills
        </fl-text>
        <fl-text
          i18n="Custom Cover Photo Benefit"
          [flMarginBottom]="Margin.SMALL"
          [size]="TextSize.SMALL"
          [textAlign]="TextAlign.LEFT"
        >
          <fl-icon
            class="SuccessModal-benefitsIcon"
            [color]="IconColor.SUCCESS"
            [name]="'ui-check-in-circle-v2'"
          ></fl-icon>
          Custom Cover Photo
        </fl-text>
        <fl-text
          i18n="External Invoicing Benefit"
          [flMarginBottom]="Margin.SMALL"
          [size]="TextSize.SMALL"
          [textAlign]="TextAlign.LEFT"
        >
          <fl-icon
            class="SuccessModal-benefitsIcon"
            [color]="IconColor.SUCCESS"
            [name]="'ui-check-in-circle-v2'"
          ></fl-icon>
          External Invoicing
        </fl-text>
        <fl-text
          i18n="and more Benefits"
          [size]="TextSize.SMALL"
          [textAlign]="TextAlign.LEFT"
        >
          <fl-icon
            class="SuccessModal-benefitsIcon"
            [color]="IconColor.SUCCESS"
            [name]="'ui-check-in-circle-v2'"
          ></fl-icon>
          and more
        </fl-text>
      </fl-bit>
      <fl-button
        class="SuccessModal-cta"
        flTrackingLabel="TrialModal.StartBidding"
        i18n="Start Bidding button"
        [color]="ButtonColor.SECONDARY"
        [flMarginBottom]="Margin.SMALL"
        [link]="'/search/projects'"
        [size]="ButtonSize.LARGE"
      >
        Start Bidding
      </fl-button>
      <fl-button
        class="SuccessModal-cta"
        flTrackingLabel="TrialModal.UpdateProfile"
        i18n="Update Your Profile button"
        [color]="ButtonColor.TRANSPARENT_DARK"
        [flMarginBottom]="Margin.LARGE"
        [link]="'/me'"
        [size]="ButtonSize.LARGE"
      >
        Update Your Profile
      </fl-button>
      <fl-bit
        *ngIf="recurringAmount$ | async as recurringAmount"
        class="SuccessModal-footer"
      >
        <fl-text
          i18n="Auto billing after trial warning message"
          [textAlign]="TextAlign.CENTER"
        >
          Cancel anytime before
          {{ (trial$ | async)?.timeEndedExpected | date: 'longDate' }} or
          continue subscription after your trial ends for
          {{ recurringAmount.amount | flCurrency: recurringAmount.currency }}.
        </fl-text>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./trial-success-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrialSuccessModalComponent implements OnInit {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  FontWeight = FontWeight;
  IconColor = IconColor;
  Margin = Margin;
  PictureDisplay = PictureDisplay;
  TextAlign = TextAlign;
  TextSize = TextSize;

  numberOfBids$: Rx.Observable<number | undefined>;
  numberOfSkills$: Rx.Observable<number | undefined>;
  recurringAmount$: Rx.Observable<{
    amount: number | undefined;
    currency: string;
  }>;
  trial$: Rx.Observable<MembershipSubscriptionHistory>;

  constructor(private auth: Auth, private datastore: Datastore) {}

  ngOnInit() {
    const user$ = this.datastore
      .document<UsersSelfCollection>('usersSelf', this.auth.getUserId())
      .valueChanges();

    this.trial$ = this.datastore
      .collection<MembershipSubscriptionHistoryCollection>(
        'membershipSubscriptionHistory',
        query => query.where('status', '==', SubscriptionStatusApi.ACTIVE),
      )
      .valueChanges()
      .pipe(map(logs => logs.filter(log => log.isTrial)[0]));

    const trialPackage$ = this.datastore
      .document<MembershipPackagesCollection>(
        'membershipPackages',
        this.trial$.pipe(map(log => log.packageId)),
      )
      .valueChanges();

    this.recurringAmount$ = Rx.combineLatest([user$, trialPackage$]).pipe(
      map(([user, pkg]) => ({
        amount: pkg.prices?.find(
          price => price.currencyId === user.primaryCurrency.id,
        )?.amount,
        currency: user.primaryCurrency.code,
      })),
    );

    this.numberOfBids$ = trialPackage$.pipe(
      map(
        pkg =>
          pkg?.benefits?.find(b => b.benefit.internalName === 'bids_limit')
            ?.benefitValue,
      ),
    );

    this.numberOfSkills$ = trialPackage$.pipe(
      map(
        pkg =>
          pkg?.benefits?.find(b => b.benefit.internalName === 'skills_limit')
            ?.benefitValue,
      ),
    );
  }
}
