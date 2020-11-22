import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  removeDocumentById,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformShowcase } from './showcase.transformers';
import { ShowcaseCollection } from './showcase.types';

export function showcaseReducer(
  state: CollectionStateSlice<ShowcaseCollection> = {},
  action: CollectionActions<ShowcaseCollection>,
) {
  switch (action.type) {
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'showcase') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<ShowcaseCollection>(
          state,
          transformIntoDocuments([result], transformShowcase),
          ref,
        );
      }
      return state;
    }

    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'showcase') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ShowcaseCollection>(
          state,
          transformIntoDocuments(result.showcases, transformShowcase),
          order,
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'showcase') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<ShowcaseCollection>(
          state,
          transformIntoDocuments([result], transformShowcase),
          ref,
        );
      }
      return state;
    }

    case 'API_DELETE_SUCCESS': {
      if (action.payload.type === 'showcase') {
        const { originalDocument, ref } = action.payload;
        return removeDocumentById<ShowcaseCollection>(
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
