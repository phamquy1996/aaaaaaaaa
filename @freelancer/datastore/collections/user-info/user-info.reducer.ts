import {
  CollectionActions,
  mergeDocuments,
  Reference,
  transformIntoDocuments,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import { transformUserInfo } from './user-info.transformers';
import { UserInfoCollection } from './user-info.types';

export function userInfoReducer(
  state = {},
  action: CollectionActions<UserInfoCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'userInfo') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<UserInfoCollection>(
          state,
          transformIntoDocuments([result], transformUserInfo),
          order,
          ref,
        );
      }
      return state;
    }

    case 'WS_MESSAGE': {
      const ref: Reference<UserInfoCollection> = {
        path: {
          collection: 'userInfo',
          authUid: action.payload.toUserId,
        },
      };

      if (action.payload.parent_type !== 'notifications') {
        return state;
      }

      switch (action.payload.type) {
        case 'profilePictureUpdate': {
          return updateWebsocketDocuments<UserInfoCollection>(
            state,
            [action.payload.toUserId],
            userInfo => ({
              ...userInfo,
              avatar: action.payload.data.avatar,
            }),
            ref,
          );
        }

        default:
          return state;
      }
    }

    default:
      return state;
  }
}
