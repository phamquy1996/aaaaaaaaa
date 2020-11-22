import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformManageViewOpenBidsItem } from './manage-view-open-bids.transformers';
import { ManageViewOpenBidsCollection } from './manage-view-open-bids.types';

export function manageViewOpenBidsReducer(
  state: CollectionStateSlice<ManageViewOpenBidsCollection> = {},
  action: CollectionActions<ManageViewOpenBidsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'manageViewOpenBids') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ManageViewOpenBidsCollection>(
          state,
          transformIntoDocuments(result, transformManageViewOpenBidsItem),
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
