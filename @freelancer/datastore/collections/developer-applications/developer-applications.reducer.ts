import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformDeveloperApplication } from './developer-applications.transformers';
import { DeveloperApplicationsCollection } from './developer-applications.types';

export function developerApplicationsReducer(
  state: CollectionStateSlice<DeveloperApplicationsCollection> = {},
  action: CollectionActions<DeveloperApplicationsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'developerApplications') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<DeveloperApplicationsCollection>(
          state,
          transformIntoDocuments(
            result.applications,
            transformDeveloperApplication,
          ),
          order,
          ref,
        );
      }
      return state;
    }
    case 'API_UPDATE_SUCCESS':
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'developerApplications') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<DeveloperApplicationsCollection>(
          state,
          transformIntoDocuments([result], transformDeveloperApplication),
          ref,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
