import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  Reference,
  removeDocumentById,
  transformIntoDocuments,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import { DiscoverCollectionItemsCollection } from '../discover-collection-items/discover-collection-items.types';
import { transformDiscoverCollection } from './discover-collections.transformers';
import { DiscoverCollectionsCollection } from './discover-collections.types';

export function discoverCollectionsReducer(
  state: CollectionStateSlice<DiscoverCollectionsCollection> = {},
  action:
    | CollectionActions<DiscoverCollectionsCollection>
    | CollectionActions<DiscoverCollectionItemsCollection>,
) {
  switch (action.type) {
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'discoverCollections') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<DiscoverCollectionsCollection>(
          state,
          transformIntoDocuments([result], transformDiscoverCollection),
          ref,
        );
      }
      if (action.payload.type === 'discoverCollectionItems') {
        const { result } = action.payload;
        const ref: Reference<DiscoverCollectionsCollection> = {
          path: {
            collection: 'discoverCollections',
            authUid: action.payload.ref.path.authUid,
          },
        };
        const previewItem = result.thumbnail ? [result.thumbnail] : [];

        return updateWebsocketDocuments<DiscoverCollectionsCollection>(
          state,
          [result.collection_id],
          collection => ({
            ...collection,
            previewItems: [...previewItem, ...collection.previewItems],
            itemCount: collection.itemCount ? collection.itemCount + 1 : 1,
            // TODO: Add update lastUpdated field once D138982 is complete
          }),
          ref,
        );
      }
      return state;
    }
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'discoverCollections') {
        const { ref, result, order } = action.payload;
        return mergeDocuments<DiscoverCollectionsCollection>(
          state,
          transformIntoDocuments(
            result.collections,
            transformDiscoverCollection,
          ),
          order,
          ref,
        );
      }
      return state;
    }
    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'discoverCollections') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<DiscoverCollectionsCollection>(
          state,
          transformIntoDocuments([result], transformDiscoverCollection),
          ref,
        );
      }
      return state;
    }
    case 'API_DELETE_SUCCESS': {
      if (action.payload.type === 'discoverCollections') {
        const { originalDocument, ref } = action.payload;
        return removeDocumentById<DiscoverCollectionsCollection>(
          ref,
          state,
          originalDocument.id,
        );
      }

      if (action.payload.type === 'discoverCollectionItems') {
        const { originalDocument } = action.payload;
        const ref: Reference<DiscoverCollectionsCollection> = {
          path: {
            collection: 'discoverCollections',
            authUid: action.payload.ref.path.authUid,
          },
        };

        return updateWebsocketDocuments<DiscoverCollectionsCollection>(
          state,
          [originalDocument.collectionId],
          collection => ({
            ...collection,
            previewItems: collection.previewItems.slice(1),
            itemCount: collection.itemCount ? collection.itemCount - 1 : 0,
            // TODO: Add update lastUpdated field once D138982 is complete
          }),
          ref,
        );
      }

      return state;
    }
    default:
      return state;
  }
}
