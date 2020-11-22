import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformBidAwardDraft } from './bid-award-drafts.transformers';
import { BidAwardDraftsCollection } from './bid-award-drafts.types';

export function bidAwardDraftsReducer(
  state: CollectionStateSlice<BidAwardDraftsCollection> = {},
  action: CollectionActions<BidAwardDraftsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'bidAwardDrafts') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<BidAwardDraftsCollection>(
          state,
          transformIntoDocuments(
            [result.bid_award_draft],
            transformBidAwardDraft,
          ),
          order,
          ref,
        );
      }
      return state;
    }
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'bidAwardDrafts') {
        const { result: bidAwardDraft, ref } = action.payload;
        return mergeWebsocketDocuments<BidAwardDraftsCollection>(
          state,
          transformIntoDocuments([bidAwardDraft], transformBidAwardDraft),
          ref,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
