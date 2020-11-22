import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformManageViewContestsItem } from './manage-view-contests.transformers';
import { ManageViewContestsCollection } from './manage-view-contests.types';

export function manageViewContestsReducer(
  state: CollectionStateSlice<ManageViewContestsCollection> = {},
  action: CollectionActions<ManageViewContestsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'manageViewContests') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ManageViewContestsCollection>(
          state,
          transformIntoDocuments(result, transformManageViewContestsItem),
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
