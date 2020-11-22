import { transformContestHandovers } from '../contest-handovers/contest-handovers.transformers';
import { ManageViewHandoversItemAjax } from './manage-view-handovers.backend-model';
import {
  ManageHandoverStatus,
  ManageViewHandover,
  ManageViewHandoverContext,
} from './manage-view-handovers.model';

export function transformManageViewHandover(
  handover: ManageViewHandoversItemAjax,
  { role }: ManageViewHandoverContext,
): ManageViewHandover {
  return {
    ...transformContestHandovers(handover),
    role,
    oppositePartyUsername: handover.opposite_party_username,
    handoverStatus: getHandoverStatus(handover),
  };
}

function getHandoverStatus(handover: ManageViewHandoversItemAjax) {
  if (!handover.buyer_confirmed && handover.seller_confirmed) {
    return ManageHandoverStatus.FOR_REVIEW;
  }
  return ManageHandoverStatus.IN_PROGRESS;
}
