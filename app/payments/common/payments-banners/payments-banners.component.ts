import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Datastore, DatastoreCollection } from '@freelancer/datastore';
import {
  BidAwardDraftsCollection,
  BidsCollection,
  CartItem,
  CartItemsCollection,
  ProjectViewUsersCollection,
} from '@freelancer/datastore/collections';
import {
  PaymentsMessagingService,
  PaymentsResult,
  PaymentsResultStatus,
} from '@freelancer/payments-messaging';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor } from '@freelancer/ui/button';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontType, FontWeight, TextSize } from '@freelancer/ui/text';
import { isDefined, toNumber } from '@freelancer/utils';
import { ContextTypeApi } from 'api-typings/payments/payments';
import * as Rx from 'rxjs';
import { filter, map, startWith, tap } from 'rxjs/operators';
import { DepositContext, DepositModalItem } from '../types';

@Component({
  selector: 'app-payments-banners',
  template: `
    <!-- notification on initialization -->
    <ng-container *ngIf="depositContext$ | async as depositContext">
      <app-notification-template
        *ngIf="depositContext.banner && depositContext.banner.body"
        [message]="depositContext.banner.body"
        [cta]="depositContext.banner.cancelBtnText"
        [ctaLink]="depositContext.banner.cancelUrl"
        [notificationType]="BannerAlertType.INFO"
      ></app-notification-template>
    </ng-container>
    <fl-bit
      *ngIf="isHourlyInitialPayment$ | async"
      [flMarginBottom]="Margin.SMALL"
    >
      <fl-banner-alert
        bannerTitle="Activate your hourly project"
        i18n="Deposit page - initial hourly payment"
        i18n-bannerTitle="Initial hourly payment banner title"
        [closeable]="false"
        [flMarginBottom]="Margin.XXSMALL"
        [flShowDesktop]="true"
        [type]="BannerAlertType.INFO"
      >
        You are required to fund an Initial Payment to show
        <fl-text
          [fontType]="FontType.SPAN"
          [color]="FontColor.DARK"
          [size]="TextSize.XSMALL"
          [weight]="FontWeight.BOLD"
        >
          {{ freelancerName$ | async }}
        </fl-text>
        that you are serious about working together. Once this Initial Payment
        has been used up, tracked time will be automatically billed using this
        chosen payment method. To ensure your safety, automatic billing can be
        turned off at any time and all payments may be contested through the
        Dispute Resolution Service. Credit and debit cards are accepted for
        recurring payment.
        <fl-link
          flTrackingLabel="InitialPaymentSupport"
          [link]="
            '/support/employer/Project/weekly-billing-for-hourly-projects'
          "
          [newTab]="true"
          >Learn More</fl-link
        >.
      </fl-banner-alert>
      <fl-banner-alert
        bannerTitle="Activate your hourly project"
        i18n="Deposit page - initial hourly payment"
        i18n-bannerTitle="Initial hourly payment banner title"
        [closeable]="false"
        [flHideDesktop]="true"
        [flMarginBottom]="Margin.XXSMALL"
        [type]="BannerAlertType.INFO"
      >
        You are required to fund an Initial Payment to show
        <fl-text
          [fontType]="FontType.SPAN"
          [size]="TextSize.XSMALL"
          [weight]="FontWeight.BOLD"
        >
          {{ freelancerName$ | async }}
        </fl-text>
        that you are serious about working together. Once this Initial Payment
        has been used up, tracked time will be automatically billed using this
        chosen payment method. Credit and debit cards are accepted for recurring
        payment.
      </fl-banner-alert>
    </fl-bit>
    <!-- notification for pending deposits -->
    <app-notification-template
      *ngIf="pending$ | async as pending"
      [header]="'Thank you! Your payment is pending.'"
      [message]="pending.paymentsMessage"
      [cta]="pending.cta"
      [ctaLink]="pending.ctaLink"
      [notificationType]="BannerAlertType.INFO"
    ></app-notification-template>

    <!-- notification on errors -->
    <app-error-template> </app-error-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentsBannersComponent implements OnInit {
  BannerAlertType = BannerAlertType;
  Margin = Margin;
  ButtonColor = ButtonColor;
  FontColor = FontColor;
  FontType = FontType;
  TextSize = TextSize;
  FontWeight = FontWeight;

  pending$: Rx.Observable<PaymentsResult>;
  cartItemsCollection: DatastoreCollection<CartItemsCollection>;
  cartItems$: Rx.Observable<ReadonlyArray<DepositModalItem>>;
  isHourlyInitialPayment$: Rx.Observable<boolean>;
  freelancerName$: Rx.Observable<string>;

  @Input() depositContext$: Rx.Observable<DepositContext>; // TODO: replace with banner only

  constructor(
    private activatedRoute: ActivatedRoute,
    private datastore: Datastore,
    private paymentsMessaging: PaymentsMessagingService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const results$ = this.paymentsMessaging.getResultStream();

    this.pending$ = results$.pipe(
      filter(result => result.paymentsStatus === PaymentsResultStatus.PENDING),
      tap(() => this.cdr.detectChanges()),
    );

    const cartId$ = this.activatedRoute.queryParams.pipe(
      map(params => toNumber(params.cartId)),
    );

    this.cartItemsCollection = this.datastore.collection<CartItemsCollection>(
      'cartItems',
      query =>
        cartId$.pipe(
          map(cartId =>
            cartId ? query.where('cartId', '==', cartId) : query.null(),
          ),
        ),
    );

    this.cartItems$ = this.cartItemsCollection.valueChanges().pipe(
      map(items =>
        items.map((item: CartItem) => ({
          description: item.description ? item.description : item.contextType,
          amount: item.amount,
          contextType: item.contextType,
          contextId: item.contextId,
        })),
      ),
      startWith([]),
    );

    this.isHourlyInitialPayment$ = this.cartItemsCollection.valueChanges().pipe(
      map(items =>
        items.some(
          (item: CartItem) =>
            item.contextType === ContextTypeApi.HOURLY_INITIAL_PAYMENT,
        ),
      ),
      startWith(false),
    );

    const awardDraftId$ = this.cartItemsCollection.valueChanges().pipe(
      map(items =>
        toNumber(
          items.filter(
            (item: CartItem) =>
              item.contextType === ContextTypeApi.HOURLY_INITIAL_PAYMENT,
          )[0].contextId,
        ),
      ),
      filter(isDefined),
    );

    const bidDraftAwardCollection = this.datastore.collection<
      BidAwardDraftsCollection
    >('bidAwardDrafts', query => query.where('id', '==', awardDraftId$));

    const bidId$ = bidDraftAwardCollection
      .valueChanges()
      .pipe(map(bidAwardDraft => bidAwardDraft[0].bidId));

    const hiredFreelancerCollection = this.datastore.document<BidsCollection>(
      'bids',
      bidId$,
    );

    const freelancerId$ = hiredFreelancerCollection
      .valueChanges()
      .pipe(map(bid => bid.bidderId));

    this.freelancerName$ = this.datastore
      .document<ProjectViewUsersCollection>('projectViewUsers', freelancerId$)
      .valueChanges()
      .pipe(map(user => user.displayName));
  }
}
