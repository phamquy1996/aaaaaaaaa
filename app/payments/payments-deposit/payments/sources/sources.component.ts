import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '@freelancer/auth';
import {
  Datastore,
  DatastoreCollection,
  OrderByDirection,
} from '@freelancer/datastore';
import {
  BillingAgreement,
  BillingAgreementsCollection,
  CartItem,
  CartItemsCollection,
  CurrenciesIncludingExternalCollection,
  Currency,
  DepositFee,
  UserDepositMethod,
  UserDepositMethodsCollection,
  UsersSelf,
} from '@freelancer/datastore/collections';
import { Deposits } from '@freelancer/deposits';
import {
  PaymentsErrorType,
  PaymentsMessagingService,
} from '@freelancer/payments-messaging';
import { PaymentsTrackingService } from '@freelancer/payments-tracking';
import {
  DepositForm,
  methodSelectionRadioControl,
  PaymentsUtils,
} from '@freelancer/payments-utils';
import { ThreatmetrixService } from '@freelancer/threatmetrix';
import { CardBorderRadius } from '@freelancer/ui/card';
import { HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { ListItemPadding, ListItemType } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import { PictureImage } from '@freelancer/ui/picture';
import { SelectSize } from '@freelancer/ui/select';
import { TextSize } from '@freelancer/ui/text';
import {
  fromPairs,
  isDefined,
  isFormControl,
  toNumber,
} from '@freelancer/utils';
import {
  ContextTypeApi,
  DepositMethodApi,
} from 'api-typings/payments/payments';
import * as Rx from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  first,
  map,
  publishReplay,
  refCount,
  scan,
  startWith,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { SourceDisplayMode } from '../../../common/source-template/source-template.component';
import { DepositData } from '../../../common/types';
import { BillingAgreementsComponent } from '../billing-agreements/billing-agreements.component';
import { MethodsComponent } from '../methods/methods.component';
import { MethodPaymentCurrency } from '../payments.helpers';

export interface MethodCurrencies {
  [methodId: string]: Currency;
}

export interface CurrencyMap {
  [code: string]: Currency;
}

export interface MethodCurrencyMaps {
  [depositMethodId: string]: CurrencyMap;
}

export interface DepositMethodMap {
  [id: string]: Rx.Observable<UserDepositMethod>;
}

export interface DepositDataMap {
  [id: string]: Rx.Observable<DepositData>;
}

export interface SourceData {
  depositFees: ReadonlyArray<DepositFee>;
  depositCurrency: Currency;
  paymentCurrency: Currency;
  depositCurrencyMap: CurrencyMap;
  nativeCharge: boolean;
  depositMethodId?: DepositMethodApi;
  isBillingAgreement?: boolean;
}

export interface BillingAgreementOrMethodListItem {
  value: string;
  displayText: string;
  logo: PictureImage;
  isBillingAgreement: boolean;
}

@Component({
  selector: 'app-sources',
  template: `
    <ng-container *ngIf="group$ | async as group">
      <!-- Template for mobile view -->
      <!-- <fl-bit [flHideDesktop]="true" > make bank deposit behaves weirdly? -->
      <fl-bit *ngIf="isMobileDeposit$ | async">
        <!-- Mobile user without billing agreements -->
        <ng-container *ngIf="(billingAgreements$ | async)?.length === 0">
          <fl-bit
            *ngIf="group.get(methodSelectionRadioControl) as control"
            [flMarginBottom]="Margin.XXSMALL"
          >
            <fl-select
              *ngIf="isFormControl(control)"
              class="MethodAndBillingAgreementInput"
              flTrackingLabel="depositMobileViewItemDropdown"
              [control]="control"
              [options]="methodListItem$ | async"
              [size]="SelectSize.XLARGE"
              [imageStart]="
                (selectedBillingAgreementOrMethodListItem$ | async)?.logo
              "
            ></fl-select>
          </fl-bit>
          <fl-card
            class="MethodsCard"
            [flMarginBottom]="Margin.XXSMALL"
            [edgeToEdge]="true"
            [borderRadius]="CardBorderRadius.LARGE"
          >
            <app-methods
              #methodsComponent
              [depositMethodsCollection]="depositMethodsCollection"
              [depositMethodMap]="depositMethodMap$ | async"
              [currencies$]="currenciesCollection.valueChanges()"
              [isSmallScreen]="true"
              [userId]="userIdAsInt$ | async"
              [depositDataMap]="depositDataMap$ | async"
              [group]="group"
              [instantPaymentOnly$]="instantPaymentOnly$"
              [threatMetrixSession]="threatMetrixSession"
              [trackingToken]="trackingToken"
              [userInfo$]="userInfo$"
              [backUrl]="backUrl"
              [backUrlEncoded]="backUrlEncoded"
              [depositFormGroup]="depositFormGroup"
              [cartId]="cartId"
              [sourceDisplayMode]="SourceDisplayMode.LIST_TIME_BODY_ONLY"
              [isHourlyInitialPayment$]="isHourlyInitialPayment$"
            ></app-methods>
          </fl-card>
        </ng-container>

        <!-- Mobile user with billing agreements -->
        <ng-container *ngIf="(billingAgreements$ | async)?.length > 0">
          <fl-card
            class="MethodsCard"
            [edgeToEdge]="true"
            [borderRadius]="CardBorderRadius.LARGE"
            [flMarginBottom]="Margin.SMALL"
          >
            <app-billing-agreements
              #billingAgreementsComponent
              [cartId]="cartId"
              [group]="group"
              [billingAgreements$]="billingAgreements$"
              [depositDataMap]="depositDataMap$ | async"
              [currencies$]="currenciesCollection.valueChanges()"
              [trackingToken]="trackingToken"
            ></app-billing-agreements>
            <fl-list-item
              [selectable]="true"
              [padding]="ListItemPadding.MID"
              [type]="ListItemType.RADIO"
              [selectable]="true"
              [expandable]="true"
              [control]="otherPaymentOptionControl"
              [radioValue]="otherPaymentOptionValue"
              flTrackingLabel="depositMobileViewItemDropdown"
            >
              <fl-list-item-header>
                <fl-bit>
                  <fl-text
                    i18n="Payment methods list - other payment options"
                    [size]="TextSize.SMALL"
                  >
                    Other Payment Options
                  </fl-text>
                </fl-bit>
              </fl-list-item-header>
              <fl-list-item-body>
                <fl-bit
                  *ngIf="group.get(methodSelectionRadioControl) as control"
                  [flMarginBottom]="Margin.XXSMALL"
                >
                  <fl-select
                    *ngIf="isFormControl(control)"
                    class="MethodAndBillingAgreementInput"
                    flTrackingLabel="depositMobileViewItemDropdown"
                    [control]="control"
                    [options]="methodListItem$ | async"
                    [size]="SelectSize.XLARGE"
                    [imageStart]="
                      (selectedBillingAgreementOrMethodListItem$ | async)?.logo
                    "
                  ></fl-select>
                </fl-bit>
                <app-methods
                  #methodsComponent
                  [depositMethodsCollection]="depositMethodsCollection"
                  [depositMethodMap]="depositMethodMap$ | async"
                  [currencies$]="currenciesCollection.valueChanges()"
                  [isSmallScreen]="true"
                  [userId]="userIdAsInt$ | async"
                  [depositDataMap]="depositDataMap$ | async"
                  [group]="group"
                  [instantPaymentOnly$]="instantPaymentOnly$"
                  [threatMetrixSession]="threatMetrixSession"
                  [trackingToken]="trackingToken"
                  [userInfo$]="userInfo$"
                  [backUrl]="backUrl"
                  [backUrlEncoded]="backUrlEncoded"
                  [depositFormGroup]="depositFormGroup"
                  [cartId]="cartId"
                  [sourceDisplayMode]="SourceDisplayMode.INLINE_BODY"
                  [isHourlyInitialPayment$]="isHourlyInitialPayment$"
                ></app-methods>
              </fl-list-item-body>
            </fl-list-item>
          </fl-card>
        </ng-container>
      </fl-bit>
      <!-- End of template for mobile view -->

      <!-- <fl-bit [flHideMobile]="true" [flHideTablet]="true"> make bank deposit behaves weirdly? -->
      <fl-bit *ngIf="!(isMobileDeposit$ | async)">
        <fl-card
          class="MethodsCard"
          [edgeToEdge]="true"
          [borderRadius]="CardBorderRadius.LARGE"
          [flMarginBottom]="(billingAgreements$ | async)?.length && Margin.MID"
        >
          <app-billing-agreements
            #billingAgreementsComponent
            [cartId]="cartId"
            [group]="group"
            [billingAgreements$]="billingAgreements$"
            [depositDataMap]="depositDataMap$ | async"
            [currencies$]="currenciesCollection.valueChanges()"
            [trackingToken]="trackingToken"
          ></app-billing-agreements>
        </fl-card>
        <fl-heading
          *ngIf="(billingAgreements$ | async)?.length > 0"
          i18n="
             Payment methods - section label for other methods than billing
            agreements
          "
          [headingType]="HeadingType.H2"
          [size]="TextSize.MID"
          [flMarginBottom]="Margin.XXSMALL"
        >
          More payment methods
        </fl-heading>
        <fl-card
          class="MethodsCard"
          [flMarginBottom]="Margin.XXSMALL"
          [edgeToEdge]="true"
          [borderRadius]="CardBorderRadius.LARGE"
        >
          <app-methods
            #methodsComponent
            [depositMethodsCollection]="depositMethodsCollection"
            [depositMethodMap]="depositMethodMap$ | async"
            [currencies$]="currenciesCollection.valueChanges()"
            [isSmallScreen]="false"
            [userId]="userIdAsInt$ | async"
            [depositDataMap]="depositDataMap$ | async"
            [group]="group"
            [instantPaymentOnly$]="instantPaymentOnly$"
            [threatMetrixSession]="threatMetrixSession"
            [trackingToken]="trackingToken"
            [userInfo$]="userInfo$"
            [backUrl]="backUrl"
            [backUrlEncoded]="backUrlEncoded"
            [depositFormGroup]="depositFormGroup"
            [cartId]="cartId"
            [sourceDisplayMode]="SourceDisplayMode.LIST_ITEM_WITH_HEADER"
            [isHourlyInitialPayment$]="isHourlyInitialPayment$"
          ></app-methods>
        </fl-card>
      </fl-bit>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./sources.component.scss'],
})
export class SourcesComponent implements OnDestroy, OnInit {
  Margin = Margin;
  TextSize = TextSize;
  HeadingType = HeadingType;
  SelectSize = SelectSize;
  IconColor = IconColor;
  IconSize = IconSize;
  isFormControl = isFormControl;
  ListItemPadding = ListItemPadding;
  ListItemType = ListItemType;
  CardBorderRadius = CardBorderRadius;
  SourceDisplayMode = SourceDisplayMode;

  methodSelectionRadioControl = methodSelectionRadioControl;
  threatMetrixSession: string;
  private subscriptions: ReadonlyArray<Rx.Subscription> = [];

  depositMethodsCollection: DatastoreCollection<UserDepositMethodsCollection>;
  billingAgreements$: Rx.Observable<ReadonlyArray<BillingAgreement>>;
  depositMethodData: {
    methodPaymentCurrencyMaps$: Rx.Observable<MethodCurrencyMaps>;
    methodDepositCurrencyMaps$: Rx.Observable<MethodCurrencyMaps>;
    methodDepositCurrencies$: Rx.Observable<CurrencyMap>;
  };

  billingAgreementData: {
    billingAgreementPaymentCurrencyMaps$: Rx.Observable<MethodCurrencyMaps>;
    billingAgreementDepositCurrencyMaps$: Rx.Observable<MethodCurrencyMaps>;
    billingAgreementDepositCurrencies$: Rx.Observable<{
      [billingAgreementId: string]: Currency;
    }>;
  };

  depositDataMap$: Rx.Observable<{
    [billingAgreementId: string]: Rx.Observable<DepositData>;
  }>;

  selectedBillingAgreementOrMethodListItem$: Rx.Observable<
    BillingAgreementOrMethodListItem
  >;
  billingAgreementOrMethodListItem$: Rx.Observable<
    ReadonlyArray<BillingAgreementOrMethodListItem>
  >;
  methodListItem$: Rx.Observable<
    ReadonlyArray<BillingAgreementOrMethodListItem>
  >;
  group$: Rx.Observable<FormGroup>;
  radioValue$: Rx.Observable<string>;
  userIdAsInt$: Rx.Observable<number>;
  isMobileDeposit$: Rx.Observable<boolean>;
  depositMethodMap$: Rx.Observable<DepositMethodMap>;
  cartItemsCollection: DatastoreCollection<CartItemsCollection>;
  isHourlyInitialPayment$: Rx.Observable<boolean>;
  otherPaymentOptionControl: FormControl = new FormControl();
  otherPaymentOptionValue = 'selected';

  @Input() backUrl?: string;
  @Input() backUrlEncoded?: string;
  @Input() currenciesCollection: DatastoreCollection<
    CurrenciesIncludingExternalCollection
  >;
  @Input() cartId?: number;
  @Input() defaultDepositCurrency$: Rx.Observable<Currency>;
  @Input() depositData$: Rx.Observable<DepositData>;
  @Input() depositFormGroup: FormGroup;
  @Input() trackingToken?: string;
  @Input() userInfo$: Rx.Observable<UsersSelf>;
  @Input() userSelectedDepositCurrency$: Rx.Observable<Currency>;
  @Input() instantPaymentOnly$: Rx.Observable<boolean>;

  @Output() selectedSourceData = new EventEmitter<SourceData>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private auth: Auth,
    private datastore: Datastore,
    private deposits: Deposits,
    private fb: FormBuilder,
    private threatMetrixService: ThreatmetrixService,
    private paymentsTracking: PaymentsTrackingService,
    private paymentsMessaging: PaymentsMessagingService,
    private paymentsUtils: PaymentsUtils,
  ) {}

  // As this element is within an ngIf we can not guarantee it will
  // be on the DOM when ngAfterViewInit runs.
  // We can use ViewChild and a set function to wait for it.
  @ViewChild('billingAgreementsComponent')
  set setBillingAgreementsComponent(
    billingAgreementsComponent: BillingAgreementsComponent,
  ) {
    if (!billingAgreementsComponent) {
      return;
    }

    const {
      billingAgreementDepositCurrencyMaps$,
      billingAgreementDepositCurrencies$,
    } = this.billingAgreementData;

    const billingAgreementSelectedPaymentCurrencies$ = this.getSelectedPaymentCurrencies(
      billingAgreementsComponent.agreementPaymentCurrencySelected.asObservable(),
    );

    const billingAgreementPaymentCurrencies$ = this.getBillingAgreementPaymentCurrencies(
      this.billingAgreements$,
      this.currenciesCollection.valueChanges(),
      this.depositMethodsCollection.valueChanges(),
      billingAgreementSelectedPaymentCurrencies$,
    );

    this.wireUpSourceDataOutputForBillingAgreements(
      this.billingAgreements$,
      // We pass depositMethods in order to determine fees
      this.depositMethodsCollection.valueChanges(),
      billingAgreementDepositCurrencies$,
      billingAgreementPaymentCurrencies$,
      billingAgreementDepositCurrencyMaps$,
    );
  }

  // As this element is within an ngIf we can not guarantee it will
  // be on the DOM when ngAfterViewInit runs.
  // We can use ViewChild and a set function to wait for it.
  @ViewChild('methodsComponent')
  set setMethodsComponent(methodsComponent: MethodsComponent) {
    if (!methodsComponent) {
      return;
    }

    const {
      methodDepositCurrencyMaps$,
      methodDepositCurrencies$,
    } = this.depositMethodData;

    const methodSelectedPaymentCurrencies$ = this.getSelectedPaymentCurrencies(
      methodsComponent.methodPaymentCurrencySelected.asObservable(),
    ).pipe(publishReplay(1), refCount());

    const methodPaymentCurrencies$ = Rx.combineLatest([
      methodDepositCurrencies$,
      methodSelectedPaymentCurrencies$.pipe(startWith({})),
    ]).pipe(
      map(([methodDepositCurrencies, methodPaymentCurrenciesSelected]) => ({
        ...methodDepositCurrencies,
        ...methodPaymentCurrenciesSelected,
      })),
    );

    // The moment we've all been waiting for - at last we can define
    // our selectedSourceData output stream
    this.wireUpSourceDataOutputForDepositMethods(
      this.depositMethodsCollection.valueChanges(),
      methodDepositCurrencies$,
      methodPaymentCurrencies$,
      methodDepositCurrencyMaps$,
    );
  }

  ngOnInit() {
    this.threatMetrixSession = this.threatMetrixService.getSession();
    this.userIdAsInt$ = this.auth
      .getUserId()
      .pipe(map(userId => toNumber(userId)));

    this.isMobileDeposit$ = this.paymentsUtils.isMobileDeposit();

    this.depositMethodsCollection = this.datastore.collection<
      UserDepositMethodsCollection
    >('userDepositMethods', query =>
      query.where('userId', '==', this.userIdAsInt$),
    );

    this.depositMethodMap$ = this.depositMethodsCollection
      .valueChanges()
      .pipe(
        map(methods =>
          fromPairs(
            methods.map(method => [
              method.id,
              this.getDepositMethodStream(method.id),
            ]),
          ),
        ),
      );

    const cartId$ = this.activatedRoute.queryParams.pipe(
      map(params => toNumber(params.cartId)),
      filter(isDefined),
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

    this.isHourlyInitialPayment$ = this.cartItemsCollection.valueChanges().pipe(
      map(items =>
        items.some(
          (item: CartItem) =>
            item.contextType === ContextTypeApi.HOURLY_INITIAL_PAYMENT,
        ),
      ),
      startWith(false),
    );

    const billingAgreementsCollection = this.datastore.collection<
      BillingAgreementsCollection
    >('billingAgreements', query =>
      query.orderBy('lastSuccessTimestamp', OrderByDirection.DESC),
    );

    // While the billing agreements backend returns any available Skrill and PayTM
    // billing agreements, we have to filter them out on the page as they
    // are not functional for deposits at this moment.
    // Remove paypal for hourly initial payment
    this.billingAgreements$ = Rx.combineLatest([
      billingAgreementsCollection.valueChanges(),
      this.isHourlyInitialPayment$,
    ]).pipe(
      map(([billingAgreements, isHourlyInitialPayment]) =>
        billingAgreements.filter(b =>
          b.depositMethod !== DepositMethodApi.SKRILL &&
          b.depositMethod !== DepositMethodApi.PAYTM_SUBSCRIPTION &&
          isHourlyInitialPayment
            ? b.depositMethod !== DepositMethodApi.PAYPAL_REFERENCE
            : true,
        ),
      ),
    );

    const status$ = Rx.merge(
      this.depositMethodsCollection.status$,
      billingAgreementsCollection.status$,
    );

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

    // In the tickets/docs associated with this project you will see a number of acronyms.
    // They correspond to the following streams:
    //  MDC - methodDepositCurrencies$ & billingAgreementDepositCurrencies$
    //  MPC - methodPaymentCurrencies$ & billingAgreementPaymentCurrencies$
    //  MDCL - methodDepositCurrencyMaps$ & billingAgreementDepositCurrencyMaps
    //  MPCL - methodPaymentCurrencyMaps$ & billingAgreementPaymentCurrencyMaps
    this.depositMethodData = this.getDepositMethodData(
      this.depositMethodsCollection.valueChanges(),
      this.currenciesCollection.valueChanges(),
      this.userSelectedDepositCurrency$,
      this.defaultDepositCurrency$,
    );

    const {
      methodPaymentCurrencyMaps$,
      methodDepositCurrencyMaps$,
    } = this.depositMethodData;

    this.billingAgreementData = this.getBillingAgreementData(
      this.billingAgreements$,
      this.currenciesCollection.valueChanges(),
      this.defaultDepositCurrency$,
      this.depositMethodsCollection.valueChanges(),
      methodDepositCurrencyMaps$,
      methodPaymentCurrencyMaps$,
      this.userSelectedDepositCurrency$,
    );

    this.group$ = Rx.combineLatest([
      this.depositMethodsCollection.valueChanges(),
      this.billingAgreements$,
      methodDepositCurrencyMaps$,
      this.defaultDepositCurrency$,
    ]).pipe(
      map(
        ([
          depositMethods,
          billingAgreements,
          methodDepositCurrencyMaps,
          defaultDepositCurrency,
        ]): UserDepositMethod | BillingAgreement | undefined =>
          billingAgreements.find(
            ba => ba.currencyId === defaultDepositCurrency.id,
          ) ||
          billingAgreements[0] ||
          depositMethods.find(m => {
            const depositCurrencyMap = methodDepositCurrencyMaps[m.id];
            return (
              depositCurrencyMap &&
              Object.values(depositCurrencyMap)
                .map(c => c.id)
                .includes(defaultDepositCurrency.id)
            );
          }) ||
          depositMethods[0],
      ),
      map(methodOrAgreement =>
        this.fb.group({
          [methodSelectionRadioControl]: methodOrAgreement
            ? methodOrAgreement.id
            : undefined,
        }),
      ),
      first(),
      publishReplay(1),
      refCount(),
    );

    this.subscriptions = [
      ...this.subscriptions,
      this.group$.subscribe(formGroup =>
        this.depositFormGroup.setControl(DepositForm.RADIO, formGroup),
      ),
    ];

    // An observable on the currently selected value from the from group
    this.radioValue$ = this.group$.pipe(
      switchMap(group => group.valueChanges.pipe(startWith(group.value))),
      map(groupValues => groupValues[methodSelectionRadioControl]),
      filter(isDefined),
    );

    this.subscriptions = [
      ...this.subscriptions,
      this.radioValue$
        .pipe(withLatestFrom(this.billingAgreements$))
        .subscribe(([radio, billingAgreements]) => {
          // If otherPaymentOptionControl is active and 'radio' is an item in
          // billingAgreements$' then, deactivate 'otherPaymentOptionControl'.
          // Applies to mobile view only.
          if (
            this.otherPaymentOptionControl.value ===
              this.otherPaymentOptionValue &&
            billingAgreements.some(ba => ba.id === radio)
          ) {
            this.otherPaymentOptionControl.setValue('');
          }

          const methodsFormGroup = this.depositFormGroup.controls[
            DepositForm.METHODS
          ] as FormGroup;
          Object.values(methodsFormGroup.controls).forEach(control => {
            control.disable();
          });
          if (methodsFormGroup.controls[radio]) {
            methodsFormGroup.controls[radio].enable();
          }
          this.paymentsTracking.pushTrackingData({
            label: 'depositSourceListItem',
            value: radio,
          });
        }),
    ];

    // Generating the depositMethodMap, in the form of
    // {
    //   id_of_deposit_method_or_billing_agreement :
    //   an_observable_of_DepositData (emits only when DepositData$ emits to the selected method/ba)
    // }
    this.depositDataMap$ = Rx.combineLatest([
      this.depositMethodsCollection.valueChanges(),
      this.billingAgreements$,
    ]).pipe(
      map(([methods, billagreements]) =>
        methods
          .map(method => method.id)
          .concat(billagreements.map(ba => ba.id)),
      ),
      map(ids =>
        fromPairs(
          ids.map(id => [
            id,
            this.depositData$.pipe(
              withLatestFrom(this.radioValue$),
              filter(([_, radio]) => radio === id),
              map(([depositData]) => depositData),
            ),
          ]),
        ),
      ),
    );

    this.billingAgreementOrMethodListItem$ = Rx.combineLatest([
      this.depositMethodsCollection.valueChanges().pipe(
        withLatestFrom(this.instantPaymentOnly$),
        map(([methods, instantPaymentOnly]) =>
          methods.filter(
            method => !instantPaymentOnly || method.instantPayment,
          ),
        ),
      ),
      this.billingAgreements$,
      this.currenciesCollection.valueChanges(),
    ]).pipe(
      map(([methods, billagreements, currencies]) =>
        billagreements
          .map(ba => {
            const accountName =
              ba.creditCard && ba.creditCard.creditCardNumber
                ? ba.creditCard.creditCardNumber
                : (ba.paypal && ba.paypal.paypalEmail
                    ? ba.paypal.paypalEmail
                    : '') || '';
            const logoName =
              ba.creditCard && ba.creditCard.cardType
                ? ba.creditCard.cardType
                : ba.paypal
                ? DepositMethodApi.PAYPAL
                : '';
            const currency = currencies.find(c => c.id === ba.currencyId);
            const code = currency ? currency.code : '';
            return {
              value: ba.id,
              displayText: `${accountName} (${code})`,
              logo: {
                src: this.paymentsUtils.getMethodLogoPath(ba.depositMethod),
                alt: `${logoName} logo`,
              },
              isBillingAgreement: true,
            };
          })
          .concat(
            methods.map(method => {
              const logoName = method.id;
              return {
                value: method.id,
                displayText: method.name,
                logo: {
                  src: this.paymentsUtils.getMethodLogoPath(logoName),
                  alt: `${logoName} logo`,
                },
                isBillingAgreement: false,
              };
            }),
          ),
      ),
    );

    // In mobile view, only show deposit methods in the dropdown list as
    // agreements are rendered separately outside of this list now.
    // Hourly initial payment only support cc deposit
    this.methodListItem$ = Rx.combineLatest([
      this.billingAgreementOrMethodListItem$,
      this.isHourlyInitialPayment$,
    ]).pipe(
      map(([itemList, isHourlyInitialPayment]) =>
        itemList.filter(item => {
          if (isHourlyInitialPayment) {
            return (
              !item.isBillingAgreement &&
              [DepositMethodApi.FLN_BILLING].includes(
                item.value as DepositMethodApi,
              )
            );
          }
          // This block will be remove after we fix all the methods in T211472
          if (this.deposits.isNative()) {
            return (
              !item.isBillingAgreement &&
              [
                DepositMethodApi.FLN_BILLING,
                DepositMethodApi.PAYPAL,
                DepositMethodApi.PAYPAL_REFERENCE,
                DepositMethodApi.WIRE,
              ].includes(item.value as DepositMethodApi)
            );
          }
          return !item.isBillingAgreement;
        }),
      ),
    );

    this.selectedBillingAgreementOrMethodListItem$ = this.radioValue$.pipe(
      withLatestFrom(this.billingAgreementOrMethodListItem$),
      map(([radioValue, billingAgreementAndMethodListItems]) =>
        billingAgreementAndMethodListItems.find(
          billingAgreementAndMethodListItem =>
            billingAgreementAndMethodListItem.value === radioValue,
        ),
      ),
      filter(isDefined),
    );

    this.subscriptions = [
      ...this.subscriptions,
      this.otherPaymentOptionControl.valueChanges
        .pipe(
          distinctUntilChanged(),
          withLatestFrom(this.depositMethodsCollection.valueChanges()),
        )
        .subscribe(([controlValue, depositMethods]) => {
          if (controlValue === this.otherPaymentOptionValue) {
            const fc = (this.depositFormGroup.get(
              DepositForm.RADIO,
            ) as FormGroup)?.get(methodSelectionRadioControl);
            if (fc) {
              // Use first item from the depositMethodsCollection
              fc.setValue(depositMethods[0].id);
            }
          }
        }),
    ];
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  getDepositMethodStream(depositMethodId: string) {
    return this.depositMethodsCollection.valueChanges().pipe(
      map(methods => methods.filter(method => method.id === depositMethodId)),
      map(([method]) => method),
    );
  }

  getDepositMethodData(
    depositMethods$: Rx.Observable<ReadonlyArray<UserDepositMethod>>,
    currencies$: Rx.Observable<ReadonlyArray<Currency>>,
    userSelectedDepositCurrency$: Rx.Observable<Currency>,
    defaultDepositCurrency$: Rx.Observable<Currency>,
  ) {
    const methodPaymentCurrencyMaps$ = this.getMethodPaymentCurrencyMaps(
      depositMethods$,
      currencies$,
    );

    const methodDepositCurrencyMaps$ = this.getMethodDepositCurrencyMaps(
      depositMethods$,
      currencies$,
      methodPaymentCurrencyMaps$,
    );

    const methodDepositCurrencies$ = this.getMethodDepositCurrencies(
      depositMethods$,
      userSelectedDepositCurrency$,
      defaultDepositCurrency$,
      methodDepositCurrencyMaps$,
    );

    return {
      methodPaymentCurrencyMaps$,
      methodDepositCurrencyMaps$,
      methodDepositCurrencies$,
    };
  }

  getBillingAgreementData(
    billingAgreements$: Rx.Observable<ReadonlyArray<BillingAgreement>>,
    currencies$: Rx.Observable<ReadonlyArray<Currency>>,
    defaultDepositCurrency$: Rx.Observable<Currency>,
    depositMethods$: Rx.Observable<ReadonlyArray<UserDepositMethod>>,
    methodDepositCurrencyMaps$: Rx.Observable<MethodCurrencyMaps>,
    methodPaymentCurrencyMaps$: Rx.Observable<MethodCurrencyMaps>,
    userSelectedDepositCurrency$: Rx.Observable<Currency>,
  ) {
    const billingAgreementPaymentCurrencyMaps$ = this.indexByBillingAgreementId(
      billingAgreements$,
      methodPaymentCurrencyMaps$,
    );

    const billingAgreementDepositCurrencyMaps$ = this.indexByBillingAgreementId(
      billingAgreements$,
      methodDepositCurrencyMaps$,
    );

    const billingAgreementDepositCurrencies$ = this.getBillingAgreementDepositCurrencies(
      billingAgreementDepositCurrencyMaps$,
      billingAgreements$,
      currencies$,
      defaultDepositCurrency$,
      depositMethods$,
      userSelectedDepositCurrency$,
    );

    return {
      billingAgreementPaymentCurrencyMaps$,
      billingAgreementDepositCurrencyMaps$,
      billingAgreementDepositCurrencies$,
    };
  }

  // Get MPCL for all methods
  getMethodPaymentCurrencyMaps(
    depositMethods$: Rx.Observable<ReadonlyArray<UserDepositMethod>>,
    currencies$: Rx.Observable<ReadonlyArray<Currency>>,
  ): Rx.Observable<MethodCurrencyMaps> {
    return Rx.combineLatest([depositMethods$, currencies$]).pipe(
      map(([depositMethods, currencies]) =>
        fromPairs(
          depositMethods.map(m => [
            m.id,
            this.reduceMethodToCurrencyMap(m, currencies),
          ]),
        ),
      ),
    );
  }

  // Get MDCL for all methods
  getMethodDepositCurrencyMaps(
    depositMethods$: Rx.Observable<ReadonlyArray<UserDepositMethod>>,
    currencies$: Rx.Observable<ReadonlyArray<Currency>>,
    paymentCurrencyMaps$: Rx.Observable<MethodCurrencyMaps>,
  ): Rx.Observable<MethodCurrencyMaps> {
    return Rx.combineLatest([
      depositMethods$,
      currencies$.pipe(
        map(currencies =>
          // Only internal currencies can be used for deposit currency
          currencies.filter(currency => !currency.isExternal),
        ),
      ),
      paymentCurrencyMaps$,
    ]).pipe(
      map(([depositMethods, currencies, paymentCurrencyMaps]) =>
        // TODO - revisit this, can it be cleaner?
        fromPairs(
          depositMethods.map(m => [
            m.id,
            this.reduceCurrencyListToCurrencyMap(
              m.nativeCharge
                ? currencies
                : this.intersection(
                    Object.keys(paymentCurrencyMaps[m.id]),
                    currencies.map(c => c.code),
                  )
                    .map(code => currencies.find(c => c.code === code))
                    .filter(isDefined),
            ),
          ]),
        ),
      ),
    );
  }

  // Get MDC for all methods
  getMethodDepositCurrencies(
    depositMethods$: Rx.Observable<ReadonlyArray<UserDepositMethod>>,
    userSelectedDepositCurrency$: Rx.Observable<Currency>,
    defaultDepositCurrency$: Rx.Observable<Currency>,
    depositCurrencyMaps$: Rx.Observable<MethodCurrencyMaps>,
  ): Rx.Observable<CurrencyMap> {
    return Rx.combineLatest([
      depositMethods$,
      depositCurrencyMaps$,
      userSelectedDepositCurrency$.pipe(
        startWith<Currency | undefined>(undefined),
      ),
      defaultDepositCurrency$,
    ]).pipe(
      map(
        ([
          depositMethods,
          depositCurrencyMaps,
          userSelectedDepositCurrency,
          defaultDepositCurrency,
        ]) =>
          fromPairs(
            depositMethods.map(m => {
              const methodDefaultCurrency = m.defaultCurrency;
              const methodDepositCurrencyMap = depositCurrencyMaps[m.id];
              return [
                m.id,
                this.getMethodDepositCurrency(
                  methodDefaultCurrency,
                  userSelectedDepositCurrency,
                  methodDepositCurrencyMap,
                  defaultDepositCurrency,
                ),
              ];
            }),
          ),
      ),
    );
  }

  // Get MDC for a single method
  getMethodDepositCurrency(
    methodDefaultCurrency: Currency,
    userSelectedDepositCurrency: Currency | undefined,
    methodDepositCurrencyMap: CurrencyMap,
    defaultDepositCurrency: Currency,
  ) {
    if (
      userSelectedDepositCurrency &&
      methodDepositCurrencyMap &&
      methodDepositCurrencyMap[userSelectedDepositCurrency.code]
    ) {
      return userSelectedDepositCurrency;
    }

    if (
      methodDepositCurrencyMap &&
      methodDepositCurrencyMap[defaultDepositCurrency.code]
    ) {
      return defaultDepositCurrency;
    }

    return methodDefaultCurrency;
  }

  getBillingAgreementDepositCurrencies(
    billingAgreementDepositCurrencyMaps$: Rx.Observable<MethodCurrencyMaps>,
    billingAgreements$: Rx.Observable<ReadonlyArray<BillingAgreement>>,
    currencies$: Rx.Observable<ReadonlyArray<Currency>>,
    defaultDepositCurrency$: Rx.Observable<Currency>,
    depositMethods$: Rx.Observable<ReadonlyArray<UserDepositMethod>>,
    userSelectedDepositCurrency$: Rx.Observable<Currency>,
  ): Rx.Observable<{ [billingAgreementId: string]: Currency }> {
    return Rx.combineLatest([
      billingAgreements$,
      depositMethods$,
      userSelectedDepositCurrency$.pipe(
        startWith<Currency | undefined>(undefined),
      ),
      defaultDepositCurrency$,
      billingAgreementDepositCurrencyMaps$,
      currencies$,
    ]).pipe(
      map(
        ([
          billingAgreements,
          depositMethods,
          userSelectedDepositCurrency,
          defaultDepositCurrency,
          billingAgreementDepositCurrencyMaps,
          currencies,
        ]) =>
          fromPairs(
            billingAgreements.map(b => {
              let agreementDefaultCurrency = currencies.find(
                c => c.id === b.currencyId,
              );

              // Fall back to the default currency for the deposit method
              // TODO - confirm with Jun
              if (!agreementDefaultCurrency) {
                const depositMethod = depositMethods.find(
                  m => m.id === b.depositMethod,
                );
                if (!depositMethod) {
                  throw new Error(
                    'No matching deposit method for billing agreement',
                  );
                }
                agreementDefaultCurrency = depositMethod.defaultCurrency;
              }

              const currencyMap = billingAgreementDepositCurrencyMaps[b.id];

              return [
                b.id,
                this.getMethodDepositCurrency(
                  agreementDefaultCurrency,
                  userSelectedDepositCurrency,
                  currencyMap,
                  defaultDepositCurrency,
                ),
              ];
            }),
          ),
      ),
    );
  }

  getBillingAgreementPaymentCurrencies(
    billingAgreements$: Rx.Observable<ReadonlyArray<BillingAgreement>>,
    currencies$: Rx.Observable<ReadonlyArray<Currency>>,
    depositMethods$: Rx.Observable<ReadonlyArray<UserDepositMethod>>,
    selectedPaymentCurrencies$: Rx.Observable<CurrencyMap>,
  ): Rx.Observable<CurrencyMap> {
    return Rx.combineLatest([
      billingAgreements$,
      currencies$,
      depositMethods$,
      selectedPaymentCurrencies$.pipe(startWith({} as MethodCurrencies)),
    ]).pipe(
      map(
        ([
          billingAgreements,
          currencies,
          depositMethods,
          selectedPaymentCurrencies,
        ]) =>
          fromPairs(
            billingAgreements.map(b => {
              if (
                selectedPaymentCurrencies &&
                selectedPaymentCurrencies[b.id]
              ) {
                return [b.id, selectedPaymentCurrencies[b.id]];
              }

              const defaultCurrency = currencies.find(
                c => c.id === b.currencyId,
              );

              if (defaultCurrency) {
                return [b.id, defaultCurrency];
              }

              throw new Error(
                'Unable to determine payment currency for billing agreement',
              );
            }),
          ),
      ),
    );
  }

  intersection<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>): ReadonlyArray<T> {
    const bSet = new Set(b);
    return a.filter(x => bSet.has(x));
  }

  reduceMethodToCurrencyMap(
    depositMethod: UserDepositMethod,
    currencies: ReadonlyArray<Currency>,
  ): CurrencyMap {
    return depositMethod.depositFees.reduce((currencyMap, d) => {
      const currency = currencies.find(c => c.id === d.id);
      return currency
        ? {
            ...currencyMap,
            [currency.code]: currency,
          }
        : currencyMap;
    }, {});
  }

  reduceCurrencyListToCurrencyMap(
    currencies: ReadonlyArray<Currency>,
  ): CurrencyMap {
    return currencies.reduce(
      (currencyMap, currency) => ({
        ...currencyMap,
        [currency.code]: currency,
      }),
      {},
    );
  }

  indexByBillingAgreementId(
    billingAgreements$: Rx.Observable<ReadonlyArray<BillingAgreement>>,
    methodCurrencyMaps$: Rx.Observable<MethodCurrencyMaps>,
  ): Rx.Observable<MethodCurrencyMaps> {
    return Rx.combineLatest([billingAgreements$, methodCurrencyMaps$]).pipe(
      map(([billingAgreements, methodCurrencyMaps]) =>
        billingAgreements.reduce(
          (billingAgreementCurrencyMap, billingAgreement) => ({
            ...billingAgreementCurrencyMap,
            [billingAgreement.id]:
              methodCurrencyMaps[billingAgreement.depositMethod],
          }),
          {},
        ),
      ),
    );
  }

  getSelectedPaymentCurrencies(
    methodPaymentCurrency$: Rx.Observable<MethodPaymentCurrency>,
  ): Rx.Observable<CurrencyMap> {
    return methodPaymentCurrency$.pipe(
      scan(
        (
          acc: { [methodId: string]: Currency },
          methodPaymentCurrency: MethodPaymentCurrency,
        ) => ({
          ...acc,
          [methodPaymentCurrency.methodId]: methodPaymentCurrency.currency,
        }),
        {},
      ),
    );
  }

  wireUpSourceDataOutputForDepositMethods(
    depositMethods$: Rx.Observable<ReadonlyArray<UserDepositMethod>>,
    methodDepositCurrencies$: Rx.Observable<CurrencyMap>,
    methodPaymentCurrencies$: Rx.Observable<CurrencyMap>,
    methodDepositCurrencyMaps$: Rx.Observable<MethodCurrencyMaps>,
  ) {
    const selectedSourceData$: Rx.Observable<SourceData> = this.radioValue$.pipe(
      switchMap(id =>
        Rx.combineLatest([
          depositMethods$,
          methodDepositCurrencies$,
          methodPaymentCurrencies$,
          methodDepositCurrencyMaps$,
        ]).pipe(
          map(
            ([
              depositMethods,
              methodDepositCurrencies,
              methodPaymentCurrencies,
              methodDepositCurrencyMaps,
            ]) => {
              const method = depositMethods.find(m => m.id === id);
              return method
                ? {
                    depositCurrency: methodDepositCurrencies[id],
                    paymentCurrency: methodPaymentCurrencies[id],
                    depositCurrencyMap: methodDepositCurrencyMaps[id],
                    depositFees: method.depositFees,
                    nativeCharge: method.nativeCharge,
                    depositMethodId: method.id as DepositMethodApi,
                  }
                : undefined;
            },
          ),
          filter(isDefined),
        ),
      ),
    );

    this.subscriptions = [
      ...this.subscriptions,
      selectedSourceData$.subscribe(v => {
        this.selectedSourceData.emit(v);
      }),
    ];
  }

  wireUpSourceDataOutputForBillingAgreements(
    billingAgreements$: Rx.Observable<ReadonlyArray<BillingAgreement>>,
    depositMethods$: Rx.Observable<ReadonlyArray<UserDepositMethod>>,
    depositCurrencies$: Rx.Observable<CurrencyMap>,
    paymentCurrencies$: Rx.Observable<CurrencyMap>,
    depositCurrencyMaps$: Rx.Observable<MethodCurrencyMaps>,
  ) {
    const selectedSourceData$: Rx.Observable<SourceData> = this.radioValue$.pipe(
      switchMap(id =>
        Rx.combineLatest([
          billingAgreements$,
          depositMethods$,
          depositCurrencies$,
          paymentCurrencies$,
          depositCurrencyMaps$,
        ]).pipe(
          map(
            ([
              billingAgreements,
              depositMethods,
              depositCurrencies,
              paymentCurrencies,
              depositCurrencyMaps,
            ]) => {
              const agreement = billingAgreements.find(b => b.id === id);
              if (!agreement) {
                return undefined;
              }
              const associatedMethod = depositMethods.find(
                m => m.id === agreement.depositMethod,
              );
              if (!associatedMethod) {
                throw new Error(
                  `No method associated with the selected agreement: ${id}`,
                );
              }
              return {
                depositCurrency: depositCurrencies[id],
                paymentCurrency: paymentCurrencies[id],
                depositCurrencyMap: depositCurrencyMaps[id],
                depositFees: associatedMethod.depositFees,
                // NOTE: Billing agreements all support native charge
                nativeCharge: true,
                depositMethodId: undefined,
                isBillingAgreement: true,
              };
            },
          ),
          filter(isDefined),
        ),
      ),
    );

    this.subscriptions = [
      ...this.subscriptions,
      selectedSourceData$.subscribe(v => {
        this.selectedSourceData.emit(v);
      }),
    ];
  }
}
