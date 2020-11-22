import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformFindPageDetails } from './find-page-details.transformers';
import { FindPageDetailsCollection } from './find-page-details.types';

export function findPageDetailsReducer(
  state: CollectionStateSlice<FindPageDetailsCollection> = {},
  action: CollectionActions<FindPageDetailsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'findPageDetails') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<FindPageDetailsCollection>(
          state,
          transformIntoDocuments(result, transformFindPageDetails),
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
