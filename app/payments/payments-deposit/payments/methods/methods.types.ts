import { DepositMethodApi } from 'api-typings/payments/payments';

interface DepositMethodInterface {
  id: DepositMethodApi;
  label: string;
  enablePopUp?: boolean;
  logoReplacementText?: string;
  forceDefaultCurrencyAsPaymentCurrency?: boolean;
}

export const forcePaymentCurrencyMethods: ReadonlyArray<DepositMethodApi> = [
  DepositMethodApi.ALIPAY,
  DepositMethodApi.BOLETO,
  DepositMethodApi.DOTPAY,
  DepositMethodApi.UNION_PAY,
  DepositMethodApi.WECHATPAY,
];

export const availableDepositMethods: ReadonlyArray<DepositMethodInterface> = [
  {
    id: DepositMethodApi.SKRILL,
    label: 'Skrill',
  },
  {
    id: DepositMethodApi.SOFORT,
    label: 'Sofort',
  },
  {
    id: DepositMethodApi.GIROPAY,
    label: 'Giropay',
  },
  {
    id: DepositMethodApi.BANCONTACT,
    label: 'Bancontact',
  },
  {
    id: DepositMethodApi.INTERAC,
    label: 'Interac',
  },
  {
    id: DepositMethodApi.DOTPAY,
    label: 'Dotpay',
    forceDefaultCurrencyAsPaymentCurrency: true,
  },
  {
    id: DepositMethodApi.ALIPAY,
    label: 'Alipay',
    forceDefaultCurrencyAsPaymentCurrency: true,
  },
  {
    id: DepositMethodApi.UNION_PAY,
    label: 'UnionPay',
    forceDefaultCurrencyAsPaymentCurrency: true,
  },
  {
    id: DepositMethodApi.PAYTM,
    label: 'Paytm',
  },
  {
    id: DepositMethodApi.WECHATPAY,
    label: 'WeChat Pay',
    enablePopUp: true,
    forceDefaultCurrencyAsPaymentCurrency: true,
  },
  {
    id: DepositMethodApi.PAYPAL,
    label: 'Debit or Credit Card',
    enablePopUp: true,
    logoReplacementText: 'All major cards accepted',
  },
  {
    id: DepositMethodApi.PAYPAL_REFERENCE,
    label: 'PayPal',
    enablePopUp: true,
  },
];
