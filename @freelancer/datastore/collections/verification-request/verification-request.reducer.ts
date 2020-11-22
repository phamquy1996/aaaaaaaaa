import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  removeDocumentById,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformVerificationRequest } from './verification-request.transformers';
import { VerificationRequestCollection } from './verification-request.types';

export function verificationRequestReducer(
  state: CollectionStateSlice<VerificationRequestCollection> = {},
  action: CollectionActions<VerificationRequestCollection>,
) {
  switch (action.type) {
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'verificationRequest') {
        const { result, ref } = action.payload;

        return mergeWebsocketDocuments<VerificationRequestCollection>(
          state,
          transformIntoDocuments([result], transformVerificationRequest),
          ref,
        );
      }
      return state;
    }
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'verificationRequest') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<VerificationRequestCollection>(
          state,
          transformIntoDocuments([result], transformVerificationRequest),
          order,
          ref,
        );
      }

      return state;
    }
    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'verificationRequest') {
        const { ref, result } = action.payload;

        return mergeWebsocketDocuments<VerificationRequestCollection>(
          state,
          transformIntoDocuments([result], transformVerificationRequest),
          ref,
        );
      }

      return state;
    }
    case 'API_SET_SUCCESS': {
      if (action.payload.type === 'verificationRequest') {
        const { result, originalDocument, ref } = action.payload;

        const newState = removeDocumentById<VerificationRequestCollection>(
          ref,
          state,
          originalDocument.id,
        );

        return mergeWebsocketDocuments<VerificationRequestCollection>(
          newState,
          transformIntoDocuments([result], transformVerificationRequest),
          ref,
        );
      }
      return state;
    }
    case 'API_DELETE_SUCCESS': {
      if (action.payload.type === 'verificationRequest') {
        const { originalDocument, ref } = action.payload;
        return removeDocumentById<VerificationRequestCollection>(
          ref,
          state,
          originalDocument.id,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
