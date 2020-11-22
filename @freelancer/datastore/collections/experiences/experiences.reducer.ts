import {
  CollectionActions,
  CollectionStateSlice,
  deepSpread,
  mergeDocuments,
  mergeWebsocketDocuments,
  removeDocumentById,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformExperience } from './experiences.transformers';
import { ExperiencesCollection } from './experiences.types';

export function experiencesReducer(
  state: CollectionStateSlice<ExperiencesCollection> = {},
  action: CollectionActions<ExperiencesCollection>,
) {
  switch (action.type) {
    case 'API_PUSH': {
      if (action.payload.type === 'experiences') {
        const { document: object, ref } = action.payload;
        return mergeWebsocketDocuments<ExperiencesCollection>(
          state,
          transformIntoDocuments([object], o => o),
          ref,
        );
      }
      return state;
    }

    case 'API_PUSH_ERROR': {
      if (action.payload.type === 'experiences') {
        const { document: object, ref } = action.payload;
        return removeDocumentById(ref, state, object.id);
      }
      return state;
    }

    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'experiences') {
        const { document: object, result, ref } = action.payload;
        return mergeWebsocketDocuments<ExperiencesCollection>(
          removeDocumentById(ref, state, object.id),
          transformIntoDocuments([result.experience], transformExperience),
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE': {
      if (action.payload.type === 'experiences') {
        const { delta, ref, originalDocument } = action.payload;
        return mergeWebsocketDocuments<ExperiencesCollection>(
          state,
          transformIntoDocuments([deepSpread(originalDocument, delta)], o => o),
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE_ERROR': {
      if (action.payload.type === 'experiences') {
        const { originalDocument, ref } = action.payload;
        return mergeWebsocketDocuments<ExperiencesCollection>(
          state,
          transformIntoDocuments([originalDocument], o => o),
          ref,
        );
      }
      return state;
    }
    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'experiences') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<ExperiencesCollection>(
          state,
          transformIntoDocuments([result.experience], transformExperience),
          ref,
        );
      }
      return state;
    }

    case 'API_DELETE': {
      if (action.payload.type === 'experiences') {
        const { rawRequest, ref } = action.payload;
        return removeDocumentById(ref, state, rawRequest.experience_id);
      }
      return state;
    }

    case 'API_DELETE_ERROR': {
      if (action.payload.type === 'experiences') {
        const { originalDocument, ref } = action.payload;
        return mergeWebsocketDocuments<ExperiencesCollection>(
          state,
          transformIntoDocuments([originalDocument], o => o),
          ref,
        );
      }
      return state;
    }

    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'experiences') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ExperiencesCollection>(
          state,
          transformIntoDocuments(result.experiences, transformExperience),
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
