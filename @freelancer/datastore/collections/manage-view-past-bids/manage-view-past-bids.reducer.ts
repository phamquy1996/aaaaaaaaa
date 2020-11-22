import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformManageViewPastBidsItem } from './manage-view-past-bids.transformers';
import { ManageViewPastBidsCollection } from './manage-view-past-bids.types';

export function manageViewPastBidsReducer(
  state: CollectionStateSlice<ManageViewPastBidsCollection> = {},
  action: CollectionActions<ManageViewPastBidsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'manageViewPastBids') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ManageViewPastBidsCollection>(
          state,
          transformIntoDocuments(result, transformManageViewPastBidsItem),
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
