import { PaymentShareMemberApi } from 'api-typings/users/users';
import { PaymentShareMember } from './payment-share-members.model';

export function transformPaymentShareMember(
  paymentShareMember: PaymentShareMemberApi,
): PaymentShareMember {
  return {
    id: paymentShareMember.id,
    billingAgreementId: paymentShareMember.billing_agreement_id,
    entityId: paymentShareMember.entity_id,
    entityType: paymentShareMember.entity_type,
    paymentShareTeamId: paymentShareMember.payment_share_team_id,
    status: paymentShareMember.status,
  };
}
