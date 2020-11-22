import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformMilestoneDrafts } from './milestone-drafts.transformers';
import { MilestoneDraftsCollection } from './milestone-drafts.types';

export function milestoneDraftsReducer(
  state: CollectionStateSlice<MilestoneDraftsCollection> = {},
  action: CollectionActions<MilestoneDraftsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'milestoneDrafts') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<MilestoneDraftsCollection>(
          state,
          transformIntoDocuments(
            result.milestone_drafts,
            transformMilestoneDrafts,
          ),
          order,
          ref,
        );
      }
      return state;
    }
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'milestoneDrafts') {
        const { result: milestoneDraft, ref } = action.payload;
        return mergeWebsocketDocuments<MilestoneDraftsCollection>(
          state,
          transformIntoDocuments([milestoneDraft], transformMilestoneDrafts),
          ref,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
