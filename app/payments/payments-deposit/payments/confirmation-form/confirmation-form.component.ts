import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  Currency,
  DepositFee,
  ExchangeRate,
} from '@freelancer/datastore/collections';
import { InputTextAlign, InputType } from '@freelancer/ui/input';
import { Margin } from '@freelancer/ui/margin';
import { maxValue, minValue } from '@freelancer/ui/validators';
import { isDefined, isFormControl } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { take } from 'rxjs/operators';
import { getExchangeRate, roundCurrency } from '../payments.helpers';
import { SourceData } from '../sources/sources.component';

@Component({
  selector: 'app-confirmation-form',
  template: `
    <ng-container *ngIf="confirmationFormGroup">
      <fl-bit
        [ngClass]="{
          PaymentsConfirmationCardInputsHidden:
            hasInitialCurrency && hasInitialAmount
        }"
      >
        <fl-bit
          class="PaymentsConfirmationCardInputs"
          [flMarginBottom]="Margin.XXSMALL"
        >
          <fl-label
            class="PaymentsConfirmationCardInputs-label"
            i18n="Deposit currency input label"
            [for]="'depositCurrencySelect'"
          >
            Deposit Currency
          </fl-label>
          <ng-container
            *ngIf="confirmationFormGroup.get('currencySelect') as control"
          >
            <fl-select
              *ngIf="isFormControl(control)"
              class="PaymentsConfirmationCardInputs-input"
              flTrackingLabel="depositCurrencySelect"
              flTrackingExtraParams="{{ control.value }}"
              [control]="control"
              [id]="'depositCurrencySelect'"
              [options]="depositCurrencyDropdownOptions"
              [flagStartCountryCode]="selectedCurrencyFlag | lowercase"
              [disabled]="hasInitialCurrency"
            ></fl-select>
          </ng-container>
        </fl-bit>
        <fl-bit
          class="PaymentsConfirmationCardInputs"
          [flMarginBottom]="Margin.XXXSMALL"
        >
          <fl-label
            class="PaymentsConfirmationCardInputs-label"
            i18n="Deposit amount input label"
            [for]="'depositAmountInput'"
          >
            Deposit Amount
          </fl-label>
          <ng-container
            *ngIf="confirmationFormGroup.get('depositAmountInput') as control"
          >
            <fl-input
              *ngIf="isFormControl(control)"
              class="PaymentsConfirmationCardInputs-input"
              flTrackingLabel="depositAmountInput"
              flTrackingExtraParams="{{ control.value }}"
              [control]="control"
              [id]="'depositAmountInput'"
              [type]="InputType.NUMBER"
              [beforeLabel]="selectedCurrencyCode"
              [disabled]="hasInitialAmount"
              [textAlign]="InputTextAlign.RIGHT"
            ></fl-input>
          </ng-container>
        </fl-bit>
      </fl-bit>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./confirmation-form.component.scss'],
})
export class ConfirmationFormComponent implements OnDestroy, OnInit {
  Margin = Margin;
  InputType = InputType;
  InputTextAlign = InputTextAlign;
  isFormControl = isFormControl;
  private subscriptions: ReadonlyArray<Rx.Subscription> = [];

  @Input() confirmationFormGroup: FormGroup;

  @Input() hasInitialCurrency = false;
  @Input() hasInitialAmount = false;

  @Input() defaultDepositAmount$: Rx.Observable<number>;
  @Input() defaultDepositCurrency$: Rx.Observable<Currency>;
  @Input() exchangeRates$: Rx.Observable<ReadonlyArray<ExchangeRate>>;
  @Input() selectedSourceData$: Rx.Observable<SourceData>;

  selectedCurrencyFlag = '';
  selectedCurrencyCode = '$';

  depositCurrencyDropdownOptions: ReadonlyArray<string>;

  ngOnInit() {
    // Only take the 1st value for initialization
    const defaultAmountAndCurrency$ = Rx.combineLatest([
      this.defaultDepositAmount$,
      this.defaultDepositCurrency$,
    ]).pipe(take(1));

    this.subscriptions = [
      ...this.subscriptions,
      defaultAmountAndCurrency$.subscribe(
        ([defaultDepositAmount, defaultDepositCurrency]) => {
          this.confirmationFormGroup.controls.currencySelect.setValue(
            defaultDepositCurrency.name,
          );
          this.confirmationFormGroup.controls.depositAmountInput.setValue(
            defaultDepositAmount,
          );
        },
      ),
    ];

    // React to `selectedSourceData$` changes
    const sourceDataAndExchangeRates$ = Rx.combineLatest([
      this.selectedSourceData$,
      this.exchangeRates$,
      this.defaultDepositAmount$.pipe(take(1)),
      this.defaultDepositCurrency$.pipe(take(1)),
    ]);

    this.subscriptions = [
      ...this.subscriptions,
      sourceDataAndExchangeRates$.subscribe(
        ([
          selectedSourceData,
          exchangeRates,
          defaultDepositAmount,
          defaultDepositCurrency,
        ]) => {
          // Help the user to change the amount when the currency is changed when toggling between methods.
          // We only do this when the initial ChargeCurrency and ChargeAmount are set and the inputs are disabled
          const amountControl = this.confirmationFormGroup.controls
            .depositAmountInput;
          if (this.hasInitialCurrency && this.hasInitialAmount) {
            // Get the rate from default deposit currency to the current one
            const rate = getExchangeRate(
              exchangeRates,
              selectedSourceData.depositCurrency.code,
              defaultDepositCurrency.code,
            );
            amountControl.setValue(defaultDepositAmount / rate);
          } else if (!amountControl.touched && !amountControl.dirty) {
            const currencyConfig = this.findCurrencyConfig(
              selectedSourceData.depositFees,
              selectedSourceData.depositCurrency,
            );
            const minAmount = currencyConfig.minAmount || 0;
            if (amountControl.value < minAmount) {
              amountControl.setValue(minAmount);
            }
          }

          // We don't want to emit back the changes to the `valueChanges` listeners. The confirmation componenet
          // is using the `valueChanges` of the `currencySelect` to decide if the user manually changed the currency and
          // set the `userSelectedDepositCurrency$` observable
          this.confirmationFormGroup.controls.currencySelect.setValue(
            selectedSourceData.depositCurrency.name,
            { emitEvent: false },
          );
          this.depositCurrencyDropdownOptions = Object.values(
            selectedSourceData.depositCurrencyMap,
          )
            .map(v => v.name)
            .filter(isDefined);

          // Modify the validator of the `depositAmountInput`
          amountControl.clearValidators();
          amountControl.setValidators(
            this.getAmountInputValidators(selectedSourceData),
          );
          amountControl.updateValueAndValidity();

          // Cosmetic labels
          this.selectedCurrencyFlag =
            selectedSourceData.depositCurrency.country ||
            this.selectedCurrencyFlag;
          this.selectedCurrencyCode =
            selectedSourceData.depositCurrency.sign ||
            this.selectedCurrencyCode;
        },
      ),
    ];

    // Format the input to 2 decimal points, i.e., from 12.1111111 to 12.11
    // TODO: needs to consider precision from Currency
    this.subscriptions = [
      ...this.subscriptions,
      this.confirmationFormGroup.controls.depositAmountInput.valueChanges.subscribe(
        amount => {
          const amountValid = /^[0-9]*(\.[0-9]{1,2})?$/.test(amount);
          if (!amountValid) {
            this.confirmationFormGroup.controls.depositAmountInput.setValue(
              roundCurrency(amount),
              { emitEvent: false },
            );
          }
        },
      ),
    ];
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  findCurrencyConfig(
    depositFeeConfigs: ReadonlyArray<DepositFee>,
    targetCurrency: Currency,
  ): DepositFee {
    const currencyConfig = depositFeeConfigs.find(
      v => v.id === targetCurrency.id,
    );
    if (!currencyConfig) {
      throw new Error(
        `Missing deposit fees configuration for currency ${targetCurrency.code}`,
      );
    }
    return currencyConfig;
  }

  getAmountInputValidators(selectedSourceData: SourceData) {
    if (this.hasInitialCurrency && this.hasInitialAmount) {
      return [];
    }
    const currencyConfig = this.findCurrencyConfig(
      selectedSourceData.depositFees,
      selectedSourceData.depositCurrency,
    );
    const minAmount = currencyConfig.minAmount || 0;
    const { maxAmount } = currencyConfig;
    return [
      minValue(
        minAmount,
        `Minimum deposit amount is ${selectedSourceData.depositCurrency.sign}${minAmount}`,
      ),
      ...(maxAmount
        ? [
            maxValue(
              maxAmount,
              `Maximum deposit amount is ${selectedSourceData.depositCurrency.sign}${maxAmount}`,
            ),
          ]
        : []),
    ];
  }
}
