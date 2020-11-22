import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '@freelancer/auth';
import {
  Datastore,
  DatastoreCollection,
  DatastoreDocument,
} from '@freelancer/datastore';
import {
  Cart,
  CartItem,
  CartItemsCollection,
  CartsCollection,
  CurrenciesIncludingExternalCollection,
  Currency,
  ExchangeRatesCollection,
  NativeExchangeRatesCollection,
  UserBalance,
  UserBalancesCollection,
  UsersSelfCollection,
} from '@freelancer/datastore/collections';
import {
  OverlayTypes,
  PaymentsErrorType,
  PaymentsEventType,
  PaymentsMessagingService,
  PaymentsResult,
  PaymentsResultStatus,
} from '@freelancer/payments-messaging';
import { PaymentsPopUpService } from '@freelancer/payments-popup';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { SpinnerBackgroundColor, SpinnerSize } from '@freelancer/ui/spinner';
import { isDefined, toNumber } from '@freelancer/utils';
import { CartStatusApi, ContextTypeApi } from 'api-typings/payments/payments';
import * as Rx from 'rxjs';
import {
  delay,
  filter,
  map,
  mapTo,
  startWith,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { DepositContext } from '../../common/types';
import { getUserBalancesInCurrency } from './payments.helpers';

@Component({
  selector: 'app-payments',
  template: `
    <fl-spinner
      class="DepositPageSpinner"
      flTrackingLabel="DepositPageInitialisationSpinner"
      *ngIf="!(initialized$ | async)"
      [overlay]="true"
      [size]="SpinnerSize.LARGE"
      [backgroundColor]="SpinnerBackgroundColor.DARK"
    ></fl-spinner>
    <app-payments-overlay
      (overlayOn)="handleOverlayOn($event)"
    ></app-payments-overlay>
    <fl-bit class="DepositPageContainer">
      <fl-bit [ngClass]="{ Hidden: hidePageContent$ | async }">
        <app-payments-banners
          [depositContext$]="depositContext$"
        ></app-payments-banners>
        <app-pay-by-balance
          *ngIf="showPayByBalanceComponent$ | async"
          [chargeAmount$]="chargeAmount$"
          [chargeCurrency$]="chargeCurrency$"
          [depositContext$]="depositContext$"
          [totalBalance$]="totalBalance$"
          [userBalances$]="userBalances$"
        ></app-pay-by-balance>

        <app-deposit
          *ngIf="!(showPayByBalanceComponent$ | async)"
          [chargeAmount$]="chargeAmount$"
          [chargeCurrency$]="chargeCurrency$"
          [checkBalance$]="checkBalance$"
          [currenciesCollection]="currenciesCollection"
          [exchangeRatesCollection]="exchangeRatesCollection"
          [exchangeRatesNativeChargeCollection]="exchangeRatesDepositCollection"
          [depositContext$]="depositContext$"
          [userSelfDoc]="userSelfDoc"
          [userBalances$]="userBalances$"
        ></app-deposit>
      </fl-bit>
    </fl-bit>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit, OnDestroy {
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  SpinnerBackgroundColor = SpinnerBackgroundColor;
  SpinnerSize = SpinnerSize;

  @Input() depositContext$: Rx.Observable<DepositContext>;
  @Output() depositResult = new EventEmitter<PaymentsResult>();
  @Output() showBalanceTitle = new EventEmitter<boolean>();

  cart$: Rx.Observable<Cart>;
  chargeCurrency$: Rx.Observable<Currency | undefined>;
  chargeAmount$: Rx.Observable<number | undefined>;
  checkBalance$: Rx.Observable<boolean>;
  currenciesCollection: DatastoreCollection<
    CurrenciesIncludingExternalCollection
  >;
  exchangeRatesCollection: DatastoreCollection<ExchangeRatesCollection>;
  exchangeRatesDepositCollection: DatastoreCollection<
    NativeExchangeRatesCollection
  >;
  initialized$: Rx.Observable<boolean>;
  hidePageContent$: Rx.Observable<boolean>;
  redirectTime$: Rx.Observable<number>;
  showPayByBalanceComponent$: Rx.Observable<boolean>;
  private subscriptions: ReadonlyArray<Rx.Subscription> = [];
  totalBalance$: Rx.Observable<number>;
  userBalances$: Rx.Observable<ReadonlyArray<UserBalance>>;
  userSelfDoc: DatastoreDocument<UsersSelfCollection>;
  cartItemsCollection: DatastoreCollection<CartItemsCollection>;
  isHourlyInitialPayment$: Rx.Observable<boolean>;

  private overlayOnSubject$ = new Rx.Subject<boolean>();
  overlayOn$ = this.overlayOnSubject$.asObservable();

  timeUntilRedirect = 5; // seconds

  constructor(
    private datastore: Datastore,
    private paymentsMessaging: PaymentsMessagingService,
    private cdr: ChangeDetectorRef,
    private popUpService: PaymentsPopUpService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private auth: Auth,
  ) {}

  ngOnInit() {
    const userBalancesCollection = this.datastore.collection<
      UserBalancesCollection
    >('userBalances');
    this.exchangeRatesCollection = this.datastore.collection<
      ExchangeRatesCollection
    >('exchangeRates');

    this.exchangeRatesDepositCollection = this.datastore.collection<
      NativeExchangeRatesCollection
    >('nativeExchangeRates');

    this.currenciesCollection = this.datastore.collection<
      CurrenciesIncludingExternalCollection
    >('currenciesIncludingExternal');

    const status$ = Rx.merge(
      userBalancesCollection.status$,
      this.exchangeRatesCollection.status$,
      this.exchangeRatesDepositCollection.status$,
      this.currenciesCollection.status$,
    );

    // we do this, because once the page is loaded
    // we don't want it to toggle between balances and deposit
    this.userBalances$ = userBalancesCollection.valueChanges().pipe(take(1));

    this.subscriptions = [
      ...this.subscriptions,
      status$.subscribe(status => {
        if (status.error) {
          this.paymentsMessaging.pushError({
            errorType: PaymentsErrorType.ERROR_DATASTORE,
            errorCode: status.error.errorCode,
            retry: status.error.retry,
          });
        }
      }),
    ];

    this.subscriptions = [
      ...this.subscriptions,
      this.paymentsMessaging.getErrorStream().subscribe(err => {
        if (err.errorType === PaymentsErrorType.ERROR_DATASTORE) {
          this.paymentsMessaging.pushOverlay({
            ctaAction: () => {
              this.paymentsMessaging.pushEvent({
                eventType: PaymentsEventType.CLOSE_OVERLAY,
              });
              err.retry();
            },
            overlayType: OverlayTypes.BACKEND_ERROR,
          });
        }
      }),
    ];

    this.chargeCurrency$ = Rx.combineLatest([
      this.currenciesCollection.valueChanges(),
      this.depositContext$,
    ]).pipe(
      map(([currencies, depositContext]) => {
        if (!depositContext || !depositContext.chargeCurrencyId) {
          return undefined;
        }
        const currency = currencies.find(
          c => c.id === depositContext.chargeCurrencyId,
        );
        return currency;
      }),
    );

    this.chargeAmount$ = this.depositContext$.pipe(
      map(depositContext => depositContext.chargeAmount),
    );

    this.checkBalance$ = this.depositContext$.pipe(
      map(depositContext => depositContext.checkBalance),
    );

    const cartId$ = this.activatedRoute.queryParams.pipe(
      map(params => toNumber(params.cartId)),
    );

    this.cart$ = this.datastore
      .document<CartsCollection>('carts', cartId$.pipe(filter(isDefined)))
      .valueChanges();

    this.cart$
      .pipe(take(1))
      .toPromise()
      .then(cart => {
        if (
          cart.status === CartStatusApi.CHARGED ||
          cart.status === CartStatusApi.DEPOSITED
        ) {
          this.router.navigate([`cart`], {
            queryParams: {
              cartId: cart.id,
            },
          });
        }
      });

    this.cartItemsCollection = this.datastore.collection<CartItemsCollection>(
      'cartItems',
      query =>
        cartId$.pipe(
          map(cartId =>
            cartId ? query.where('cartId', '==', cartId) : query.null(),
          ),
        ),
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

    this.totalBalance$ = Rx.combineLatest([
      this.userBalances$,
      this.exchangeRatesCollection.valueChanges(),
      this.chargeCurrency$,
    ]).pipe(
      map(([userBalances, exchangeRates, chargeCurrency]) => {
        if (!chargeCurrency) {
          return 0;
          // FIXME: this is only for balances component and should be fixed later,
          // briefly speaking balances component requires chargeCurrency to work
          // so this will also depend on some other parameter
        }
        return getUserBalancesInCurrency(
          userBalances,
          exchangeRates,
          chargeCurrency,
        );
      }),
    );

    this.showPayByBalanceComponent$ = Rx.combineLatest([
      this.totalBalance$,
      this.chargeAmount$,
      this.chargeCurrency$,
      this.checkBalance$,
      this.isHourlyInitialPayment$,
    ]).pipe(
      map(
        ([
          totalBalance,
          chargeAmount,
          chargeCurrency,
          checkBalance,
          isHourlyInitialPayment,
        ]) =>
          checkBalance &&
          chargeCurrency !== undefined &&
          chargeAmount !== undefined &&
          totalBalance !== undefined &&
          chargeAmount <= toNumber(totalBalance.toFixed(2)) &&
          !isHourlyInitialPayment,
      ),
    );

    this.subscriptions = [
      ...this.subscriptions,
      this.showPayByBalanceComponent$.subscribe(result =>
        result
          ? this.showBalanceTitle.emit(true)
          : this.showBalanceTitle.emit(false),
      ),
    ];

    const results$ = this.paymentsMessaging.getResultStream();
    const events$ = this.paymentsMessaging.getEventStream();

    const success$ = results$.pipe(
      filter(result => result.paymentsStatus === PaymentsResultStatus.SUCCESS),
      withLatestFrom(this.depositContext$, cartId$),
      tap(([_, depositContext, cartId]) => {
        if (cartId) {
          this.router.navigate(['/cart'], {
            queryParams: {
              cartId,
            },
            replaceUrl: true,
          });
        } else {
          this.paymentsMessaging.pushOverlay({
            ctaAction: () => depositContext.onSuccess(),
            overlayType: OverlayTypes.DEPOSIT_SUCCESS,
          });
        }
      }),
      delay(5_000),
      tap(([success, _]) => this.depositResult.emit(success)),
    );

    this.subscriptions = [...this.subscriptions, success$.subscribe()];

    const redirect$ = results$.pipe(
      filter(result => result.paymentsStatus === PaymentsResultStatus.REDIRECT),
      tap(result => this.depositResult.emit(result)),
    );
    this.subscriptions = [...this.subscriptions, redirect$.subscribe()];

    this.initialized$ = Rx.combineLatest([
      events$.pipe(
        filter(result => result.eventType === PaymentsEventType.INITIALIZED),
      ),
      this.showPayByBalanceComponent$,
    ]).pipe(mapTo(true), startWith(false), take(2));

    this.hidePageContent$ = Rx.merge(
      this.overlayOn$,
      this.initialized$.pipe(map(initialized => !initialized)),
    ).pipe(
      // oof, again for the initialized emission, we need to trigger `detectChanges` manually
      // and we need to do it after the first cycle, hence delay(0)
      // overlayOn comes from the event emitter, which triggers the emission automatically,
      // it will still be triggered from here, but Angular shouldn't run 2 change detection cycles
      delay(0),
      tap(m => this.cdr.detectChanges()),
      startWith(true),
    );

    this.userSelfDoc = this.datastore.document<UsersSelfCollection>(
      'usersSelf',
      this.auth.getUserId(),
    );
    this.subscriptions = [
      ...this.subscriptions,
      this.userSelfDoc.status$.subscribe(status => {
        if (status.error) {
          this.paymentsMessaging.pushError({
            errorType: PaymentsErrorType.ERROR,
            errorCode: status.error.errorCode,
          });
        }
      }),
    ];
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.popUpService.closePopUp();
  }

  handleOverlayOn(overlayOn: boolean) {
    this.overlayOnSubject$.next(overlayOn);
  }
}
