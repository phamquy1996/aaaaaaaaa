import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformShowcaseSource } from './showcase-source.transformers';
import { ShowcaseSourceCollection } from './showcase-source.types';

export function showcaseSourceReducer(
  state: CollectionStateSlice<ShowcaseSourceCollection> = {},
  action: CollectionActions<ShowcaseSourceCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'showcaseSource') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ShowcaseSourceCollection>(
          state,
          transformIntoDocuments(result, transformShowcaseSource),
          order,
          ref,
        );
      }
      return state;
    }

    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'showcaseSource') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<ShowcaseSourceCollection>(
          state,
          transformIntoDocuments([result], transformShowcaseSource),
          ref,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
