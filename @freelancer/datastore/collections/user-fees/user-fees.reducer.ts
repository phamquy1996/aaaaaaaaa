import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformUserFees } from './user-fees.transformers';
import { UserFeesCollection } from './user-fees.types';

export function userFeesReducer(
  state: CollectionStateSlice<UserFeesCollection> = {},
  action: CollectionActions<UserFeesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'userFees') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<UserFeesCollection>(
          state,
          transformIntoDocuments(result.user_fees, transformUserFees),
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
