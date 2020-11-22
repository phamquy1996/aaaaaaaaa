import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformUserBidLimit } from './user-bid-limit.transformers';
import { UserBidLimitCollection } from './user-bid-limit.types';

export function userBidLimitReducer(
  state: CollectionStateSlice<UserBidLimitCollection> = {},
  action: CollectionActions<UserBidLimitCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'userBidLimit') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<UserBidLimitCollection>(
          state,
          transformIntoDocuments(
            [result],
            transformUserBidLimit,
            ref.path.authUid,
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
