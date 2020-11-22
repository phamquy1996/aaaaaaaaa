import { DiscoverCollectionApi } from 'api-typings/users/users';
import { DiscoverCollection } from './discover-collections.model';

export function transformDiscoverCollection(
  collection: DiscoverCollectionApi,
): DiscoverCollection {
  // Update API to reflect this in the future. T132035
  if (collection.count === undefined || collection.count === null) {
    throw new Error('Collection should always have an associated itemCount');
  }

  return {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    ownerId: collection.owner_id,
    dateCreated: collection.date_created * 1000,
    lastUpdated: collection.last_updated * 1000,
    isPrivate: collection.is_private,
    type: collection.collection_type,
    previewItems: collection.preview_items ? collection.preview_items : [],
    itemCount: collection.count,
  };
}
