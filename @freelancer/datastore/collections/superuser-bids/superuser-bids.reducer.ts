import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformBid } from '../bids/bids.transformers';
import { SuperuserBidsCollection } from './superuser-bids.types';

export function superuserBidsReducer(
  state: CollectionStateSlice<SuperuserBidsCollection> = {},
  action: CollectionActions<SuperuserBidsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'superuserBids') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SuperuserBidsCollection>(
          state,
          transformIntoDocuments(result.bids, transformBid),
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
