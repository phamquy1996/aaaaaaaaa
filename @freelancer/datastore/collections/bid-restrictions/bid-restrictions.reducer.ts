import {
  CollectionActions,
  CollectionStateSlice,
  getQueryParamValue,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformBidRestrictions } from './bid-restrictions.transformers';
import { BidRestrictionsCollection } from './bid-restrictions.types';

export function bidRestrictionsReducer(
  state: CollectionStateSlice<BidRestrictionsCollection> = {},
  action: CollectionActions<BidRestrictionsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'bidRestrictions') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<BidRestrictionsCollection>(
          state,
          transformIntoDocuments(
            [result],
            transformBidRestrictions,
            [
              ...(ref.path.ids || []),
              ...getQueryParamValue(ref.query, 'id'),
            ][0],
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
