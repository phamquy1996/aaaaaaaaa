import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformManageViewOpenProjectsItem } from './manage-view-open-projects.transformers';
import { ManageViewOpenProjectsCollection } from './manage-view-open-projects.types';

export function manageViewOpenProjectsReducer(
  state: CollectionStateSlice<ManageViewOpenProjectsCollection> = {},
  action: CollectionActions<ManageViewOpenProjectsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'manageViewOpenProjects') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ManageViewOpenProjectsCollection>(
          state,
          transformIntoDocuments(result, transformManageViewOpenProjectsItem),
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
