import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformEncodedUrl } from './encoded-url.transformers';
import { EncodedUrlCollection } from './encoded-url.types';

export function encodedUrlReducer(
  state: CollectionStateSlice<EncodedUrlCollection> = {},
  action: CollectionActions<EncodedUrlCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'encodedUrl') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<EncodedUrlCollection>(
          state,
          transformIntoDocuments([result], transformEncodedUrl),
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
