import {
  CollectionActions,
  CollectionStateSlice,
  getQueryParamValue,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformVerificationIdType } from './verification-id-types.transformers';
import { VerificationIdTypesCollection } from './verification-id-types.types';

export function verificationIdTypeReducer(
  state: CollectionStateSlice<VerificationIdTypesCollection> = {},
  action: CollectionActions<VerificationIdTypesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'verificationIdTypes') {
        const { result, ref, order } = action.payload;
        const countryCode = getQueryParamValue(ref.query, 'countryCode')[0];

        return mergeDocuments<VerificationIdTypesCollection>(
          state,
          transformIntoDocuments(
            result,
            transformVerificationIdType,
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
