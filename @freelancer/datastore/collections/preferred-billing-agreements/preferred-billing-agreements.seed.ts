import { BillingAgreement } from '../billing-agreements';
import { PreferredBillingAgreement } from './preferred-billing-agreements.model';

export interface GeneratePreferredBillingAgreementOptions {
  readonly bidId: number;
  readonly billingAgreement?: BillingAgreement;
}

export function generatePreferredBillingAgreementObject(
  options: GeneratePreferredBillingAgreementOptions,
): PreferredBillingAgreement {
  return {
    id: options.bidId,
    billingAgreement: options.billingAgreement,
  };
}
