import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformProjectViewProjects } from '../project-view-projects/project-view-projects.transformers';
import { SuperuserProjectViewProjectsCollection } from './superuser-project-view-projects.types';

export function superuserProjectViewProjectsReducer(
  state: CollectionStateSlice<SuperuserProjectViewProjectsCollection> = {},
  action: CollectionActions<SuperuserProjectViewProjectsCollection>,
) {
  switch (action.type) {
    // Network request fetched items successfully, merge them into the state
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'superuserProjectViewProjects') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SuperuserProjectViewProjectsCollection>(
          state,
          transformIntoDocuments(
            result.projects,
            transformProjectViewProjects,
            result.selected_bids,
          ),
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
