import { EntryPriceOfferApi } from 'api-typings/contests/contests';
import { ContestEntryOffer } from './contest-entry-offers.model';

export function transformEntryPriceOfferApi(
  offer: EntryPriceOfferApi,
): ContestEntryOffer {
  return {
    id: offer.id,
    entryId: offer.entry_id,
    contestId: offer.contest_id,
    entryOwnerId: offer.entry_owner_id,
    contestOwnerId: offer.contest_owner_id,
    priceOffer: offer.price_offer,
    accepted: !!offer.time_accepted,
    timeCreated: offer.time_created * 1000,
    timeAccepted: offer.time_accepted ? offer.time_accepted * 1000 : undefined,
    timeModified: offer.time_modified ? offer.time_modified * 1000 : undefined,
  };
}
