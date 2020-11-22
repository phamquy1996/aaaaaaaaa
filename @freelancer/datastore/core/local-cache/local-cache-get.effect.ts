import { isPlatformBrowser } from '@angular/common';
import { ErrorHandler, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { fromPairs } from '@freelancer/utils';
import { Storage } from '@ionic/storage';
import { Actions, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as Rx from 'rxjs';
import { delay, filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { isRequestDataAction, TypedAction } from '../actions';
import { isPlainDocumentRef, stringifyReference } from '../store.helpers';
import {
  DatastoreCollectionType,
  StoreState,
  UserCollectionStateSlice,
} from '../store.model';
import {
  getCurrentCollectionCacheVersion,
  getDatastoreCacheByCollectionType,
  getJsonSchemaHash,
} from './local-cache.helpers';

/**
 * In an event of a request-data action, fetch the requested state from the collection cache.
 */
@Injectable()
export class LocalCacheGetEffect {
  readonly effect$ = createEffect(
    () => (
      {
        scheduler,
      }: {
        scheduler: Rx.SchedulerLike;
      } = { scheduler: Rx.asyncScheduler },
    ) =>
      this.actions$.pipe(
        // Only serve for request-data action on browser.
        filter(() => isPlatformBrowser(this.platformId)),
        filter(isRequestDataAction),
        map(action => action.payload),
        withLatestFrom(this.store$),
        // Check whether the requested document or query is missing
        // from the current store state.
        filter(([requestDataPayload, storeState]) => {
          const {
            ref,
            ref: {
              path: { collection, authUid, ids: requestedIds },
            },
          } = requestDataPayload;

          const userStateSlice = storeState[collection]?.[authUid];
          // User state slice does not exist.
          if (!userStateSlice) {
            return true;
          }

          const queryString = stringifyReference(ref);
          const docIdsInStore = new Set(Object.keys(userStateSlice.documents));
          return (
            // The request is for a query that do not exist.
            (!isPlainDocumentRef(ref) &&
              !userStateSlice.queries[queryString]) ||
            // The request is for documents that do not exist.
            (!!requestedIds && requestedIds.some(id => !docIdsInStore.has(id)))
          );
        }),
        // FIXME
        // This is a temporary solution to prevent the `ExpressionChangedAfterItHasBeenChecked` error
        // in some components (eg. NavigationComponent and MessagingInboxChatComponent) which contains
        // a child that changes the parent's data. It is caused by an update to the datastore in the
        // middle of the view generation process.
        delay(0, scheduler),
        mergeMap(([requestDataPayload, _]) => {
          const {
            type: collectionType,
            ref,
            ref: {
              path: { authUid, ids: requestedDocIds },
            },
          } = requestDataPayload;

          // Retrieve the cached object from session storage by the key.
          return getDatastoreCacheByCollectionType(
            collectionType,
            this.storage,
            this.errorHandler,
          ).pipe(
            map(cachedCollectionState => ({
              cachedCollectionState,
              collectionType,
              authUid,
              requestedDocIds,
              requestDataPayload,
              ref,
            })),
          );
        }),
        mergeMap(
          ({
            cachedCollectionState,
            collectionType,
            authUid,
            requestedDocIds,
            requestDataPayload,
            ref,
          }) => {
            if (
              // Ensure the object exist.
              !cachedCollectionState ||
              // Ensure the schema of collection in the cache is of the same
              // type as defined in the interface, because it is possible that
              // the data saved in session storage is of a different type than
              // is now expected (as the transformed models have changed).
              cachedCollectionState.version !==
                getCurrentCollectionCacheVersion() ||
              cachedCollectionState.collectionJsonSchemaHash !==
                getJsonSchemaHash(collectionType)
            ) {
              // Cache miss.
              return Rx.EMPTY;
            }

            const userCollectionStateSlice =
              cachedCollectionState?.collection[authUid];
            // Ensure the user collection state slice is in the collection.
            if (!userCollectionStateSlice) {
              // Cache miss.
              return Rx.EMPTY;
            }

            // =========================
            // Handle documents request.
            // =========================

            if (isPlainDocumentRef(ref)) {
              return Rx.of({
                type: 'LOCAL_CACHE_FETCH_SUCCESS' as const,
                payload: {
                  type: requestDataPayload.type,
                  ref: requestDataPayload.ref,
                  cachedState: {
                    documents: this.getRequestedDocs(
                      userCollectionStateSlice,
                      requestedDocIds ?? [],
                    ),
                    queries: {},
                  },
                },
              });
            }

            // =====================
            // Handle query request.
            // =====================

            // Based on the payload from the request-data action,
            // extract the requested query and document IDs from the collection cache slice.
            const queryString = stringifyReference(ref);
            const cachedQueryResult =
              userCollectionStateSlice.queries[queryString];

            // Report cache miss when the user requested a query
            // but we couldn't find it in the cache.
            if (!cachedQueryResult) {
              // Cache miss.
              return Rx.EMPTY;
            }

            const docIdsInCachedQuery = cachedQueryResult?.ids ?? [];
            // Apart from the requested document IDs, we also have to include the
            // documents referenced by the query.
            const docIdsToFetch = new Set([
              ...(requestedDocIds ?? []),
              ...docIdsInCachedQuery,
            ]);
            const documents = this.getRequestedDocs(
              userCollectionStateSlice,
              Array.from(docIdsToFetch),
            );

            // A defensive check to ensure all the documents
            // referenced by the query is included.
            if (
              cachedQueryResult &&
              docIdsInCachedQuery.some(id => !documents[id])
            ) {
              // Cache miss.
              return Rx.EMPTY;
            }

            // In the event of cache hit, emit a LOCAL_CACHE_FETCH_SUCCESS action
            // to trigger the datastore hydration meta reducer which update the store.
            return Rx.of({
              type: 'LOCAL_CACHE_FETCH_SUCCESS' as const,
              payload: {
                type: requestDataPayload.type,
                ref: requestDataPayload.ref,
                cachedState: {
                  queries: { [queryString]: cachedQueryResult },
                  documents,
                },
              },
            });
          },
        ),
      ),
  );

  constructor(
    private actions$: Actions<TypedAction>,
    private store$: Store<StoreState>,
    private errorHandler: ErrorHandler,
    private storage: Storage,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  getRequestedDocs<C extends DatastoreCollectionType>(
    userCollectionStateSlice: UserCollectionStateSlice<C>,
    docIdsToFetch: ReadonlyArray<string>,
  ) {
    return fromPairs(
      docIdsToFetch
        .map(id => [id, userCollectionStateSlice.documents[id]] as const)
        .filter(([, docInCache]) => !!docInCache),
    );
  }
}
