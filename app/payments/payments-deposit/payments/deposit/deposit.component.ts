import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DatastoreCollection, DatastoreDocument } from '@freelancer/datastore';
import {
  CurrenciesIncludingExternalCollection,
  Currency,
  ExchangeRate,
  ExchangeRatesCollection,
  NativeExchangeRatesCollection,
  UserBalance,
  UsersSelf,
  UsersSelfCollection,
} from '@freelancer/datastore/collections';
import {
  PaymentsEventType,
  PaymentsMessagingService,
} from '@freelancer/payments-messaging';
import { ApplicationType } from '@freelancer/payments-tracking';
import { DepositForm } from '@freelancer/payments-utils';
import { isDefined } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { DepositContext, DepositData } from '../../../common/types';
import { getExchangeRate, roundCurrency } from '../payments.helpers';
import { SourceData } from '../sources/sources.component';

@Component({
  selector: 'app-deposit',
  template: `
    <fl-grid>
      <fl-col [colDesktopSmall]="6">
        <app-sources
          [cartId]="(depositContext$ | async)?.cartId || undefined"
          [currenciesCollection]="currenciesCollection"
          [defaultDepositCurrency$]="defaultDepositCurrency$"
          [userSelectedDepositCurrency$]="userSelectedDepositCurrency$"
          [depositData$]="depositData$"
          [depositFormGroup]="depositFormGroup"
          [userInfo$]="userInfo$"
          [instantPaymentOnly$]="instantPaymentOnly$"
          [trackingToken]="
            (depositContext$ | async)?.trackingToken || undefined
          "
          [backUrl]="(depositContext$ | async)?.backUrl || undefined"
          [backUrlEncoded]="
            (depositContext$ | async)?.backUrlEncoded || undefined
          "
          (selectedSourceData)="handleSelectedSourceData($event)"
        ></app-sources>
      </fl-col>
      <fl-col [colDesktopSmall]="6">
        <app-confirmation
          [defaultDepositAmount$]="defaultDepositAmount$"
          [defaultDepositCurrency$]="defaultDepositCurrency$"
          [depositContext$]="depositContext$"
          [depositFormGroup]="depositFormGroup"
          [selectedSourceData$]="selectedSourceData$"
          [exchangeRates$]="exchangeRatesCollection.valueChanges()"
          [exchangeRatesNativeCharge$]="
            exchangeRatesNativeChargeCollection.valueChanges()
          "
          [userBalances$]="userBalances$"
          [chargeCurrency$]="chargeCurrency$"
          [chargeAmount$]="chargeAmount$"
          [checkBalance$]="checkBalance$"
          (userSelectedDepositCurrency)="
            handleUserSelectedDepositCurrency($event)
          "
          (depositData)="handleDepositData($event)"
        ></app-confirmation>
        <app-payments-secure-logo></app-payments-secure-logo>
      </fl-col>
    </fl-grid>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./deposit.component.scss'],
})
export class DepositComponent implements OnInit, OnDestroy {
  defaultDepositAmount$: Rx.Observable<number>;
  defaultDepositCurrency$: Rx.Observable<Currency>;
  depositFormGroup: FormGroup;
  instantPaymentOnly$: Rx.Observable<boolean>;
  userDefaultCurrency$: Rx.Observable<Currency>;
  userInfo$: Rx.Observable<UsersSelf>;

  private selectedSourceDataSubject$ = new Rx.ReplaySubject<SourceData>(1);
  selectedSourceData$ = this.selectedSourceDataSubject$.asObservable();

  private userSelectedDepositCurrencySubject$ = new Rx.ReplaySubject<Currency>(
    1,
  );
  userSelectedDepositCurrency$ = this.userSelectedDepositCurrencySubject$.asObservable();

  private depositDataSubject$ = new Rx.Subject<DepositData>();
  depositData$ = this.depositDataSubject$.asObservable();

  @Input() chargeAmount$: Rx.Observable<number | undefined>;
  @Input() chargeCurrency$: Rx.Observable<Currency | undefined>;
  @Input() checkBalance$: Rx.Observable<boolean>;
  @Input() currenciesCollection: DatastoreCollection<
    CurrenciesIncludingExternalCollection
  >;
  @Input() depositContext$: Rx.Observable<DepositContext>;
  @Input() exchangeRatesCollection: DatastoreCollection<
    ExchangeRatesCollection
  >;
  @Input() exchangeRatesNativeChargeCollection: DatastoreCollection<
    NativeExchangeRatesCollection
  >;
  @Input() userBalances$: Rx.Observable<ReadonlyArray<UserBalance>>;
  @Input() userSelfDoc: DatastoreDocument<UsersSelfCollection>;

  private subscriptions: ReadonlyArray<Rx.Subscription> = [];

  constructor(private paymentsMessaging: PaymentsMessagingService) {}

  ngOnInit() {
    this.instantPaymentOnly$ = this.depositContext$.pipe(
      map(context => context.applicationType === ApplicationType.DEPOSIT_MODAL),
    );

    this.depositFormGroup = new FormGroup({
      [DepositForm.CONFIRMATION]: new FormGroup({}),
      [DepositForm.METHODS]: new FormGroup({}),
      [DepositForm.RADIO]: new FormGroup({}),
    });

    this.userDefaultCurrency$ = this.userSelfDoc
      .valueChanges()
      .pipe(map(u => u.primaryCurrency));
    this.userInfo$ = this.userSelfDoc.valueChanges().pipe(filter(isDefined));

    this.defaultDepositCurrency$ = Rx.combineLatest([
      this.userDefaultCurrency$,
      this.chargeCurrency$,
    ]).pipe(
      map(
        ([userDefaultCurrency, chargeCurrency]) =>
          chargeCurrency || userDefaultCurrency,
      ),
    );

    this.defaultDepositAmount$ = Rx.combineLatest([
      this.userDefaultCurrency$,
      this.exchangeRatesCollection.valueChanges(),
      this.chargeAmount$,
    ]).pipe(
      map(([userDefaultCurrency, exchangeRates, chargeAmount]) => {
        if (chargeAmount && chargeAmount > 0) {
          return roundCurrency(chargeAmount);
        }
        if (userDefaultCurrency) {
          return this.getDefaultDepositAmount(
            userDefaultCurrency,
            exchangeRates,
          );
        }
        throw new Error('Default deposit amount not defined!');
      }),
    );

    const pageInitialized$ = this.selectedSourceData$.pipe(
      take(1),
      tap(() =>
        this.paymentsMessaging.pushEvent({
          eventType: PaymentsEventType.INITIALIZED,
        }),
      ),
    );

    this.subscriptions = [...this.subscriptions, pageInitialized$.subscribe()];
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * If deposit amount is not specified we force
   * the user to deposit at least 30 USD in userDefaultCurrency
   * @param currency
   * @param exchangeRates
   */
  getDefaultDepositAmount(
    defaultCurrency: Currency,
    exchangeRates: ReadonlyArray<ExchangeRate>,
  ): number {
    const defaultUSDAmount = 30;
    const exchangeRate = getExchangeRate(
      exchangeRates,
      'USD',
      defaultCurrency.code,
    );
    const rawValue = defaultUSDAmount * exchangeRate;
    const exchangeRateExponent = Math.round(Math.log10(exchangeRate));
    // restrictedExchangeRateExponent is between 1 - 3 only
    const restrictedExchangeRateExponent = Math.min(
      Math.max(1, exchangeRateExponent),
      3,
    );
    const roundFactor = 10 ** restrictedExchangeRateExponent;
    return roundCurrency(Math.round(rawValue / roundFactor) * roundFactor);
  }

  handleSelectedSourceData(data: SourceData) {
    this.selectedSourceDataSubject$.next(data);
  }

  handleUserSelectedDepositCurrency(currency: Currency) {
    this.userSelectedDepositCurrencySubject$.next(currency);
  }

  handleDepositData(data: DepositData) {
    this.depositDataSubject$.next(data);
  }
}
