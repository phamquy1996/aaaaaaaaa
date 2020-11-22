import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  removeDocumentById,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformDiscoverCollectionItem } from './discover-collection-items.transformers';
import { DiscoverCollectionItemsCollection } from './discover-collection-items.types';

export function discoverCollectionItemsReducer(
  state: CollectionStateSlice<DiscoverCollectionItemsCollection> = {},
  action: CollectionActions<DiscoverCollectionItemsCollection>,
) {
  switch (action.type) {
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'discoverCollectionItems') {
        const { ref, result } = action.payload;
        return mergeWebsocketDocuments<DiscoverCollectionItemsCollection>(
          state,
          transformIntoDocuments([result], transformDiscoverCollectionItem),
          ref,
        );
      }
      return state;
    }
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'discoverCollectionItems') {
        const { ref, result, order } = action.payload;
        return mergeDocuments<DiscoverCollectionItemsCollection>(
          state,
          transformIntoDocuments(
            result.discover_collection_items,
            transformDiscoverCollectionItem,
          ),
          order,
          ref,
        );
      }
      return state;
    }
    case 'API_DELETE_SUCCESS': {
      if (action.payload.type === 'discoverCollectionItems') {
        const { originalDocument, ref } = action.payload;
        return removeDocumentById<DiscoverCollectionItemsCollection>(
          ref,
          state,
          originalDocument.id,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
