import { CurrencyPipe } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { isDefined } from '@freelancer/utils';
import { currencySignMap } from './currency-sign-map';

export interface AmountRange {
  minimum: number;
  maximum?: number;
}

/**
 * This pipe provides a unified way to display amount and currency
 * so that it's consistent throughout the freelancer codebase.
 * So far we only have one format `{currency.sign}{amount} {currency.code}`
 * but it's possible to have two formats i.e. `long`/`short`,
 * depending on the product decision. This pipe can also display minimum
 * and maximum amount in range with currency.
 *
 * Note: For single amounts the accounting standards show the negative amounts as `(absAmount)`,
 *  where `absAmount` is absolute amount
 *
 * Example for single amount =
 *  - controller
 *  ```
      this.amount = 130;
      this.currency: Currency = {code: AUD, sign: $, ...};
    ```
 *  - template
 *  ```
      <fl-text> Amount to pay: {{ amount | flCurrency:currency }} </fl-text>
    ```
 *  - output
 *  ```
      Amount to pay: $130 AUD
    ```
 *
 * Example for range =
 *  - controller
 *  ```
      amountRange = {
        minimum: 1300,
        maximum: 2000,
      };
      this.currency: Currency = {code: AUD, sign: $, ...};
    ```
 *  - template
 *  ```
      <fl-text> Project Budget: {{ amountRange | flCurrency: currency.code }} </fl-text>
    ```
 *  - output
 *  ```
      Project Budget: $1,300.00 - 2,000.00 AUD
    ```
 */
@Pipe({ name: 'flCurrency' })
// We only called it FreelancerCurrencyPipe because CurrencyPipe already existed
export class FreelancerCurrencyPipe implements PipeTransform {
  readonly NO_FRACTION_FORMAT = '1.0-0';

  constructor(@Inject(LOCALE_ID) private locale: string) {}

  transform(
    amount: number | AmountRange | null | undefined,
    code: string | null | undefined,
    negativeParenthesis = false,
    withPrecision = true,
  ): string | null {
    if (!isDefined(amount) || !isDefined(code)) {
      // safety guard for nonexistent values when template is loading
      return null;
    }

    if (this.isTimeBasedCurrency(code)) {
      // TODO T99032 split this logic into its own pipe
      return typeof amount === 'number'
        ? this.displaySingleTimeAmount(amount)
        : this.displayRangeTimeAmount(amount);
    }

    const currencyPipe = new CurrencyPipe(this.locale);
    return typeof amount === 'number'
      ? this.displaySingleAmount(
          amount,
          code,
          currencyPipe,
          negativeParenthesis,
          withPrecision,
        )
      : this.displayRangeAmount(amount, code, currencyPipe, withPrecision);
  }

  displaySingleAmount(
    amount: number,
    code: string,
    currencyPipe: CurrencyPipe,
    negativeParenthesis: boolean,
    withPrecision: boolean,
  ): string | null {
    const absAmount = Math.abs(amount);
    const parentAmount =
      currencyPipe.transform(
        absAmount,
        code,
        '',
        // Trying to reduce it to a whole number.
        // Leaving it undefined will allow the currency pipe
        // to format the number to the proper amount of decimal places
        // based on the ISO 4217 standard.
        this.getDigitsFormat(withPrecision, absAmount),
      ) || absAmount.toString();

    const formatted = `${this.getSignForCurrency(code)}${parentAmount} ${code}`;
    return amount >= 0
      ? formatted
      : negativeParenthesis
      ? `(${formatted})`
      : `-${formatted}`;
  }

  displayRangeAmount(
    amount: AmountRange,
    code: string,
    currencyPipe: CurrencyPipe,
    withPrecision: boolean,
  ): string | null {
    if (!isDefined(amount.minimum)) {
      return null;
    }

    /**
     * Only format to whole number if both numbers
     * can be reduced into a whole number.
     */
    const decimalRepresentation =
      this.getDigitsFormat(withPrecision, amount.minimum) &&
      this.getDigitsFormat(withPrecision, amount.maximum);

    const parentMinimum =
      currencyPipe.transform(amount.minimum, code, '', decimalRepresentation) ||
      amount.minimum.toString();
    const parentMaximum =
      currencyPipe.transform(amount.maximum, code, '', decimalRepresentation) ||
      (amount.maximum ? amount.maximum.toString() : '');

    return `${this.getSignForCurrency(code)}${parentMinimum}${
      parentMaximum ? ' – ' : '+'
    }${parentMaximum || ''} ${code}`;
  }

  displaySingleTimeAmount(amount: number) {
    return amount === 1
      ? `${amount.toFixed(2)} hour`
      : `${amount.toFixed(2)} hours`;
  }

  displayRangeTimeAmount(amount: AmountRange) {
    // minimum not defined, invalid
    if (!isDefined(amount.minimum)) {
      return null;
    }

    // maximum not defined, only display minimum
    if (!isDefined(amount.maximum)) {
      return `${amount.minimum.toFixed(2)}+ hours`;
    }

    // both displayed
    return `${amount.minimum.toFixed(2)} – ${amount.maximum.toFixed(2)} hours`;
  }

  getSignForCurrency(code: string): string {
    const sign = currencySignMap[code.toLowerCase()];
    if (!sign) {
      throw new Error(`Invalid currency code '${code}' in currency pipe.`);
    }
    return sign;
  }

  // TODO: T99032 get this logic from the sign map
  isTimeBasedCurrency(code: string): boolean {
    return code === 'TKN';
  }

  private getDigitsFormat(
    withPrecision: boolean,
    amount?: number,
  ): string | undefined {
    if (withPrecision) {
      // Use the default fraction format in the angular currency pipe.
      return undefined;
    }
    return !amount || Number.isInteger(amount)
      ? this.NO_FRACTION_FORMAT
      : undefined;
  }
}
