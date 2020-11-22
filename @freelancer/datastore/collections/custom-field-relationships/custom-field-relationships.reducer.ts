import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformCustomFieldRelationshipApi } from './custom-field-relationships.transformers';
import { CustomFieldRelationshipsCollection } from './custom-field-relationships.types';

export function customFieldRelationshipsReducer(
  state: CollectionStateSlice<CustomFieldRelationshipsCollection> = {},
  action: CollectionActions<CustomFieldRelationshipsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'customFieldRelationships') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<CustomFieldRelationshipsCollection>(
          state,
          transformIntoDocuments(
            result.relationships,
            transformCustomFieldRelationshipApi,
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
