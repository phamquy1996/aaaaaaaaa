import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformUserRequiresEmailVerification } from './user-requires-email-verification.transformer';
import { UserRequiresEmailVerificationCollection } from './user-requires-email-verification.types';

export function userRequiresEmailVerificationReducer(
  state: CollectionStateSlice<UserRequiresEmailVerificationCollection> = {},
  action: CollectionActions<UserRequiresEmailVerificationCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'userRequiresEmailVerification') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<UserRequiresEmailVerificationCollection>(
          state,
          transformIntoDocuments(
            [result],
            transformUserRequiresEmailVerification,
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
