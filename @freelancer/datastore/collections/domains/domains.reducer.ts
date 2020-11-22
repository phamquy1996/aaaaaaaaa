import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformDomain } from './domains.transformers';
import { DomainsCollection } from './domains.types';

export function domainsReducer(
  state: CollectionStateSlice<DomainsCollection> = {},
  action: CollectionActions<DomainsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'domains') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<DomainsCollection>(
          state,
          transformIntoDocuments(result.domains, transformDomain),
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
