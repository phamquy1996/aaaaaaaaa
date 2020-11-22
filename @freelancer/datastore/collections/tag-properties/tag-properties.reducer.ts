import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { tansformTagProperty } from './tag-properties.transformers';
import { TagPropertiesCollection } from './tag-properties.types';

export function tagPropertiesReducer(
  state: CollectionStateSlice<TagPropertiesCollection> = {},
  action: CollectionActions<TagPropertiesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'tagProperties') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<TagPropertiesCollection>(
          state,
          transformIntoDocuments(result, tansformTagProperty, ref.path.authUid),
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
