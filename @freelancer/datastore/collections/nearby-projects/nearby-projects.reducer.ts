import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformNearbyProjects } from './nearby-projects.transformers';
import { NearbyProjectsCollection } from './nearby-projects.types';

export function nearbyProjectsReducer(
  state: CollectionStateSlice<NearbyProjectsCollection> = {},
  action: CollectionActions<NearbyProjectsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'nearbyProjects') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<NearbyProjectsCollection>(
          state,
          transformIntoDocuments(result.projects, transformNearbyProjects),
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
