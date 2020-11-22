import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { PaymentShareTeamsCollection } from './payment-share-teams.types';

export function paymentShareTeamsBackend(): Backend<
  PaymentShareTeamsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    maxBatchSize: 1, // This endpoint only supports querying one document at a time.

    fetch: (authUid, ids = [], query) => {
      if (ids && ids.length > 1) {
        throw new Error(`Cannot query more than one bid id per call`);
      }
      return {
        endpoint: 'users/0.1/payment_sharing/teams',
        isGaf: false,
        params: {
          id: ids ? ids[0] : undefined,
          billing_agreement_id: getQueryParamValue(
            query,
            'billingAgreementId',
          )[0],
        },
      };
    },
    push: (authUid, paymentShareTeam) => {
      if (
        !paymentShareTeam.billingAgreementId ||
        !paymentShareTeam.depositMethod
      ) {
        throw new Error(
          `Missing billing agreement id or deposite Method in payment share team create`,
        );
      }
      return {
        endpoint: 'users/0.1/payment_sharing/teams',
        isGaf: false,
        payload: {
          billing_agreement_id: paymentShareTeam.billingAgreementId,
          deposit_method: paymentShareTeam.depositMethod,
          payment_share_team_name: paymentShareTeam.paymentShareTeamName,
          member_spending_limit_duration:
            paymentShareTeam.memberSpendingLimitDuration,
          member_spending_limit_amount:
            paymentShareTeam.memberSpendingLimitAmount,
          is_spending_limit_active: paymentShareTeam.isSpendingLimitActive,
          status: paymentShareTeam.status,
        },
      };
    },
    set: undefined,
    update: (authUid, document, originalDocument) => ({
      endpoint: `users/0.1/payment_sharing/teams/${originalDocument.id}`,
      method: 'PUT',
      isGaf: false,
      payload: {
        id: originalDocument.id,
        payment_share_team_name: document.paymentShareTeamName,
        status: document.status,
        member_spending_limit_duration: document.memberSpendingLimitDuration,
        member_spending_limit_amount: document.memberSpendingLimitAmount,
        is_spending_limit_active: document.isSpendingLimitActive,
      },
    }),
    remove: undefined,
  };
}
