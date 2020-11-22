import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformContestFees } from './contest-fees.transformers';
import { ContestFeesCollection } from './contest-fees.types';

export function contestFeesReducer(
  state: CollectionStateSlice<ContestFeesCollection> = {},
  action: CollectionActions<ContestFeesCollection>,
) {
  switch (action.type) {
    // Network request fetched items successfully, merge them into the state
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'contestFees') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ContestFeesCollection>(
          state,
          transformIntoDocuments(result, transformContestFees),
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
