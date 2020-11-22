import {
  CollectionActions,
  CollectionStateSlice,
  deepSpread,
  mergeDocuments,
  mergeWebsocketDocuments,
  removeDocumentById,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformEducation } from './educations.transformers';
import { EducationsCollection } from './educations.types';

export function educationsReducer(
  state: CollectionStateSlice<EducationsCollection> = {},
  action: CollectionActions<EducationsCollection>,
) {
  switch (action.type) {
    case 'API_PUSH': {
      if (action.payload.type === 'educations') {
        const { document: object, ref } = action.payload;
        return mergeWebsocketDocuments<EducationsCollection>(
          state,
          transformIntoDocuments([object], o => o),
          ref,
        );
      }
      return state;
    }

    case 'API_PUSH_ERROR': {
      if (action.payload.type === 'educations') {
        const { document: object, ref } = action.payload;
        return removeDocumentById(ref, state, object.id);
      }
      return state;
    }

    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'educations') {
        const { document: object, result, ref } = action.payload;
        const newState = mergeWebsocketDocuments<EducationsCollection>(
          removeDocumentById(ref, state, object.id),
          transformIntoDocuments([result.education], transformEducation),
          ref,
        );
        return newState;
      }
      return state;
    }

    case 'API_UPDATE': {
      if (action.payload.type === 'educations') {
        const { delta, ref, originalDocument } = action.payload;
        return mergeWebsocketDocuments<EducationsCollection>(
          state,
          transformIntoDocuments([deepSpread(originalDocument, delta)], o => o),
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE_ERROR': {
      if (action.payload.type === 'educations') {
        const { originalDocument, ref } = action.payload;
        return mergeWebsocketDocuments<EducationsCollection>(
          state,
          transformIntoDocuments([originalDocument], o => o),
          ref,
        );
      }
      return state;
    }
    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'educations') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<EducationsCollection>(
          state,
          transformIntoDocuments([result.education], transformEducation),
          ref,
        );
      }
      return state;
    }

    case 'API_DELETE': {
      if (action.payload.type === 'educations') {
        const { originalDocument, ref } = action.payload;
        return removeDocumentById(ref, state, originalDocument.id);
      }
      return state;
    }

    case 'API_DELETE_ERROR': {
      if (action.payload.type === 'educations') {
        const { originalDocument, ref } = action.payload;
        return mergeWebsocketDocuments<EducationsCollection>(
          state,
          transformIntoDocuments([originalDocument], o => o),
          ref,
        );
      }
      return state;
    }

    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'educations') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<EducationsCollection>(
          state,
          transformIntoDocuments(result.educations, transformEducation),
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
