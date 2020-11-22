import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformUsStates } from './us-states.transformers';
import { UsStatesCollection } from './us-states.types';

export function usStatesReducer(
  state: CollectionStateSlice<UsStatesCollection> = {},
  action: CollectionActions<UsStatesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'usStates') {
        const { result, ref, order } = action.payload;

        return mergeDocuments<UsStatesCollection>(
          state,
          transformIntoDocuments(result, transformUsStates),
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
