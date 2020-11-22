import {
  Currency,
  DepositPageVarsBanner,
} from '@freelancer/datastore/collections';
import { ApplicationType } from '@freelancer/payments-tracking';
import { ContextTypeApi } from 'api-typings/payments/payments';

export interface DepositModalItem {
  description: string;
  amount: number;
  contextType?: ContextTypeApi;
  isHourlyInvoiceMilestoneItem?: boolean;
}

export interface CartListItem {
  type: string;
  amount: number;
  currency: Currency | undefined;
}

export interface DepositContext {
  trackingToken?: string;
  backUrl?: string;
  backUrlEncoded?: string;
  banner: DepositPageVarsBanner;
  cartId?: number;
  chargeAmount?: number;
  chargeCurrencyId?: number;
  items?: ReadonlyArray<DepositModalItem>;
  applicationType?: ApplicationType;
  // TODO: get rid of checkBalance
  // it's only for migration period from the old deposit page
  checkBalance: boolean;
  onSuccess(): void;
}

export interface DepositData {
  depositAmount: number;
  depositCurrency: Currency;
  paymentAmount: number;
  paymentCurrency: Currency;
}

export interface GenericPayload {
  user_id: number;
  threatmetrix_session: string;
  cancel_url: string;
  tracking_token?: string;
  back_url?: string;
  country_code: string;
  action: string;
  domain: string;
  cart_id?: number;
}

export enum EnterpriseCurrencyIds {
  TOKEN = 40,
}
