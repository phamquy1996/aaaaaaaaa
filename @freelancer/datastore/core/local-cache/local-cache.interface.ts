import { isDefined } from '@freelancer/utils';
import { CollectionStateSlice, DatastoreCollectionType } from '..';

export const COLLECTION_CACHE_INTERFACE_VERSION = 1;

/**
 * An interface used by the cache to store a single collection of the store with the version hash.
 */
export interface CollectionSliceCache<C extends DatastoreCollectionType> {
  // ====================
  // Essential properties
  // ====================
  readonly collection: CollectionStateSlice<C>;
  // This hash only represents the format of the documents in the collection.
  readonly collectionJsonSchemaHash: string;
  // This version should be bumped on any change of this interface or
  // change of format within the datastore(including the interface of Query).
  readonly version: number;

  // =====================
  // Additional properties
  // =====================
  readonly webappBuildTimestamp?: number;
}

/**
 * Type guard for defensive checking to ensure that the object
 * retrieved from the storage conforms to the expected type and
 * contains all essential properties.
 */
export function isCollectionSliceCache<C extends DatastoreCollectionType>(
  obj: any,
): obj is CollectionSliceCache<C> {
  return (
    isDefined(obj) &&
    'version' in obj &&
    'collection' in obj &&
    'collectionJsonSchemaHash' in obj &&
    Object.values(obj.collection).every(
      (entry: any) =>
        isDefined(entry) && 'documents' in entry && 'queries' in entry,
    )
  );
}
