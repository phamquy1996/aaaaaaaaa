import { generateId } from '@freelancer/datastore/testing';
import { DepositMethodApi } from 'api-typings/payments/payments';
import { CurrencyCode, generateCurrencyObject } from '../currencies';
import {
  BillingAgreement,
  CreditCard,
  Paypal,
} from './billing-agreements.model';

export const CREDIT_CARD_NUMBER = '111111****2222';
export interface GenerateBillingAgreementOptions {
  readonly currencyCode?: CurrencyCode;
  readonly token?: string;
  readonly depositMethod: DepositMethodApi;
  readonly lastSuccessTimestamp?: number;

  // for fake credit card
  readonly creditCard?: CreditCard;

  // for fake paypal account
  readonly paypal?: Paypal;
}

export function generateBillingAgreementObject({
  currencyCode = CurrencyCode.USD,
  depositMethod,
  lastSuccessTimestamp = Date.now(),
  creditCard,
  paypal,
}: GenerateBillingAgreementOptions): BillingAgreement {
  return {
    id: generateId().toString(),
    currencyId: generateCurrencyObject(currencyCode).id,
    token: generateId().toString(),
    depositMethod,
    lastSuccessTimestamp,
    creditCard,
    paypal,
  };
}

export function generateCreditCard({
  creditCardNumber = CREDIT_CARD_NUMBER,
  cardType = 'visa',
}: {
  readonly creditCardNumber?: string;
  readonly cardType?: string;
} = {}): Pick<GenerateBillingAgreementOptions, 'creditCard'> {
  return {
    creditCard: {
      creditCardNumber,
      cardType,
    },
  };
}
