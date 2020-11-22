import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformUserRequiresGdpr } from './user-requires-gdpr.transformer';
import { UserRequiresGdprCollection } from './user-requires-gdpr.types';

export function userRequiresGdprReducer(
  state: CollectionStateSlice<UserRequiresGdprCollection> = {},
  action: CollectionActions<UserRequiresGdprCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'userRequiresGdpr') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<UserRequiresGdprCollection>(
          state,
          transformIntoDocuments(
            [result],
            transformUserRequiresGdpr,
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
