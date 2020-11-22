import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformManageViewOngoingProjectsItem } from './manage-view-ongoing-projects.transformers';
import { ManageViewOngoingProjectsCollection } from './manage-view-ongoing-projects.types';

export function manageViewOngoingProjectsReducer(
  state: CollectionStateSlice<ManageViewOngoingProjectsCollection> = {},
  action: CollectionActions<ManageViewOngoingProjectsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'manageViewOngoingProjects') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ManageViewOngoingProjectsCollection>(
          state,
          transformIntoDocuments(
            result,
            transformManageViewOngoingProjectsItem,
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
