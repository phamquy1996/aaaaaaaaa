import {
  CollectionActions,
  CollectionStateSlice,
  getQueryParamValue,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformVerificationAddressDocumentTypes } from './verification-address-document-types.transformers';
import { VerificationAddressDocumentTypesCollection } from './verification-address-document-types.types';

export function verificationAddressDocumentTypesReducer(
  state: CollectionStateSlice<VerificationAddressDocumentTypesCollection> = {},
  action: CollectionActions<VerificationAddressDocumentTypesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'verificationAddressDocumentTypes') {
        const { result, ref, order } = action.payload;
        const countryCode = getQueryParamValue(ref.query, 'countryCode')[0];
        return mergeDocuments<VerificationAddressDocumentTypesCollection>(
          state,
          transformIntoDocuments(
            result,
            transformVerificationAddressDocumentTypes,
            countryCode,
          ),
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
