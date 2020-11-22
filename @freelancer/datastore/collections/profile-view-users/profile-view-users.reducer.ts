import {
  CollectionActions,
  deepSpread,
  mergeDocuments,
  mergeWebsocketDocuments,
  Path,
  pluckDocumentFromRawStoreCollectionState,
  transformIntoDocuments,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import { UsersRecommendCollection } from '../users-recommend/users-recommend.types';
import { transformProfileViewUsers } from './profile-view-users.transformers';
import { ProfileViewUsersCollection } from './profile-view-users.types';

export function profileViewUsersReducer(
  state = {},
  action:
    | CollectionActions<ProfileViewUsersCollection>
    | CollectionActions<UsersRecommendCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'profileViewUsers') {
        const { result, ref, order } = action.payload;

        return mergeDocuments<ProfileViewUsersCollection>(
          state,
          transformIntoDocuments(result.users, transformProfileViewUsers),
          order,
          ref,
        );
      }

      return state;
    }

    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'usersRecommend') {
        const { rawRequest, ref, result } = action.payload;

        const userId = rawRequest.user_to_recommend;

        const profileViewUserRef: Path<ProfileViewUsersCollection> = {
          collection: 'profileViewUsers',
          authUid: ref.path.authUid,
        };

        const profileViewUser = pluckDocumentFromRawStoreCollectionState(
          state,
          profileViewUserRef,
          userId,
        );

        if (!profileViewUser) {
          return state;
        }

        return mergeWebsocketDocuments<ProfileViewUsersCollection>(
          state,
          transformIntoDocuments([userId], () =>
            deepSpread(profileViewUser, {
              recommendations:
                result.recommendation_count || profileViewUser.recommendations,
            }),
          ),
          { path: profileViewUserRef },
        );
      }

      return state;
    }

    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'profileViewUsers') {
        const { delta, originalDocument, ref } = action.payload;
        const userId = originalDocument.id.toString();
        const profileViewUser = pluckDocumentFromRawStoreCollectionState(
          state,
          ref.path,
          userId,
        );
        if (!profileViewUser) {
          throw new Error('User being updated is missing in the store');
        }
        return mergeWebsocketDocuments<ProfileViewUsersCollection>(
          state,
          transformIntoDocuments([userId], () =>
            deepSpread(profileViewUser, delta),
          ),
          ref,
        );
      }
      return state;
    }

    case 'WS_MESSAGE': {
      const userId = action.payload.toUserId;
      const ref = {
        path: { collection: 'profileViewUsers', authUid: userId },
      };
      if (action.payload.type === 'emailVerified') {
        return updateWebsocketDocuments<ProfileViewUsersCollection>(
          state,
          [userId],
          profileViewUser =>
            deepSpread(profileViewUser, {
              status: { emailVerified: true },
            }),
          ref,
        );
      }
      if (action.payload.type === 'profilePictureUpdate') {
        return updateWebsocketDocuments<ProfileViewUsersCollection>(
          state,
          [userId],
          user => ({
            ...user,
            avatarLarge: action.payload.data.avatarLarge,
          }),
          ref,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
