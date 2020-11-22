import { ErrorHandler } from '@angular/core';
import { fromPairs } from '@freelancer/utils';
import { Storage } from '@ionic/storage';
import * as Rx from 'rxjs';
import { sessionStorageVersions } from '../collection-versions';
import {
  DatastoreCollectionType,
  UserCollectionStateSlice,
} from '../store.model';
import {
  CollectionSliceCache,
  COLLECTION_CACHE_INTERFACE_VERSION,
  isCollectionSliceCache,
} from './local-cache.interface';

export function generateStorageKey(collectionType: string): string {
  return `datastore_local_cache_${collectionType}`;
}

/**
 * Get the cached collection state slice from the session storage
 * for the given collection type.
 *
 * This returns an observable so we can test it with code that uses
 * marble diagrams. The issue appears to be with having virtual times
 * of marble diagrams with the definitely not-virtual-times of promises.
 * See the issues from a similar rx-marble library for more explanation:
 * - https://github.com/cartant/rxjs-marbles/issues/11
 * - https://github.com/cartant/rxjs-marbles/issues/71
 */
export function getDatastoreCacheByCollectionType<
  C extends DatastoreCollectionType
>(
  collectionType: string,
  storage: Storage,
  errorHandler: ErrorHandler,
): Rx.Observable<CollectionSliceCache<C> | undefined> {
  return Rx.from(
    storage
      .get(generateStorageKey(collectionType))
      .then(sessionStorageValue => {
        // Parse the JSON string from session storage.
        const cachedCollectionState =
          (!!sessionStorageValue && JSON.parse(sessionStorageValue)) ||
          undefined;

        return isCollectionSliceCache<C>(cachedCollectionState)
          ? cachedCollectionState
          : undefined;
      })
      .catch(err => {
        // In case of an error, catch it and forward it to the error handler.
        errorHandler.handleError(err);
        return undefined;
      }),
  );
}

/**
 * Store the given cache object into session storage by collection type.
 */
export function setDatastoreCacheByCollectionType<
  C extends DatastoreCollectionType
>(
  collectionType: string,
  cacheObj: CollectionSliceCache<C>,
  storage: Storage,
): Rx.Observable<void> {
  return Rx.from(
    storage
      .set(generateStorageKey(collectionType), JSON.stringify(cacheObj))
      .catch(err => {
        // Ignore the errors, e.g. quota is full or security error.
      }),
  );
}

/**
 * Merge the given documents and queries into the current user collection state slice by:
 *   - adding missing documents and queries if it is not already exist
 *   - updating existing documents or queries if a newer version is available
 *
 * @param currentUserCollectionSlice The current user collection state slice object.
 * @param docsAndQueriesToAdd Documents and queries which we would like to merge into the current slice.
 */
export function mergeUserCollectionStateSlice<
  C extends DatastoreCollectionType
>(
  currentUserCollectionSlice: UserCollectionStateSlice<C> = {
    queries: {},
    documents: {},
  },
  docsAndQueriesToAdd: UserCollectionStateSlice<C> = {
    queries: {},
    documents: {},
  },
): UserCollectionStateSlice<C> {
  return {
    queries: {
      ...currentUserCollectionSlice.queries,
      ...fromPairs(
        Object.entries(docsAndQueriesToAdd.queries).filter(
          ([queryString, query]) => {
            const queryInCollection =
              currentUserCollectionSlice.queries[queryString];
            return (
              // Does not currently exist.
              !queryInCollection ||
              // This query result is older than the current query result.
              query.timeUpdated >= queryInCollection.timeUpdated
            );
          },
        ),
      ),
    },
    documents: {
      ...currentUserCollectionSlice.documents,
      ...fromPairs(
        Object.entries(docsAndQueriesToAdd.documents).filter(([id, doc]) => {
          const docInCollection = currentUserCollectionSlice.documents[id];
          return (
            // Does not currently exist.
            !docInCollection ||
            // This document is older than the one currently in the collection.
            doc.timeUpdated >= docInCollection.timeUpdated
          );
        }),
      ),
    },
  };
}

export function getJsonSchemaHash(collectionType: string): string {
  return sessionStorageVersions[collectionType];
}

export function getWebappBuildTimestamp(): number | undefined {
  return window?.webapp?.version?.buildTimestamp;
}

export function getCurrentCollectionCacheVersion(): number {
  return COLLECTION_CACHE_INTERFACE_VERSION;
}
