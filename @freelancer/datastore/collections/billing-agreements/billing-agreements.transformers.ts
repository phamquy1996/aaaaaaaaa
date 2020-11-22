import {
  CreditCardApi,
  PaymentSourceApi,
  PaypalApi,
  PaytmReferenceApi,
  VirtualPaymentMethodReferenceApi,
} from 'api-typings/payments/payments';
import {
  BillingAgreement,
  CreditCard,
  Paypal,
  PaytmReference,
  VirtualPaymentMethod,
} from './billing-agreements.model';

// Transforms what the backend returns into a format your components can consume
// Should only be called in this collection's reducer (passed to `mergeDocuments`)
export function transformBillingAgreements(
  billingAgreement: PaymentSourceApi,
): BillingAgreement {
  if (!billingAgreement.token) {
    throw new ReferenceError('Token is empty');
  }
  if (!billingAgreement.currency_id) {
    throw new ReferenceError('Currency not specified');
  }
  if (!billingAgreement.deposit_method) {
    throw new ReferenceError('Deposit method not specified');
  }

  return {
    id: billingAgreement.token,
    currencyId: billingAgreement.currency_id,
    token: billingAgreement.token,
    depositMethod: billingAgreement.deposit_method,
    lastSuccessTimestamp: billingAgreement.last_success_timestamp
      ? billingAgreement.last_success_timestamp * 1000
      : 0,
    creditCard: billingAgreement.credit_card
      ? transformCreditCard(billingAgreement.credit_card)
      : undefined,
    paypal: billingAgreement.paypal
      ? transformPaypal(billingAgreement.paypal)
      : undefined,
    paytm: billingAgreement.paytm
      ? transformPaytm(billingAgreement.paytm)
      : undefined,
    virtualPaymentMethod: billingAgreement.virtual_payment_method
      ? transformVirtualPaymentMethod(billingAgreement.virtual_payment_method)
      : undefined,
  };
}

function transformCreditCard(creditCard: CreditCardApi): CreditCard {
  return {
    creditCardNumber: creditCard.credit_card_number,
    cardType: creditCard.card_type,
    cardExpiry: creditCard.card_expiry,
    gateway: creditCard.gateway,
  };
}

function transformPaypal(paypal: PaypalApi): Paypal {
  return {
    paypalAccountName: paypal.paypal_account_name,
    paypalEmail: paypal.paypal_email,
    approvalTime: paypal.approval_time,
  };
}

function transformPaytm(paytm: PaytmReferenceApi): PaytmReference {
  return {
    periodId: paytm.period_id,
  };
}

function transformVirtualPaymentMethod(
  method: VirtualPaymentMethodReferenceApi,
): VirtualPaymentMethod {
  return {
    name: method.name,
    extraInfo: method.extra_info,
  };
}
