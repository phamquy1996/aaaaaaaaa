import { DiscoverCollectionItemApi } from 'api-typings/users/users';
import { DiscoverCollectionItem } from './discover-collection-items.model';

export function transformDiscoverCollectionItem(
  collectionItem: DiscoverCollectionItemApi,
): DiscoverCollectionItem {
  return {
    id: collectionItem.id,
    name: collectionItem.name,
    description: collectionItem.description ? collectionItem.description : '',
    collectionId: collectionItem.collection_id,
    context: {
      itemId: collectionItem.item_id,
      type: collectionItem.item_type,
    },
    order: collectionItem.order,
    url: collectionItem.url,
    thumbnail: collectionItem.thumbnail ? collectionItem.thumbnail : '',
  };
}
