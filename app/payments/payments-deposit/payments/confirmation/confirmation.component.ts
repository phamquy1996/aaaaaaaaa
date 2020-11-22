import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  Currency,
  DepositFee,
  ExchangeRate,
  UserBalance,
} from '@freelancer/datastore/collections';
import { DepositForm } from '@freelancer/payments-utils';
import { Tracking } from '@freelancer/tracking';
import { CardBorderRadius } from '@freelancer/ui/card';
import { Margin } from '@freelancer/ui/margin';
import { isDefined, isFormControl, toNumber } from '@freelancer/utils';
import { ContextTypeApi } from 'api-typings/payments/payments';
import * as Rx from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  startWith,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { DepositContext, DepositData } from '../../../common/types';
import { forcePaymentCurrencyMethods } from '../methods/methods.types';
import {
  getExchangeRate,
  getUserBalancesInCurrency,
  roundCurrency,
} from '../payments.helpers';
import { SourceData } from '../sources/sources.component';
import { ConfirmationRows, Row } from '../table/table.component';

// https://github.com/angular/angular/issues/13721
// a bit of a workaround
export interface ConfirmationFormControls {
  currencySelect?: string;
  depositAmountInput?: number;
}

@Component({
  selector: 'app-confirmation',
  template: `
    <fl-card
      class="PaymentsConfirmationCard"
      [borderRadius]="CardBorderRadius.LARGE"
      [flMarginBottom]="Margin.LARGE"
    >
      <app-confirmation-form
        [confirmationFormGroup]="confirmationFormGroup"
        [hasInitialAmount]="!!(chargeAmount$ | async)"
        [hasInitialCurrency]="!!(chargeCurrency$ | async)"
        [defaultDepositAmount$]="defaultDepositAmount$"
        [defaultDepositCurrency$]="defaultDepositCurrency$"
        [selectedSourceData$]="selectedSourceData$"
        [exchangeRates$]="exchangeRates$"
      ></app-confirmation-form>
      <app-table
        *ngIf="rows$ | async as rows"
        [flMarginBottom]="Margin.MID"
        [rows]="rows"
      ></app-table>
      <ng-container
        *ngIf="
          depositFormGroup.get(DepositForm.NATIVE_CHARGE_TOGGLE) as control
        "
      >
        <fl-checkbox
          *ngIf="
            (shouldShowNativeChargeToggle$ | async) && isFormControl(control)
          "
          class="PaymentsConfirmationCheckbox"
          flTrackingLabel="nativeChargeCheckbox"
          [flMarginBottom]="Margin.SMALL"
          [control]="control"
          i18n-label="Native charge copy"
          label="You will be charged in {{ nativeChargeCopy$ | async }}"
        ></fl-checkbox>
      </ng-container>
      <app-confirmation-button
        i18n-copy="Confirmation Button"
        copy="Confirm and pay"
        [amount]="amountToConfirm$ | async"
        [currency]="currencyToConfirm$ | async"
        [depositFormGroup]="depositFormGroup"
        [buttonDisabled]="
          !confirmationFormGroup.controls.depositAmountInput.valid
        "
        (confirmation)="onConfirmationClick($event)"
      ></app-confirmation-button>
      <app-confirmation-copy
        [selectedDepositMethod]="(selectedSourceData$ | async)?.depositMethodId"
        [nativeChargeCopy]="nativeChargeCopy$ | async"
        [showNativeChargeCopy]="!(shouldShowNativeChargeToggle$ | async)"
      ></app-confirmation-copy>
    </fl-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnDestroy, OnInit {
  isFormControl = isFormControl;
  Margin = Margin;
  DepositForm = DepositForm;
  CardBorderRadius = CardBorderRadius;

  @Input() defaultDepositAmount$: Rx.Observable<number>;
  @Input() defaultDepositCurrency$: Rx.Observable<Currency>;
  @Input() depositContext$: Rx.Observable<DepositContext>;
  @Input() depositFormGroup: FormGroup;
  @Input() selectedSourceData$: Rx.Observable<SourceData>;
  @Input() exchangeRates$: Rx.Observable<ReadonlyArray<ExchangeRate>>;
  @Input()
  exchangeRatesNativeCharge$: Rx.Observable<ReadonlyArray<ExchangeRate>>;
  @Input() userBalances$: Rx.Observable<ReadonlyArray<UserBalance>>;
  @Input() chargeCurrency$: Rx.Observable<Currency | undefined>;
  @Input() chargeAmount$: Rx.Observable<number | undefined>;
  @Input() checkBalance$: Rx.Observable<boolean>;

  @Output() userSelectedDepositCurrency = new EventEmitter<Currency>();
  @Output() depositData = new EventEmitter<DepositData>();

  private confirmationActionSubject$ = new Rx.Subject<boolean>();
  confirmationAction$ = this.confirmationActionSubject$.asObservable();

  private subscriptions: ReadonlyArray<Rx.Subscription> = [];
  confirmationFormGroupValueChanges$: Rx.Observable<ConfirmationFormControls>;

  depositAmount$: Rx.Observable<number>;
  depositCurrency$: Rx.Observable<Currency>;

  depositData$: Rx.Observable<DepositData>;

  hasInitialCurrency$: Rx.Observable<boolean>;
  hasInitialAmount$: Rx.Observable<boolean>;

  shouldShowNativeChargeToggle$: Rx.Observable<boolean>;
  nativeChargeCheckbox = new FormControl();
  nativeChargeCopy$: Rx.Observable<string>;
  paymentCurrency$: Rx.Observable<Currency>;
  paymentAmount$: Rx.Observable<number>;

  currencyToConfirm$: Rx.Observable<Currency>;
  amountToConfirm$: Rx.Observable<number>;
  rows$: Rx.Observable<ReadonlyArray<Row>>;

  userSelectedDepositCurrency$: Rx.Observable<Currency>;
  confirmationFormGroup: FormGroup;

  constructor(private fb: FormBuilder, private tracking: Tracking) {}

  ngOnInit() {
    // set up confirmation form group
    this.depositFormGroup.setControl(
      DepositForm.NATIVE_CHARGE_TOGGLE,
      this.nativeChargeCheckbox,
    );
    this.confirmationFormGroup = this.fb.group({
      currencySelect: undefined,
      depositAmountInput: undefined,
    });

    this.depositFormGroup.setControl(
      DepositForm.CONFIRMATION,
      this.confirmationFormGroup,
    );

    // for emitting `userSelectedDepositCurrency`
    this.userSelectedDepositCurrency$ = this.confirmationFormGroup.controls.currencySelect.valueChanges.pipe(
      distinctUntilChanged(),
      withLatestFrom(this.selectedSourceData$),
      map(([currencySelect, selectedSourceData]) => {
        if (currencySelect === undefined) {
          return selectedSourceData.depositCurrency;
        }
        const currency = Object.values(
          selectedSourceData.depositCurrencyMap,
        ).find(v => v.name === currencySelect);
        if (!currency) {
          throw new Error(
            `Currency ${currencySelect} not available for this deposit method!`,
          );
        }
        return currency;
      }),
    );
    this.subscriptions = [
      ...this.subscriptions,
      this.userSelectedDepositCurrency$.subscribe(c => {
        this.userSelectedDepositCurrency.emit(c);
      }),
    ];

    // Listen for confirmation form changes
    this.confirmationFormGroupValueChanges$ = this.confirmationFormGroup.valueChanges.pipe(
      startWith(this.confirmationFormGroup.value),
    );
    this.depositCurrency$ = Rx.combineLatest([
      this.selectedSourceData$,
      this.confirmationFormGroupValueChanges$.pipe(
        map(valueChanges => valueChanges.currencySelect),
        startWith(this.confirmationFormGroup.controls.currencySelect.value),
      ),
    ]).pipe(
      map(
        ([selectedSourceData, depositCurrencyName]) =>
          Object.values(selectedSourceData.depositCurrencyMap).find(
            m => m.name === depositCurrencyName,
          ) || selectedSourceData.depositCurrency,
      ),
    );

    // NOTE: this value depends on the emission from the form
    this.depositAmount$ = this.confirmationFormGroupValueChanges$.pipe(
      map(valueChanges => valueChanges.depositAmountInput),
      filter(isDefined),
      map(
        // we need to cast the inputAmount to number, because we're gettings strings from the form
        inputAmount => roundCurrency(toNumber(inputAmount)),
      ),
    );

    // Native charges
    const nativeChargeEnabled$ = Rx.combineLatest([
      this.selectedSourceData$,
      this.depositCurrency$,
    ]).pipe(
      map(
        ([selectedSourceData, depositCurrency]) =>
          selectedSourceData.nativeCharge &&
          depositCurrency.id !== selectedSourceData.paymentCurrency.id,
      ),
    );

    this.shouldShowNativeChargeToggle$ = Rx.combineLatest([
      nativeChargeEnabled$,
      this.selectedSourceData$,
    ]).pipe(
      withLatestFrom(
        this.nativeChargeCheckbox.valueChanges.pipe(
          startWith(this.nativeChargeCheckbox.value),
        ),
      ),
      map(
        ([[nativeChargeEnabled, selectedSourceData], nativeChargeCheckbox]) => {
          if (nativeChargeCheckbox === null) {
            this.nativeChargeCheckbox.setValue(nativeChargeEnabled, {
              emitEvent: false,
            });
          }
          const shouldDisableNativeChargeToggle =
            (selectedSourceData.depositMethodId &&
              forcePaymentCurrencyMethods.includes(
                selectedSourceData.depositMethodId,
              )) ||
            selectedSourceData.isBillingAgreement;
          return !shouldDisableNativeChargeToggle && nativeChargeEnabled;
        },
      ),
      distinctUntilChanged(),
    );

    this.nativeChargeCopy$ = Rx.combineLatest([
      this.selectedSourceData$,
      this.exchangeRatesNativeCharge$,
      nativeChargeEnabled$,
      this.depositCurrency$,
    ]).pipe(
      map(
        ([
          selectedSourceData,
          exchangeRates,
          nativeChargeEnabled,
          depositCurrency,
        ]) => {
          if (nativeChargeEnabled) {
            const rate = getExchangeRate(
              exchangeRates,
              selectedSourceData.paymentCurrency.code,
              depositCurrency.code,
            );
            return `${selectedSourceData.paymentCurrency.code} (1.00 ${
              depositCurrency.code
            } = ${roundCurrency(1 / rate, 6)} ${
              selectedSourceData.paymentCurrency.code
            })`;
          }
          return '';
        },
      ),
    );

    const nativeChargeCheckboxValueChanges$ = this.nativeChargeCheckbox.valueChanges.pipe(
      startWith(this.nativeChargeCheckbox.value),
    );

    // initially specified by payment method, user can change it with nativeChargeCheckbox
    this.paymentCurrency$ = Rx.combineLatest([
      this.selectedSourceData$,
      this.depositCurrency$,
      nativeChargeCheckboxValueChanges$,
    ]).pipe(
      map(([selectedSourceData, depositCurrency, nativeCharge]) => {
        if (nativeCharge) {
          return selectedSourceData.paymentCurrency;
        }
        return depositCurrency;
      }),
    );

    // initial hourly paymet
    const isInitialHourlyPayment$ = this.depositContext$.pipe(
      map(
        depositContext =>
          depositContext.items &&
          depositContext.items.some(
            item => item.contextType === ContextTypeApi.HOURLY_INITIAL_PAYMENT,
          ),
      ),
      startWith(false),
    );

    // Summary table setup
    const checkBalance$ = Rx.combineLatest([
      this.checkBalance$,
      this.chargeAmount$,
      this.chargeCurrency$,
    ]).pipe(
      map(
        ([checkBalance, chargeAmount, chargeCurrency]) =>
          checkBalance && chargeAmount && chargeCurrency,
      ),
    );

    // For future extension
    const payWithoutBalance$ = Rx.combineLatest([isInitialHourlyPayment$]).pipe(
      map(([isInitialHourlyPayment]) => isInitialHourlyPayment),
      startWith(false),
    );

    const lessEquivalentBalance$ = Rx.combineLatest([
      this.userBalances$,
      this.exchangeRates$,
      this.depositCurrency$,
      this.depositAmount$,
      payWithoutBalance$,
    ]).pipe(
      map(
        ([
          userBalances,
          exchangeRates,
          depositCurrency,
          depositAmount,
          payWithoutBalance,
        ]) => {
          if (payWithoutBalance) {
            return 0;
          }
          const availableBalance = getUserBalancesInCurrency(
            userBalances,
            exchangeRates,
            depositCurrency,
          );
          return availableBalance > depositAmount
            ? depositAmount
            : availableBalance;
        },
      ),
    );

    const subtotalDepositAmount$ = Rx.combineLatest([
      this.depositAmount$,
      lessEquivalentBalance$,
    ]).pipe(
      withLatestFrom(this.checkBalance$),
      map(([[depositAmount, lessEquivalentBalance], checkBalance]) =>
        roundCurrency(
          checkBalance
            ? depositAmount > lessEquivalentBalance
              ? depositAmount - lessEquivalentBalance
              : 0
            : depositAmount,
        ),
      ),
    );

    const rowValues$ = Rx.combineLatest([
      this.paymentCurrency$,
      this.depositAmount$,
      this.depositCurrency$,
      this.exchangeRatesNativeCharge$,
      lessEquivalentBalance$,
      subtotalDepositAmount$,
    ]).pipe(
      withLatestFrom(this.selectedSourceData$),
      map(
        ([
          [
            paymentCurrency,
            depositAmount,
            depositCurrency,
            exchangeRates,
            lessEquivalentBalance,
            subtotalDepositAmount,
          ],
          selectedSourceData,
        ]) => {
          // For final payment amount
          const exchangeRate = getExchangeRate(
            exchangeRates,
            paymentCurrency.code,
            depositCurrency.code,
          );
          const exchangedSubtotalAmount = roundCurrency(
            subtotalDepositAmount / exchangeRate,
          );
          const paymentCurrencyFeeConfig = this.getFeeConfig(
            selectedSourceData,
            paymentCurrency,
          );
          const processingFeesAmountForPaymentCurrency = this.calculateFeeRate(
            paymentCurrencyFeeConfig,
            exchangedSubtotalAmount,
          );
          const paymentAmount = roundCurrency(
            processingFeesAmountForPaymentCurrency + exchangedSubtotalAmount,
          );

          // For final checkout and confirmation
          const depositCurrencyFeeConfig = this.getFeeConfig(
            selectedSourceData,
            depositCurrency,
          );
          const processingFeesAmountForDepositCurrency = this.calculateFeeRate(
            depositCurrencyFeeConfig,
            subtotalDepositAmount,
          );
          const amountToConfirm = roundCurrency(
            processingFeesAmountForDepositCurrency + subtotalDepositAmount,
          );
          const currencyToConfirm = depositCurrency;

          return {
            depositAmount,
            lessEquivalentBalance,
            exchangeRate,
            subtotalDepositAmount,
            exchangedSubtotalAmount,
            processingFeesAmountForPaymentCurrency,
            paymentCurrencyFeeConfig,
            paymentCurrency,
            paymentAmount,
            processingFeesAmountForDepositCurrency,
            depositCurrency,
            depositCurrencyFeeConfig,
            amountToConfirm,
            currencyToConfirm,
          };
        },
      ),
    );

    this.amountToConfirm$ = rowValues$.pipe(
      map(values => values.amountToConfirm),
    );

    this.currencyToConfirm$ = rowValues$.pipe(
      map(values => values.currencyToConfirm),
    );

    const showDepositAmount$ = Rx.combineLatest([
      this.chargeCurrency$,
      this.chargeAmount$,
    ]).pipe(
      map(
        ([chargeCurrency, chargeAmount]) => !!chargeCurrency && !!chargeAmount,
      ),
    );

    // calculate the exchange rate on each item in the deposit context
    const depositItemsAfterExchangeRate$ = Rx.combineLatest([
      this.depositContext$,
      this.paymentCurrency$,
      this.chargeCurrency$,
      this.exchangeRates$,
      this.selectedSourceData$,
    ]).pipe(
      map(
        ([
          depositContext,
          paymentCurrency,
          chargeCurrency,
          exchangeRates,
          selectedSourceData,
        ]) => {
          if (
            !depositContext.items ||
            !depositContext.chargeAmount ||
            !chargeCurrency ||
            selectedSourceData.nativeCharge
          ) {
            return depositContext.items;
          }
          const exchangeRate = getExchangeRate(
            exchangeRates,
            paymentCurrency.code,
            chargeCurrency.code,
          );

          return depositContext.items.map(item => ({
            ...item,
            amount: roundCurrency(item.amount / exchangeRate),
          }));
        },
      ),
      map(items => items || []),
    );

    this.rows$ = rowValues$.pipe(
      withLatestFrom(
        depositItemsAfterExchangeRate$,
        checkBalance$,
        showDepositAmount$,
      ),
      map(([rowsValues, depositItems, checkBalance, showDepositAmount]) => [
        ...(depositItems.length > 0
          ? [
              {
                type: ConfirmationRows.TITLE,
                underline: true,
              },
            ]
          : []),
        ...(depositItems
          ? depositItems.map(dcItem => ({
              type: ConfirmationRows.ITEM,
              itemCopy: dcItem.description,
              amount: dcItem.amount,
              contextType: dcItem.contextType,
              currency: rowsValues.depositCurrency,
              isHourlyInvoiceMilestoneItem: dcItem.isHourlyInvoiceMilestoneItem,
            }))
          : []),
        ...(showDepositAmount && depositItems.length === 0
          ? [
              {
                type: ConfirmationRows.DEPOSIT_AMOUNT,
                amount: rowsValues.depositAmount,
                currency: rowsValues.depositCurrency,
              },
            ]
          : []),
        ...(checkBalance && rowsValues.lessEquivalentBalance !== 0
          ? [
              {
                type: ConfirmationRows.LESS_EQUIVALENT_BALANCE,
                underline: true,
                amount: -rowsValues.lessEquivalentBalance,
                currency: rowsValues.depositCurrency,
              },
              {
                type: ConfirmationRows.SUBTOTAL,
                underline: true,
                amount: rowsValues.subtotalDepositAmount,
                currency: rowsValues.depositCurrency,
              },
            ]
          : []),
        ...(rowsValues.processingFeesAmountForDepositCurrency > 0
          ? [
              {
                type: ConfirmationRows.PROCESSING_FEE,
                info: rowsValues.depositCurrencyFeeConfig.feeRate
                  ? `
                    Calculated as
                    ${rowsValues.depositCurrency.sign}${rowsValues
                      .depositCurrencyFeeConfig.feeFixedAmount || 0}
                    + ${roundCurrency(
                      (rowsValues.depositCurrencyFeeConfig.feeRate || 0) * 100,
                    )}%
                    of the deposit amount.
                  `
                  : `
                    Fixed fee ${rowsValues.depositCurrency.sign}${rowsValues
                      .depositCurrencyFeeConfig.feeFixedAmount || 0}.
                  `,
                amount: rowsValues.processingFeesAmountForDepositCurrency,
                currency: rowsValues.depositCurrency,
                underline: true,
              },
            ]
          : []),
        {
          type: ConfirmationRows.TOTAL,
          amount: rowsValues.amountToConfirm,
          currency: rowsValues.currencyToConfirm,
          underline: false,
        },
      ]),
    );

    // get final payment amount
    this.paymentAmount$ = rowValues$.pipe(map(v => v.paymentAmount));
    this.depositData$ = Rx.combineLatest([
      subtotalDepositAmount$,
      this.depositCurrency$,
      this.paymentAmount$,
      this.paymentCurrency$,
    ]).pipe(
      map(
        ([depositAmount, depositCurrency, paymentAmount, paymentCurrency]) => ({
          depositAmount,
          paymentAmount,
          depositCurrency,
          paymentCurrency,
        }),
      ),
    );

    const triggerDepositDataEmission$ = this.confirmationAction$.pipe(
      withLatestFrom(this.depositData$),
      map(([_, depositData]) => depositData),
      tap(depositData => this.depositData.emit({ ...depositData })),
      tap(data =>
        this.tracking.trackCustomEvent(
          'depositSubmissionData',
          'PaymentsConfirmationCard',
          {
            depositAmount: data.depositAmount,
            depositCurrencyCode: data.depositCurrency.code,
            paymentAmount: data.paymentAmount,
            paymentCurrencyCode: data.paymentCurrency.code,
          },
        ),
      ),
    );

    this.subscriptions = [
      ...this.subscriptions,
      triggerDepositDataEmission$.subscribe(),
    ];
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onConfirmationClick(event: boolean) {
    this.confirmationActionSubject$.next(event);
  }

  getFeeConfig(
    selectedSourceData: SourceData,
    paymentCurrency: Currency,
  ): DepositFee {
    const feeConfig = selectedSourceData.depositFees.find(
      v => v.id === paymentCurrency.id,
    );
    return feeConfig || { id: 0, minAmount: 0, maxAmount: 0 };
  }

  calculateFeeRate(feeConfig: DepositFee, subtotalAmount: number): number {
    const fixed = feeConfig.feeFixedAmount || 0;
    const rate = feeConfig.feeRate || 0;
    return roundCurrency(fixed + rate * subtotalAmount);
  }
}
