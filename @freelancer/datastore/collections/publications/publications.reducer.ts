import {
  CollectionActions,
  CollectionStateSlice,
  deepSpread,
  mergeDocuments,
  mergeWebsocketDocuments,
  removeDocumentById,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformPublication } from './publications.transformers';
import { PublicationsCollection } from './publications.types';

export function publicationsReducer(
  state: CollectionStateSlice<PublicationsCollection> = {},
  action: CollectionActions<PublicationsCollection>,
) {
  switch (action.type) {
    case 'API_PUSH': {
      if (action.payload.type === 'publications') {
        const { document: object, ref } = action.payload;
        return mergeWebsocketDocuments<PublicationsCollection>(
          state,
          transformIntoDocuments([object], o => o),
          ref,
        );
      }
      return state;
    }

    case 'API_PUSH_ERROR': {
      if (action.payload.type === 'publications') {
        const { document: object, ref } = action.payload;
        return removeDocumentById(ref, state, object.id);
      }
      return state;
    }

    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'publications') {
        const { document: object, result, ref } = action.payload;
        return mergeWebsocketDocuments<PublicationsCollection>(
          removeDocumentById(ref, state, object.id),
          transformIntoDocuments([result.publication], transformPublication),
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE': {
      if (action.payload.type === 'publications') {
        const { delta, ref, originalDocument } = action.payload;
        return mergeWebsocketDocuments<PublicationsCollection>(
          state,
          transformIntoDocuments([deepSpread(originalDocument, delta)], o => o),
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE_ERROR': {
      if (action.payload.type === 'publications') {
        const { originalDocument, ref } = action.payload;
        return mergeWebsocketDocuments<PublicationsCollection>(
          state,
          transformIntoDocuments([originalDocument], o => o),
          ref,
        );
      }
      return state;
    }
    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'publications') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<PublicationsCollection>(
          state,
          transformIntoDocuments([result.publication], transformPublication),
          ref,
        );
      }
      return state;
    }

    case 'API_DELETE': {
      if (action.payload.type === 'publications') {
        const { rawRequest, ref } = action.payload;
        return removeDocumentById(ref, state, rawRequest.publication_id);
      }
      return state;
    }

    case 'API_DELETE_ERROR': {
      if (action.payload.type === 'publications') {
        const { originalDocument, ref } = action.payload;
        return mergeWebsocketDocuments<PublicationsCollection>(
          state,
          transformIntoDocuments([originalDocument], o => o),
          ref,
        );
      }
      return state;
    }

    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'publications') {
        const { result, ref, order } = action.payload;

        return mergeDocuments<PublicationsCollection>(
          state,
          transformIntoDocuments(result.publications, transformPublication),
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
