import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformContestViewEntryIds } from './contest-view-entry-ids.transformers';
import { ContestViewEntryIdsCollection } from './contest-view-entry-ids.types';

export function contestViewEntryIdsReducer(
  state: CollectionStateSlice<ContestViewEntryIdsCollection> = {},
  action: CollectionActions<ContestViewEntryIdsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'contestViewEntryIds') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ContestViewEntryIdsCollection>(
          state,
          transformIntoDocuments(result, transformContestViewEntryIds),
          order,
          ref,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
