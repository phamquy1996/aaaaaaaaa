import { assertNever } from '@freelancer/utils';
import {
  HandoverApi,
  HandoverUserRoleApi,
} from 'api-typings/contests/contests';
import { transformContestHandovers } from '../contest-handovers/contest-handovers.transformers';
import { transformBaseUser } from '../users/users.transformers';
import {
  ManageContestHandoverStatus,
  ManageViewContestHandover,
  ManageViewContestHandoverContext,
} from './manage-view-contest-handovers.model';

export function transformManageViewContestHandover(
  handover: HandoverApi,
  { role, users }: ManageViewContestHandoverContext,
): ManageViewContestHandover {
  if (
    !users ||
    !handover.contest_id ||
    !handover.entry_id ||
    !handover.buyer_id ||
    !handover.seller_id
  ) {
    throw new Error('Required values not found.');
  }

  const buyer = users[handover.buyer_id];
  const seller = users[handover.seller_id];

  switch (role) {
    case HandoverUserRoleApi.BUYER:
      if (!seller) {
        throw new Error('Seller is missing in the backend response');
      }

      return {
        role,
        ...transformContestHandovers(handover),
        sellerDetails: transformBaseUser(seller),
        handoverStatus: getHandoverStatus(handover),
      };
    case HandoverUserRoleApi.SELLER:
      if (!buyer) {
        throw new Error('Buyer is missing in the backend response');
      }

      return {
        role,
        ...transformContestHandovers(handover),
        buyerDetails: transformBaseUser(buyer),
        handoverStatus: getHandoverStatus(handover),
      };
    default:
      return assertNever(role);
  }
}

function getHandoverStatus(handover: HandoverApi) {
  if (!handover.buyer_confirmed && handover.seller_confirmed) {
    return ManageContestHandoverStatus.FOR_REVIEW;
  }
  return ManageContestHandoverStatus.IN_PROGRESS;
}
