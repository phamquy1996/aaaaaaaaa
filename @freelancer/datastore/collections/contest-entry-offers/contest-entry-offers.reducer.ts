import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformEntryPriceOfferApi } from './contest-entry-offers.transformers';
import { ContestEntryOffersCollection } from './contest-entry-offers.types';

export function contestEntryOffersReducer(
  state: CollectionStateSlice<ContestEntryOffersCollection> = {},
  action: CollectionActions<ContestEntryOffersCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'contestEntryOffers') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ContestEntryOffersCollection>(
          state,
          transformIntoDocuments(result.offers, transformEntryPriceOfferApi),
          order,
          ref,
        );
      }
      return state;
    }
    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'contestEntryOffers') {
        const { ref, result } = action.payload;
        return mergeWebsocketDocuments<ContestEntryOffersCollection>(
          state,
          transformIntoDocuments([result], transformEntryPriceOfferApi),
          ref,
        );
      }
      return state;
    }
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'contestEntryOffers') {
        const { ref, result } = action.payload;
        return mergeWebsocketDocuments<ContestEntryOffersCollection>(
          state,
          transformIntoDocuments([result], transformEntryPriceOfferApi),
          ref,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
