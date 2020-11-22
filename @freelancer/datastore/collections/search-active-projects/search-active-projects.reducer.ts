import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformSearchActiveProject } from './search-active-projects.transformers';
import { SearchActiveProjectsCollection } from './search-active-projects.types';

export function searchActiveProjectsReducer(
  state: CollectionStateSlice<SearchActiveProjectsCollection> = {},
  action: CollectionActions<SearchActiveProjectsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'searchActiveProjects') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SearchActiveProjectsCollection>(
          state,
          transformIntoDocuments(result.projects, transformSearchActiveProject),
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
