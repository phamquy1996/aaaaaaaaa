import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  removeDocumentById,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformPostJobPageFormState } from './post-job-page-form-state.transformers';
import { PostJobPageFormStateCollection } from './post-job-page-form-state.types';

export function postJobPageFormStateReducer(
  state: CollectionStateSlice<PostJobPageFormStateCollection> = {},
  action: CollectionActions<PostJobPageFormStateCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'postJobPageFormState') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<PostJobPageFormStateCollection>(
          state,
          transformIntoDocuments(result, transformPostJobPageFormState),
          order,
          ref,
        );
      }
      return state;
    }
    case 'API_PUSH_SUCCESS':
    case 'API_SET_SUCCESS':
    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'postJobPageFormState') {
        const { ref, result } = action.payload;
        return mergeWebsocketDocuments<PostJobPageFormStateCollection>(
          state,
          transformIntoDocuments(result, transformPostJobPageFormState),
          ref,
        );
      }
      return state;
    }
    case 'API_DELETE_SUCCESS': {
      if (action.payload.type === 'postJobPageFormState') {
        const { originalDocument, ref } = action.payload;
        return removeDocumentById<PostJobPageFormStateCollection>(
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
