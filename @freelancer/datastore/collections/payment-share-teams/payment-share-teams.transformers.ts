import { DepositMethodApi } from 'api-typings/common/common';
import { PaymentShareTeamApi } from 'api-typings/users/users';
import {
  BillingAgreementInfo,
  PaymentShareTeam,
} from './payment-share-teams.model';

export function transformPaymentShareTeam(
  paymentShareTeam: PaymentShareTeamApi,
): PaymentShareTeam {
  return {
    id: paymentShareTeam.id,
    ownerEntityId: paymentShareTeam.owner_entity_id,
    ownerEntityType: paymentShareTeam.owner_entity_type,
    paymentShareTeamName: paymentShareTeam.payment_share_team_name,
    status: paymentShareTeam.status,
    memberSpendingLimitDuration:
      paymentShareTeam.member_spending_limit_duration,
    memberSpendingLimitAmount: paymentShareTeam.member_spending_limit_amount,
    isSpendingLimitActive: paymentShareTeam.is_spending_limit_active,
    ...transformBillingInfo(
      paymentShareTeam.billing_agreement_id,
      paymentShareTeam.deposit_method,
    ),
  };
}

export function transformBillingInfo(
  billingAgreementId?: number,
  depositMethod?: DepositMethodApi,
): BillingAgreementInfo {
  if (billingAgreementId && depositMethod) {
    return {
      isTeamOwner: true,
      billingAgreementId,
      depositMethod,
    };
  }
  return {
    isTeamOwner: false,
    billingAgreementId: undefined,
    depositMethod: undefined,
  };
}
