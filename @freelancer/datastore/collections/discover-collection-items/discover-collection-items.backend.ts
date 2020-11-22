import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import { DiscoverCollectionItemsCollection } from './discover-collection-items.types';

export function discoverCollectionItemsBackend(): Backend<
  DiscoverCollectionItemsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => {
      const contextQueryParm = getQueryParamValue(query, 'context');
      const contextIds = contextQueryParm.map(
        context => `${context.type}-${context.itemId}`,
      );

      const collectionId = getQueryParamValue(query, 'collectionId');

      if (collectionId.length === 1) {
        return {
          endpoint: `users/0.1/discover_collections/${collectionId}/discover_collection_items`,
          params: {
            collection_id: getQueryParamValue(query, 'collectionId')[0],
            context_ids: contextIds,
          },
        };
      }

      if (toNumber(authUid) !== 0) {
        return {
          endpoint: `users/0.1/users/${authUid}/discover_collection_items`,
          params: {
            context_ids: contextIds,
          },
        };
      }

      throw new Error(
        'You have not provided valid params to Discover Collections fetch',
      );
    },
    push: (_, discoverCollectionItems) => ({
      endpoint: `users/0.1/discover_collections/${discoverCollectionItems.collectionId}/discover_collection_items`,
      payload: {
        collection_id: discoverCollectionItems.collectionId,
        item_id: discoverCollectionItems.context.itemId,
        item_type: discoverCollectionItems.context.type,
      },
    }),
    set: undefined,
    update: undefined,
    remove: (authUid, collectionItemId, collectionItemObject) => {
      const { collectionId } = collectionItemObject;

      return {
        payload: {},
        endpoint: `users/0.1/discover_collections/${collectionId}/discover_collection_items/${collectionItemId}`,
        method: 'DELETE',
      };
    },
  };
}
