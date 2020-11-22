import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformSearchKeywordProject } from './search-keyword-projects.transformers';
import { SearchKeywordProjectsCollection } from './search-keyword-projects.types';

export function searchKeywordProjectsReducer(
  state: CollectionStateSlice<SearchKeywordProjectsCollection> = {},
  action: CollectionActions<SearchKeywordProjectsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'searchKeywordProjects') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SearchKeywordProjectsCollection>(
          state,
          transformIntoDocuments(result, transformSearchKeywordProject),
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
