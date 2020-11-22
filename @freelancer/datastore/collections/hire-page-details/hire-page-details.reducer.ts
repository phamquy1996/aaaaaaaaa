import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformHirePageDetails } from './hire-page-details.transformers';
import { HirePageDetailsCollection } from './hire-page-details.types';

export function hirePageDetailsReducer(
  state: CollectionStateSlice<HirePageDetailsCollection> = {},
  action: CollectionActions<HirePageDetailsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'hirePageDetails') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<HirePageDetailsCollection>(
          state,
          transformIntoDocuments(result, transformHirePageDetails),
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
