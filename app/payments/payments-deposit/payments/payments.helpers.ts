import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';
import {
  Currency,
  ExchangeRate,
  UserBalance,
} from '@freelancer/datastore/collections';
import {
  PaymentsError,
  PaymentsErrorType,
} from '@freelancer/payments-messaging';
import * as Rx from 'rxjs';
import { filter, map, startWith, switchMap } from 'rxjs/operators';

export interface MethodPaymentCurrency {
  methodId: string;
  currency: Currency;
}

export interface MethodSelectedCurrencies {
  [methodId: string]: Rx.Observable<Currency>;
}

export function mapValueToSelectedCurrencies(
  control: AbstractControl,
  methodSelectedCurrencies$: Rx.Observable<MethodSelectedCurrencies>,
) {
  return Rx.combineLatest([
    control.valueChanges.pipe(startWith(control.value)),
    methodSelectedCurrencies$,
  ]).pipe(
    filter(([v, methodSelectedCurrencies]) => v in methodSelectedCurrencies),
    switchMap(([v, methodSelectedCurrencies]) =>
      methodSelectedCurrencies[v].pipe(
        map(currency => ({ currency, methodId: v })),
      ),
    ),
  );
}

export function roundCurrency(amount: number, precision = 2): number {
  const multiplier = 10 ** precision;
  return Math.round(amount * multiplier) / multiplier;
}

export function parseDepositAPIError(err: HttpErrorResponse): PaymentsError {
  let error = err.error && err.error.message ? err.error.message : err.message;
  try {
    // error message may be a json object
    error = JSON.parse(error);
  } catch (e) {
    return {
      errorType: PaymentsErrorType.ERROR,
    };
  }

  return {
    errorMessage: error.error_msg ? error.error_msg : err.message,
    errorCode: error.error_code,
    eventId: error.uuid,
    errorType: PaymentsErrorType.ERROR,
  };
}

export function getExchangeRate(
  exchangeRates: ReadonlyArray<ExchangeRate>,
  fromCurrencyCode: string,
  toCurrencyCode: string,
): number {
  const fx = exchangeRates.find(v => v.id === toCurrencyCode);
  if (!fx) {
    throw new Error(
      `Exchange rate for ${fromCurrencyCode}-${toCurrencyCode} not found!`,
    );
  }
  const fxC = fx.from[fromCurrencyCode];
  if (fxC === undefined) {
    throw new Error(
      `Exchange rate for ${fromCurrencyCode}-${toCurrencyCode} not found!`,
    );
  }
  return fxC;
}

export function getUserBalancesInCurrency(
  userBalances: ReadonlyArray<UserBalance>,
  exchangeRates: ReadonlyArray<ExchangeRate>,
  currency: Currency,
): number {
  return userBalances.reduce((acc, balance) => {
    const rate = getExchangeRate(
      exchangeRates,
      balance.currency.code,
      currency.code,
    );
    return acc + balance.amount * rate;
  }, 0);
}
