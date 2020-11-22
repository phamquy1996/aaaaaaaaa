import {
  CollectionActions,
  CollectionStateSlice,
  deepSpread,
  mergeDocuments,
  mergeWebsocketDocuments,
  Reference,
  transformIntoDocuments,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import { getUsersSelfComputedFields } from '../users-self/users-self.transformers';
import { UsersSelfCollection } from '../users-self/users-self.types';
import {
  isBiddingProfileCompleted,
  transformUsersProfile,
} from './users-profile.transformers';
import { UsersProfileCollection } from './users-profile.types';

export function usersProfileReducer(
  state: CollectionStateSlice<UsersProfileCollection> = {},
  action:
    | CollectionActions<UsersProfileCollection>
    | CollectionActions<UsersSelfCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'usersProfile') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<UsersProfileCollection>(
          state,
          transformIntoDocuments([result], transformUsersProfile),
          order,
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'usersProfile') {
        const { delta, ref, originalDocument } = action.payload;
        const mergedDocument = deepSpread(originalDocument, delta);

        return mergeWebsocketDocuments<UsersProfileCollection>(
          state,
          transformIntoDocuments([mergedDocument], userProfile => ({
            ...userProfile,
            ...getUsersSelfComputedFields(
              userProfile.firstName,
              userProfile.lastName,
              userProfile.address,
              userProfile.dateOfBirth,
            ),
            biddingProfileCompleted: isBiddingProfileCompleted(userProfile),
          })),
          ref,
        );
      }

      if (action.payload.type === 'usersSelf') {
        const { delta, originalDocument } = action.payload;
        const ref: Reference<UsersProfileCollection> = {
          path: {
            collection: 'usersProfile',
            authUid: action.payload.ref.path.authUid,
          },
        };

        if (delta.hasLinkedEscrowComAccount) {
          return updateWebsocketDocuments<UsersProfileCollection>(
            state,
            [originalDocument.id],
            userProfile =>
              deepSpread(userProfile, {
                hasLinkedEscrowComAccount: delta.hasLinkedEscrowComAccount,
              }),
            ref,
          );
        }
      }

      return state;
    }

    default:
      return state;
  }
}
