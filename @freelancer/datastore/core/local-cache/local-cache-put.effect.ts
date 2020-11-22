import { isPlatformBrowser } from '@angular/common';
import {
  ErrorHandler,
  Inject,
  Injectable,
  NgZone,
  PLATFORM_ID,
} from '@angular/core';
import { Auth } from '@freelancer/auth';
import { fromPairs, isDefined } from '@freelancer/utils';
import { Storage } from '@ionic/storage';
import { Actions, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as Rx from 'rxjs';
import {
  bufferWhen,
  distinctUntilChanged,
  exhaustMap,
  filter,
  groupBy,
  map,
  mergeAll,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';
import { TypedAction } from '../actions';
import { LOGGED_OUT_KEY } from '../datastore.interface';
import { idle } from '../operators/idle';
import {
  DatastoreCollectionType,
  Documents,
  QueryResults,
  StoreState,
  UserCollectionStateSlice,
} from '../store.model';
import {
  getCurrentCollectionCacheVersion,
  getDatastoreCacheByCollectionType,
  getJsonSchemaHash,
  getWebappBuildTimestamp,
  mergeUserCollectionStateSlice,
  setDatastoreCacheByCollectionType,
} from './local-cache.helpers';
import { CollectionSliceCache } from './local-cache.interface';

/**
 * =========================
 * Per collection cache size
 * =========================
 *
 * From experiment, the datastore is roughly 1.14MB when there are
 *   - 941 documents referenced by a query,
 *   - 191 queries, and
 *   - 328 standalone documents

 * The size defined below aims to keep the total datastore size under the browser limits (generally 5-10MB),
 * so the user won't be prompt frequently for more disk space used by session storage.
 * The per collection cache size is deliberately scaled down to 1/4 of the 1.14MB total datastore size
 * based on the experiment result above.
 *
 * MAX_DOCS_FROM_QUERY: The maximum number of document which is referenced by a query.
 * MAX_QUERIES:         The maximum number of queries to be cached.
 * MAX_TOTAL_DOCS:      The maximum number of documents.
 */
const MAX_DOCS_FROM_QUERY = 250;
const MAX_QUERIES = 60;
const MAX_TOTAL_DOCS = MAX_DOCS_FROM_QUERY + 100;

/**
 * Listen to the API actions and cache the datastore into session storage asynchronously.
 */
@Injectable()
export class LocalCachePutEffect {
  readonly effect$: Rx.Observable<void> = createEffect(
    () =>
      this.actions$.pipe(
        // Only serve for browser.
        filter(() => isPlatformBrowser(this.platformId)),
        // Combine the latest store state with the incoming action.
        withLatestFrom(this.store$),
        map(([_, store]) => store),
        // Only process when there is an update to the store state.
        distinctUntilChanged(),
        // Convert the store into an array of collection type and
        // collection state slice pairs.
        map(store => Object.entries(store)),
        // The `mergeAll` operator flatten the array into a stream
        // of emits, that is made up of an emit per collection.
        mergeAll(),
        // The `groupBy` operator groups collection into
        // separate streams and finally merged back together
        // with the following `mergeMap` operator.
        // This allows different collection to be written
        // into the cache simultaneously.
        groupBy(
          ([collectionType]) => collectionType,
          ([, collection]) => collection,
        ),
        mergeMap(collection$ =>
          collection$.pipe(
            // Only process when there is an update to the collection.
            distinctUntilChanged(),
            // Combine with the auth state to get the userID.
            withLatestFrom(this.auth.authState$),
            map(([collection, authState]) => {
              const authUid = authState ? authState.userId : LOGGED_OUT_KEY;
              const userCollectionStateSlice = collection?.[authUid];
              return userCollectionStateSlice
                ? ([userCollectionStateSlice, authUid] as const)
                : undefined;
            }),
            // Ensure the user collection state slice exist.
            filter(isDefined),
            // Buffer the incoming user collection state slice until browser idle.
            bufferWhen(() => idle(this.ngZone)),
            // Extract the latest buffered value.
            map(bufferedValues => bufferedValues[bufferedValues.length - 1]),
            // Filter empty buffered values.
            filter(isDefined),
            // Use exhaustMap to ignore any new collection changes until
            // the idle callback is completed.
            exhaustMap(([userCollectionStateSlice, authUid]) =>
              this.cacheDocumentsAndQueries(
                collection$.key, // collection type
                authUid,
                userCollectionStateSlice,
              ),
            ),
          ),
        ),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions<TypedAction>,
    private auth: Auth,
    private errorHandler: ErrorHandler,
    private ngZone: NgZone,
    private storage: Storage,
    private store$: Store<StoreState>,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  /**
   * Add documents and queries to the session storage cache with
   * the Least Recently Used replacement policy applied based on
   * the `lastUpdated` timestamp.
   *
   * @param collectionType The collection type name that we are trying to cache.
   * @param authUid Either the current logged in user ID or the LOGGED_OUT_KEY.
   * @param docsAndQueries A set of documents and queries that we want to add to the cache.
   */
  cacheDocumentsAndQueries<C extends DatastoreCollectionType>(
    collectionType: string,
    authUid: string,
    docsAndQueries: UserCollectionStateSlice<C>,
  ): Rx.Observable<void> {
    return getDatastoreCacheByCollectionType<C>(
      collectionType,
      this.storage,
      this.errorHandler,
    ).pipe(
      mergeMap(currentCacheObj => {
        const currentWebappBuildTimestamp = getWebappBuildTimestamp();

        // The cached one is newer if the manually bumped version number is bigger,
        // or if the JSON schema hash is different and it was built more recently.
        const isCachedObjectNewerVersion =
          currentCacheObj &&
          (currentCacheObj.version > getCurrentCollectionCacheVersion() ||
            (currentCacheObj.collectionJsonSchemaHash !==
              getJsonSchemaHash(collectionType) &&
              (!currentWebappBuildTimestamp ||
                !currentCacheObj.webappBuildTimestamp ||
                currentCacheObj.webappBuildTimestamp >=
                  currentWebappBuildTimestamp)));

        // In case the collection JSON schema from the the cache is different
        // from expected and it is generated from a newer webapp build,
        // we will not update the datastore cache.
        if (isCachedObjectNewerVersion) {
          // Skip the datastore cache update.
          return Rx.of(undefined);
        }

        const validatedCacheObj =
          currentCacheObj &&
          currentCacheObj.version === getCurrentCollectionCacheVersion() &&
          currentCacheObj.collectionJsonSchemaHash ===
            getJsonSchemaHash(collectionType)
            ? currentCacheObj
            : // Overwrite the existing cached object if either the interface version
              // or JSON schema hash is incompatible, and from an older webapp build.
              undefined;

        // Combine the documents and queries to be added on top of the existing
        // user collection state slice in the cache. Ensuring the most up to
        // date version is retain in case of a conflict.
        const updatedUserCollectionStateSlice = mergeUserCollectionStateSlice(
          validatedCacheObj?.collection[authUid],
          docsAndQueries,
        );

        // Trim the size of the user collection state slice
        // so that it is under the limit defined above.
        const prunedUserCollectionStateSlice = this.pruneUserCollectionStateSlice(
          updatedUserCollectionStateSlice,
        );

        // Create a new object on top of the existing cached object.
        const newCacheObj: CollectionSliceCache<C> = {
          collection: {
            ...(validatedCacheObj?.collection ?? {}),
            [authUid]: prunedUserCollectionStateSlice,
          },
          collectionJsonSchemaHash: getJsonSchemaHash(collectionType),
          version: getCurrentCollectionCacheVersion(),
          webappBuildTimestamp: currentWebappBuildTimestamp,
        };

        // Store the current datastore state for the requested
        // collection into session storage as JSON string.
        return setDatastoreCacheByCollectionType(
          collectionType,
          newCacheObj,
          this.storage,
        );
      }),
    );
  }

  /**
   * Trimming the user collection state slice to be cached by evicting
   * the least recently updated documents or queries.
   */
  pruneUserCollectionStateSlice<C extends DatastoreCollectionType>(
    userCollectionStateSlice: UserCollectionStateSlice<C>,
  ): UserCollectionStateSlice<C> {
    // Reduce the size of the queries in this collection.
    const { queries, docIdsInQueries } = this.pruneQueries(
      userCollectionStateSlice.queries,
    );
    return {
      // Reduce the size of the documents in this collection.
      documents: this.pruneDocuments(
        userCollectionStateSlice.documents,
        // Regardless of the max limit of documents to be cached,
        // document with ID in this list should always be in the cache.
        docIdsInQueries,
      ),
      queries,
    };
  }

  /**
   * Given a set of documents, reduce the size of the set up to
   * the given limit based on the last updated time.
   *
   * @param essentialDocIds Document IDs that should always be included.
   */
  pruneDocuments<C extends DatastoreCollectionType>(
    docs: Documents<C['DocumentType']>,
    essentialDocIds: Set<C['DocumentType']['id']>,
    maxTotalDocs = MAX_TOTAL_DOCS,
  ): Documents<C['DocumentType']> {
    // The most recently updated docs that could be included (excluding the essential ones).
    const newestOtherDocs = Object.values(docs)
      .filter(doc => !essentialDocIds.has(doc.rawDocument.id))
      .sort((a, b) => b.timeUpdated - a.timeUpdated)
      .map(doc => doc.rawDocument.id);

    return fromPairs(
      [...Array.from(essentialDocIds), ...newestOtherDocs]
        .slice(0, maxTotalDocs)
        .map(id => [id, docs[id]]),
    );
  }

  /**
   * Given a set of queries, reduce the size of the set up to
   * the given limit based on the last updated time. The size
   * of the resulting set will be capped to the given number
   * of queries and number of documents within all queries.
   *
   * @return Queries and a list of documents referenced by it.
   */
  pruneQueries<C extends DatastoreCollectionType>(
    queries: QueryResults<C>,
    maxQueries = MAX_QUERIES,
    maxDocsFromQuery = MAX_DOCS_FROM_QUERY,
  ): {
    readonly queries: QueryResults<C>;
    readonly docIdsInQueries: Set<string>;
  } {
    let nQueries = 0;
    const docIdsInQueries = new Set<string>();
    const prunedQueries = fromPairs(
      // Sort the queries by the last updated time.
      Object.entries(queries)
        .sort(([, a], [, b]) => b.timeUpdated - a.timeUpdated)
        .filter(
          // Compute a list of queries such that the total number
          // of document reference in the `ids` property of the
          // query result object is under the limit of MAX_DOCS_FROM_QUERY.
          ([, query]) => {
            // Add query to the resulting list until we reached the size limit.
            if (
              nQueries < maxQueries &&
              docIdsInQueries.size + query.ids.length <= maxDocsFromQuery
            ) {
              nQueries += 1;
              // As a side effect, we extract the list of documents referenced
              // by a query. This set of documents should also be included in
              // the cached collection as we have decided to cached the query
              // that referenced it.
              query.ids.forEach(id => docIdsInQueries.add(id));
              return true;
            }
            return false;
          },
        ),
    );
    return {
      queries: prunedQueries,
      docIdsInQueries,
    };
  }
}
