import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformManageViewOngoingBidsItem } from './manage-view-ongoing-bids.transformers';
import { ManageViewOngoingBidsCollection } from './manage-view-ongoing-bids.types';

export function manageViewOngoingBidsReducer(
  state: CollectionStateSlice<ManageViewOngoingBidsCollection> = {},
  action: CollectionActions<ManageViewOngoingBidsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'manageViewOngoingBids') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ManageViewOngoingBidsCollection>(
          state,
          transformIntoDocuments(result, transformManageViewOngoingBidsItem),
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
