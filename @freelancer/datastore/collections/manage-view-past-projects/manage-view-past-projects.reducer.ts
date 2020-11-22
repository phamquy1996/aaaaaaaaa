import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformManageViewPastProjectsItem } from './manage-view-past-projects.transformers';
import { ManageViewPastProjectsCollection } from './manage-view-past-projects.types';

export function manageViewPastProjectsReducer(
  state: CollectionStateSlice<ManageViewPastProjectsCollection> = {},
  action: CollectionActions<ManageViewPastProjectsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'manageViewPastProjects') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ManageViewPastProjectsCollection>(
          state,
          transformIntoDocuments(result, transformManageViewPastProjectsItem),
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
