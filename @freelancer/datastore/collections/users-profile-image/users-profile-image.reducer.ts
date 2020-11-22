import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformUsersProfileImage } from './users-profile-image.transformers';
import { UsersProfileImageCollection } from './users-profile-image.types';

export function usersProfileImageReducer(
  state: CollectionStateSlice<UsersProfileImageCollection> = {},
  action: CollectionActions<UsersProfileImageCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'usersProfileImage') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<UsersProfileImageCollection>(
          state,
          transformIntoDocuments(
            [result.profile_image_info],
            transformUsersProfileImage,
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
