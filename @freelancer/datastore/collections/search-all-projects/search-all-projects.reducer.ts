import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformProject } from '../projects/projects.transformers';
import { SearchAllProjectsCollection } from './search-all-projects.types';

export function searchAllProjectsReducer(
  state: CollectionStateSlice<SearchAllProjectsCollection> = {},
  action: CollectionActions<SearchAllProjectsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'searchAllProjects') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SearchAllProjectsCollection>(
          state,
          transformIntoDocuments(result.projects, transformProject),
          order,
          ref,
          result.total_count || 0,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
