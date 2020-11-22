import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformTag } from './tags.transformers';
import { TagsCollection } from './tags.types';

export function tagsReducer(
  state: CollectionStateSlice<TagsCollection> = {},
  action: CollectionActions<TagsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'tags') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<TagsCollection>(
          state,
          transformIntoDocuments(result, transformTag),
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
