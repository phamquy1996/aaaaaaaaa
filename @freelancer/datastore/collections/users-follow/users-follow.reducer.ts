import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  removeDocumentById,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformUsersFollow } from './users-follow.transformers';
import { UsersFollowCollection } from './users-follow.types';

export function usersFollowReducer(
  state: CollectionStateSlice<UsersFollowCollection> = {},
  action: CollectionActions<UsersFollowCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'usersFollow') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<UsersFollowCollection>(
          state,
          transformIntoDocuments(result.user_follows, transformUsersFollow),
          order,
          ref,
        );
      }
      return state;
    }

    case 'API_PUSH': {
      if (action.payload.type === 'usersFollow') {
        const { document: object, ref } = action.payload;

        return mergeWebsocketDocuments<UsersFollowCollection>(
          state,
          transformIntoDocuments([object], u => u),
          ref,
        );
      }
      return state;
    }

    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'usersFollow') {
        const { result, ref } = action.payload;

        return mergeWebsocketDocuments<UsersFollowCollection>(
          state,
          transformIntoDocuments([result.user_follow], transformUsersFollow),
          ref,
        );
      }
      return state;
    }

    case 'API_PUSH_ERROR': {
      if (action.payload.type === 'usersFollow') {
        const { document: object, ref } = action.payload;

        return removeDocumentById<UsersFollowCollection>(ref, state, object.id);
      }
      return state;
    }

    case 'API_DELETE': {
      if (action.payload.type === 'usersFollow') {
        const { originalDocument, ref } = action.payload;
        return removeDocumentById(ref, state, originalDocument.id);
      }
      return state;
    }

    case 'API_DELETE_SUCCESS': {
      if (action.payload.type === 'usersFollow') {
        const { originalDocument, ref } = action.payload;
        return removeDocumentById<UsersFollowCollection>(
          ref,
          state,
          originalDocument.id,
        );
      }
      return state;
    }

    case 'API_DELETE_ERROR': {
      if (action.payload.type === 'usersFollow') {
        const { originalDocument, ref } = action.payload;
        return mergeWebsocketDocuments<UsersFollowCollection>(
          state,
          transformIntoDocuments([originalDocument], o => o),
          ref,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
