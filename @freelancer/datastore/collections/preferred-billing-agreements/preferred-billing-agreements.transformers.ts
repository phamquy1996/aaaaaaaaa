import { PreferredPaymentMethodUpdateResultApi } from 'api-typings/payments/payments';
import { BillingAgreement } from '../billing-agreements/billing-agreements.model';
import { transformBillingAgreements } from '../billing-agreements/billing-agreements.transformers';
import { PreferredBillingAgreement } from './preferred-billing-agreements.model';

export function transformPreferredBillingAgreement(
  preferredPaymentMethod: PreferredPaymentMethodUpdateResultApi,
): PreferredBillingAgreement {
  let billingAgreement: BillingAgreement | undefined;
  if (preferredPaymentMethod.payment_source) {
    billingAgreement = transformBillingAgreements(
      preferredPaymentMethod.payment_source,
    );
  }
  return {
    id: preferredPaymentMethod.bid_id,
    billingAgreement,
  };
}
