import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformOnBehalfProjects } from './on-behalf-projects.transformers';
import { OnBehalfProjectsCollection } from './on-behalf-projects.types';

export function onBehalfProjectsReducer(
  state: CollectionStateSlice<OnBehalfProjectsCollection> = {},
  action: CollectionActions<OnBehalfProjectsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'onBehalfProjects') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<OnBehalfProjectsCollection>(
          state,
          transformIntoDocuments(result, transformOnBehalfProjects),
          order,
          ref,
        );
      }
      return state;
    }
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'onBehalfProjects') {
        const { ref, result } = action.payload;
        return mergeWebsocketDocuments<OnBehalfProjectsCollection>(
          state,
          transformIntoDocuments([result], transformOnBehalfProjects),
          ref,
        );
      }
      return state;
    }
    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'onBehalfProjects') {
        const { result, ref } = action.payload;

        return mergeWebsocketDocuments<OnBehalfProjectsCollection>(
          state,
          transformIntoDocuments(result, transformOnBehalfProjects),
          ref,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
