import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  Reference,
  removeDocumentById,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformVerificationFile } from './verification-files.transformers';
import { VerificationFilesCollection } from './verification-files.types';

export function verificationFilesReducer(
  state: CollectionStateSlice<VerificationFilesCollection> = {},
  action: CollectionActions<VerificationFilesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'verificationFiles') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<VerificationFilesCollection>(
          state,
          transformIntoDocuments(result, transformVerificationFile),
          order,
          ref,
        );
      }
      return state;
    }

    case 'API_DELETE_SUCCESS': {
      if (action.payload.type === 'verificationFiles') {
        const { originalDocument, ref } = action.payload;
        return removeDocumentById<VerificationFilesCollection>(
          ref,
          state,
          originalDocument.id,
        );
      }
      return state;
    }

    case 'WS_MESSAGE': {
      const ref: Reference<VerificationFilesCollection> = {
        path: {
          collection: 'verificationFiles',
          authUid: action.payload.toUserId,
        },
      };

      if (action.payload.parent_type === 'notifications') {
        switch (action.payload.type) {
          case 'verificationRequestRejected': {
            const { verificationFileIds } = action.payload.data;
            return verificationFileIds.reduce(
              (nextState, id) =>
                removeDocumentById<VerificationFilesCollection>(
                  ref,
                  nextState,
                  id,
                ),
              state,
            );
          }
          default:
            return state;
        }
      }
      return state;
    }

    default:
      return state;
  }
}
