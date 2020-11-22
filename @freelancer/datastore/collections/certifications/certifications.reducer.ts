import {
  CollectionActions,
  CollectionStateSlice,
  deepSpread,
  mergeDocuments,
  mergeWebsocketDocuments,
  removeDocumentById,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformCertification } from './certifications.transformers';
import { CertificationsCollection } from './certifications.types';

export function certificationsReducer(
  state: CollectionStateSlice<CertificationsCollection> = {},
  action: CollectionActions<CertificationsCollection>,
) {
  switch (action.type) {
    case 'API_PUSH': {
      if (action.payload.type === 'certifications') {
        const { document: object, ref } = action.payload;
        return mergeWebsocketDocuments<CertificationsCollection>(
          state,
          transformIntoDocuments([object], o => o),
          ref,
        );
      }
      return state;
    }

    case 'API_PUSH_ERROR': {
      if (action.payload.type === 'certifications') {
        const { document: object, ref } = action.payload;
        return removeDocumentById(ref, state, object.id);
      }
      return state;
    }

    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'certifications') {
        const { document: object, result, ref } = action.payload;
        return mergeWebsocketDocuments<CertificationsCollection>(
          removeDocumentById(ref, state, object.id),
          transformIntoDocuments(
            [result.certification],
            transformCertification,
          ),
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE': {
      if (action.payload.type === 'certifications') {
        const { delta, ref, originalDocument } = action.payload;
        return mergeWebsocketDocuments<CertificationsCollection>(
          state,
          transformIntoDocuments([deepSpread(originalDocument, delta)], o => o),
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE_ERROR': {
      if (action.payload.type === 'certifications') {
        const { originalDocument, ref } = action.payload;
        return mergeWebsocketDocuments<CertificationsCollection>(
          state,
          transformIntoDocuments([originalDocument], o => o),
          ref,
        );
      }
      return state;
    }
    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'certifications') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<CertificationsCollection>(
          state,
          transformIntoDocuments(
            [result.certification],
            transformCertification,
          ),
          ref,
        );
      }
      return state;
    }

    case 'API_DELETE': {
      if (action.payload.type === 'certifications') {
        const { rawRequest, ref } = action.payload;
        return removeDocumentById(ref, state, rawRequest.certification_id);
      }
      return state;
    }

    case 'API_DELETE_ERROR': {
      if (action.payload.type === 'certifications') {
        const { originalDocument, ref } = action.payload;
        return mergeWebsocketDocuments<CertificationsCollection>(
          state,
          transformIntoDocuments([originalDocument], o => o),
          ref,
        );
      }
      return state;
    }

    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'certifications') {
        const { result, ref, order } = action.payload;

        if (result.certifications) {
          return mergeDocuments<CertificationsCollection>(
            state,
            transformIntoDocuments(
              result.certifications,
              transformCertification,
            ),
            order,
            ref,
          );
        }
      }

      return state;
    }

    default:
      return state;
  }
}
