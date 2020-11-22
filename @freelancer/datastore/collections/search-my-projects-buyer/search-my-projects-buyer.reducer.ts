import {
  CollectionActions,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformSearchMyProjects } from './search-my-projects-buyer.transformers';
import { SearchMyProjectsBuyerCollection } from './search-my-projects-buyer.types';

export function searchMyProjectsBuyerReducer(
  state = {},
  action: CollectionActions<SearchMyProjectsBuyerCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS':
      if (action.payload.type === 'searchMyProjectsBuyer') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SearchMyProjectsBuyerCollection>(
          state,
          transformIntoDocuments(result, transformSearchMyProjects),
          order,
          ref,
        );
      }
      return state;
    default:
      return state;
  }
}
