import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { DiscoverCollectionsCollection } from './discover-collections.types';

export function discoverCollectionsBackend(): Backend<
  DiscoverCollectionsCollection
> {
  return {
    defaultOrder: {
      field: 'lastUpdated',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => {
      const ownerIdParam = getQueryParamValue(query, 'ownerId');
      const collectionIds = ids || [];

      if (ownerIdParam.length) {
        return {
          endpoint: `users/0.1/users/${ownerIdParam[0]}/discover_collections/`,
          params: {
            collection_type: getQueryParamValue(query, 'type')[0],
          },
        };
      }

      if (collectionIds.length) {
        return {
          endpoint: `users/0.1/discover_collections`,
          params: {
            collection_ids: collectionIds,
          },
        };
      }

      throw new Error(
        'You cannot call the Discover Collections fetch endpoint without params',
      );
    },
    push: (_, discoverCollection) => ({
      endpoint: 'users/0.1/discover_collections',
      isGaf: false,
      payload: {
        name: discoverCollection.name,
        description: discoverCollection.description,
        collection_type: discoverCollection.type,
      },
    }),
    set: undefined,
    update: (authUid, delta, document) => {
      if (delta.name === undefined) {
        throw new Error('Name is required');
      }

      return {
        endpoint: `users/0.1/discover_collections/${document.id}`,
        method: 'PUT',
        payload: {
          name: delta.name,
          description:
            delta.description === undefined
              ? document.description
              : delta.description,
        },
      };
    },
    remove: (authUid, discoverCollectionId) => ({
      endpoint: `users/0.1/discover_collections/${discoverCollectionId}`,
      method: 'DELETE',
      payload: {},
    }),
  };
}
