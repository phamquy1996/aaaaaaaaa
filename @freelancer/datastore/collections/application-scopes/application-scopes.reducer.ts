import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformApplicationScopes } from './application-scopes.transformers';
import { ApplicationScopesCollection } from './application-scopes.types';

export function applicationScopesReducer(
  state: CollectionStateSlice<ApplicationScopesCollection> = {},
  action: CollectionActions<ApplicationScopesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'applicationScopes') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ApplicationScopesCollection>(
          state,
          transformIntoDocuments(result.scopes, transformApplicationScopes),
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
