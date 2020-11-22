import { HandoverApi } from 'api-typings/contests/contests';
import { ContestHandover } from './contest-handovers.model';

export function transformContestHandovers(
  handover: HandoverApi,
): ContestHandover {
  if (
    !handover.buyer_id ||
    !handover.contest_id ||
    !handover.id ||
    !handover.seller_id ||
    !handover.active ||
    !handover.entry_id
  ) {
    throw new ReferenceError(`Missing a required handover field.`);
  }

  return {
    active: handover.active,
    adminCancelled: !handover.admin_cancelled
      ? false
      : handover.admin_cancelled,
    adminCancelledDate: handover.admin_cancelled_date
      ? handover.admin_cancelled_date * 1000
      : undefined,
    buyerConfirmed: !handover.buyer_confirmed
      ? false
      : handover.buyer_confirmed,
    buyerConfirmedDate: handover.buyer_confirmed_date
      ? handover.buyer_confirmed_date * 1000
      : undefined,
    buyerId: handover.buyer_id,
    buyerSignedContract: !handover.buyer_signed_contract
      ? false
      : handover.buyer_signed_contract,
    buyerSignedDate: handover.buyer_signed_date
      ? handover.buyer_signed_date * 1000
      : undefined,
    contestId: handover.contest_id,
    entryId: handover.entry_id,
    id: handover.id,
    sellerConfirmed: !handover.seller_confirmed
      ? false
      : handover.seller_confirmed,
    sellerConfirmedDate: handover.seller_confirmed_date
      ? handover.seller_confirmed_date * 1000
      : undefined,
    sellerId: handover.seller_id,
    sellerSignedContract: !handover.seller_signed_contract
      ? false
      : handover.seller_signed_contract,
    sellerSignedDate: handover.seller_signed_date
      ? handover.seller_signed_date * 1000
      : undefined,
  };
}
