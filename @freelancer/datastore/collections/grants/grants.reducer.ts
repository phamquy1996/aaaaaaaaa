import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformGrant } from './grants.transformers';
import { GrantsCollection } from './grants.types';

export function grantsReducer(
  state: CollectionStateSlice<GrantsCollection> = {},
  action: CollectionActions<GrantsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS':
      if (action.payload.type === 'grants') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<GrantsCollection>(
          state,
          transformIntoDocuments(result.grants, transformGrant),
          order,
          ref,
        );
      }
      return state;
    default:
      return state;
  }
}
