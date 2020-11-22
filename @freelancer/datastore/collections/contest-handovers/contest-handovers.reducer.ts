import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformContestHandovers } from './contest-handovers.transformers';
import { ContestHandoversCollection } from './contest-handovers.types';

export function contestHandoversReducer(
  state: CollectionStateSlice<ContestHandoversCollection> = {},
  action: CollectionActions<ContestHandoversCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'contestHandovers') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ContestHandoversCollection>(
          state,
          transformIntoDocuments(result.handovers, transformContestHandovers),
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
