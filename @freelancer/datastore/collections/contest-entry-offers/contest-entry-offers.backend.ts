import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { ContestEntryOffersCollection } from './contest-entry-offers.types';

export function contestEntryOffersBackend(): Backend<
  ContestEntryOffersCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'contests/0.1/offers/',
      params: {
        accepted: getQueryParamValue(query, 'accepted')[0],
        contest_ids: getQueryParamValue(query, 'contestId'),
        entry_price_offer_ids: ids,
      },
    }),
    push: (authUid, offer) => {
      if (!offer.extraForPostAndUpdate?.message) {
        throw new Error(`Missing offer message in contest entry offer create`);
      }

      return {
        endpoint: 'contests/0.1/offers/',
        method: 'POST',
        payload: {
          entry_id: offer.entryId,
          price_offer: offer.priceOffer,
          message: offer.extraForPostAndUpdate?.message,
        },
      };
    },
    update: (authUid, offer, originalOffer) => {
      if (!offer.priceOffer) {
        throw new Error(`Missing price offer in contest entry offer update`);
      }

      if (!offer.extraForPostAndUpdate?.message) {
        throw new Error(`Missing offer message in contest entry offer update`);
      }

      return {
        endpoint: `contests/0.1/offers/${originalOffer.id}/`,
        method: 'PUT',
        payload: {
          price_offer: offer.priceOffer,
          message: offer.extraForPostAndUpdate?.message,
        },
      };
    },
    set: undefined,
    remove: undefined,
  };
}
