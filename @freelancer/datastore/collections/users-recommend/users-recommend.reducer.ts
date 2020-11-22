import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  removeDocumentById,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformUsersRecommend } from './users-recommend.transformers';
import { UsersRecommendCollection } from './users-recommend.types';

export function usersRecommendReducer(
  state: CollectionStateSlice<UsersRecommendCollection> = {},
  action: CollectionActions<UsersRecommendCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'usersRecommend') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<UsersRecommendCollection>(
          state,
          transformIntoDocuments(
            result.user_recommendations,
            transformUsersRecommend,
          ),
          order,
          ref,
        );
      }
      return state;
    }

    case 'API_PUSH': {
      if (action.payload.type === 'usersRecommend') {
        const { document: object, ref } = action.payload;

        return mergeWebsocketDocuments<UsersRecommendCollection>(
          state,
          transformIntoDocuments([object], u => ({ ...u, date: Date.now() })),
          ref,
        );
      }
      return state;
    }

    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'usersRecommend') {
        const { result, ref } = action.payload;

        return mergeWebsocketDocuments<UsersRecommendCollection>(
          state,
          transformIntoDocuments(
            [result.user_recommendation],
            transformUsersRecommend,
          ),
          ref,
        );
      }
      return state;
    }

    case 'API_PUSH_ERROR': {
      if (action.payload.type === 'usersRecommend') {
        const { document: object, ref } = action.payload;

        return removeDocumentById<UsersRecommendCollection>(
          ref,
          state,
          object.id,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
