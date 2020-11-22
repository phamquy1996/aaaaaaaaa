import { Inject, Injectable } from '@angular/core';
import { Auth, AuthState } from '@freelancer/auth';
import { Interface } from '@freelancer/types';
import { isDefined, toObservable } from '@freelancer/utils';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import * as Rx from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  publishReplay,
  refCount,
  startWith,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { RequestDataAction, RequestDataPayload, TypedAction } from './actions';
import { BackendPushResponse, StoreBackend } from './backend';
import { DatastoreCollection } from './datastore-collection';
import { DatastoreDocument } from './datastore-document';
import { LOGGED_OUT_KEY } from './datastore.interface';
import { arrayIsShallowEqual, setDiff } from './helpers';
import { DatastoreMissingModuleError } from './missing-module-error';
import { duplicateFirst } from './operators/duplicateFirst';
import { select } from './operators/select';
import {
  DocumentOptionsObject,
  DocumentQuery,
  emptyQueryObject,
  isDocumentOptionsObject,
  NullQuery,
  Query,
} from './query';
import { RequestDataConfig, REQUEST_DATA_CONFIG } from './request-data';
import {
  RequestError,
  requestStatusesEqual,
  RequestStatusHandler,
} from './request-status-handler.service';
import {
  flattenQuery,
  getEqualOrInIdsFromQuery,
  isIdQuery,
  isNullRef,
  removeEqualOrInIdsFromQuery,
  selectDocumentsForReference,
  stringifyReference,
} from './store.helpers';
import {
  ApproximateTotalCountType,
  DatastoreCollectionType,
  DatastoreFetchCollectionType,
  DatastorePushCollectionType,
  Path,
  PushDocumentType,
  QueryParam,
  QueryParams,
  Reference,
  StoreState,
  UserCollectionStateSlice,
} from './store.model';
import { WebSocketService } from './websocket';

@Injectable()
export class Datastore {
  constructor(
    private store$: Store<StoreState>,
    private action$: Actions<TypedAction>,
    private storeBackend: StoreBackend,
    private webSocketService: WebSocketService,
    private requestStatusHandler: RequestStatusHandler,
    private auth: Auth,
    @Inject(REQUEST_DATA_CONFIG) private requestDataConfig: RequestDataConfig,
  ) {}

  /**
   * Returns a collection of documents, customised by query.
   *
   * @param collectionName Collection name
   * @param queryFn Query to refine results
   */
  collection<C extends DatastoreCollectionType>(
    collectionName: C['Name'],
    queryFn?: (q: Query<C>) => Query<C> | Rx.Observable<Query<C> | NullQuery>,
  ): DatastoreCollection<C>;
  collection<C extends DatastoreCollectionType>(
    collectionName: C['Name'],
    ids$:
      | Rx.Observable<ReadonlyArray<number>>
      | Rx.Observable<ReadonlyArray<string>>,
  ): DatastoreCollection<C>;
  collection<C extends DatastoreCollectionType>(
    collectionName: C['Name'],
    queryFnOrIds$?:
      | ((q: Query<C>) => Query<C> | Rx.Observable<Query<C> | NullQuery>)
      | Rx.Observable<ReadonlyArray<number>>
      | Rx.Observable<ReadonlyArray<string>>,
  ): DatastoreCollection<C> {
    const flattenedQuery$ = flattenQuery<C>(
      Rx.isObservable(queryFnOrIds$)
        ? query => query.where('id', 'in', queryFnOrIds$)
        : queryFnOrIds$,
    );

    const refStream$: Rx.Observable<Reference<C>> = Rx.combineLatest([
      toObservable(collectionName),
      toObservable(this.auth.authState$),
      flattenedQuery$,
    ]).pipe(
      map(
        ([
          collection,
          authState,
          { limit, queryParams, searchQueryParams, order },
        ]) => ({
          path: {
            collection,
            authUid: authState ? authState.userId : LOGGED_OUT_KEY,
          },
          query: {
            limit,
            queryParams,
            searchQueryParams,
            isDocumentQuery: false,
          },
          order,
        }),
      ),
    );

    /**
     * Turns references into requests and sends actions for those requests
     * which are processed in `request-data.effect.ts`.
     *
     * This has special logic for queries that are only searching by `id`.
     * We turn these requests into `document` requests which means:
     *  - they can be batched
     *  - they can return partial results
     *  - they don't need to be stored in the queries list in the NgRx store.
     * For these `id` queries we also only fetch the new `ids` (the delta).
     *
     * Note we always move the `ids` from the query to the `ids`
     * to simplify writing backend files.
     */
    const requestStream$: Rx.Observable<
      RequestDataPayload<C> | undefined
    > = refStream$.pipe(
      tap(({ path: { collection } }) => {
        if (!this.storeBackend.isFeatureLoaded(collection)) {
          throw new DatastoreMissingModuleError(collection);
        }
      }),
      /*
       * To fetch the delta we need to compare the current query with the previous query.
       * To achive that we append the request stream with an empty query using `duplicateFirst`,
       * then comparing with `pairwise`, before finally returning just current request.
       */
      duplicateFirst(ref => ({
        ...ref,
        query: { ...emptyQueryObject, isDocumentQuery: false },
      })),
      pairwise(), // Use pairwise to calculate and fetch new objects only
      switchMap(refs => {
        const [
          {
            path: { collection, authUid },
          },
        ] = refs;
        return this.store$.pipe(
          select(collection, authUid),
          take(1),
          map(data => ({ refs, data })),
        );
      }),
      map(({ refs, data }) => {
        const [origRef, ref] = refs;

        // Skip dispatching an action to request data on a non-null query
        if (isNullRef(ref)) {
          return undefined;
        }

        const clientRequestIds = [this.generateClientRequestId()];

        // If the new query isn't just filtering by ids, move any IDs asked for
        // into the `ids` in the `path` and out of the `query`
        if (!isIdQuery(ref.query)) {
          const request: RequestDataPayload<C> = {
            type: ref.path.collection,
            ref: {
              ...ref,
              query: removeEqualOrInIdsFromQuery(ref.query),
              path: {
                ...ref.path,
                ids: getEqualOrInIdsFromQuery(ref.query),
              },
            },
            clientRequestIds,
          };

          this.store$.dispatch({ type: 'REQUEST_DATA', payload: request });

          return request;
        }

        // If the new query is just filtering by ids, but the original query wasn't,
        // then move the `ids` into the path and fetch all the ids
        if (!isIdQuery(origRef.query)) {
          const request: RequestDataPayload<C> = {
            type: ref.path.collection,
            ref: {
              ...ref,
              path: { ...ref.path, ids: getEqualOrInIdsFromQuery(ref.query) },
              query: undefined, // don't merge in the new query, just use `path.ids`
            },
            clientRequestIds,
          };

          this.store$.dispatch({ type: 'REQUEST_DATA', payload: request });

          return request;
        }

        /*
         If both are just fetching by ids, then only fetch:
         - The delta. If a new bid comes in there's no need to fetch all bidders,
           instead just fetch the new bidder.
         - Documents that have not been recently fetched. This is useful for
           projections where multiple collections are populated with one
           datastore call, e.g. `threads_get` with a `user_details` projection.
           This is different to the dedupe in RequestDataEffect, which is
           collection-specific and dedupes requests that are still in flight.
         */
        const idsOrig = getEqualOrInIdsFromQuery(origRef.query) || [];
        const idsNew = getEqualOrInIdsFromQuery(ref.query) || [];

        const { dedupeWindowTime } = this.requestDataConfig;

        const idsToFetch = setDiff(idsNew, idsOrig).filter(
          // Fetch old or missing documents
          id =>
            !data ||
            !data.documents[id] ||
            dedupeWindowTime <= 0 ||
            data.documents[id].timeFetched + dedupeWindowTime < Date.now(),
        );

        // Only ask the backend for the ids that need fetching (the delta/not recently fetched)
        this.store$.dispatch<RequestDataAction<C>>({
          type: 'REQUEST_DATA',
          payload: {
            type: ref.path.collection,
            ref: {
              ...ref,
              path: { ...ref.path, ids: idsToFetch },
              query: undefined,
            },
            clientRequestIds,
          },
        });

        // But the request is for **all** the ids in the query
        return {
          type: ref.path.collection,
          ref: { ...ref, path: { ...ref.path, ids: idsNew }, query: undefined },
          clientRequestIds,
        };
      }),
      publishReplay(1),
      refCount(),
    );

    const sourceStream$ = requestStream$.pipe(
      // Subscribe to the output of `subscribeToIds()` while `sourceStream$` is subscribed to
      withLatestFrom(
        this.storeBackend.isSubscribable(collectionName)
          ? this.webSocketService
              .subscribeToIds(
                collectionName,
                requestStream$.pipe(
                  filter(isDefined),
                  map(request => request.ref.path.ids),
                  filter(isDefined),
                ),
              )
              .pipe(startWith(undefined))
          : Rx.of(undefined),
      ),
      map(([request]) => request),
      tap(request => {
        if (request) {
          this.requestStatusHandler.update(request, { ready: false });
        }
      }),
      switchMap(request => {
        if (!request) {
          return Rx.of([]); // immediately emit on null query
        }
        const {
          ref,
          ref: {
            path: { collection, authUid },
          },
        } = request;

        const source$ = this.store$.pipe(
          // Grab the collection items from the store
          select(collection, authUid),
          filter(isDefined),
          // This needs double cast because the store is a map of string to generic collection
          // and there's no type guarantee StoreState[collectionName] actually has a collection C
          map(
            storeSlice =>
              (storeSlice as unknown) as UserCollectionStateSlice<C>,
          ),
          map(storeSlice =>
            selectDocumentsForReference<C>(
              storeSlice,
              ref,
              this.storeBackend.defaultOrder(collection),
            ),
          ),
          filter(isDefined),
        );
        return source$.pipe(
          tap(() => {
            if (request) {
              // Update request status here on fetching from either network or cache
              this.requestStatusHandler.update(request, { ready: true });
            }
          }),
          distinctUntilChanged(arrayIsShallowEqual),
        );
      }),
      publishReplay(1),
      refCount(),
    );

    const approximateTotalCountStream$: Rx.Observable<
      ApproximateTotalCountType<C> | undefined
    > = requestStream$.pipe(
      switchMap(request => {
        if (!request) {
          return Rx.of(undefined); // immediately emit on null query
        }

        const {
          ref,
          ref: {
            path: { collection, authUid },
          },
        } = request;

        return this.store$.pipe(
          select(collection, authUid),
          filter(isDefined),
          map(storeSlice => {
            const queryString = stringifyReference(ref);
            return storeSlice.queries[queryString]
              ? storeSlice.queries[queryString].approximateTotalCount
              : undefined;
          }),
        );
      }),
      publishReplay(1),
      refCount(),
    );

    const statusStream$ = Rx.combineLatest([
      requestStream$.pipe(
        switchMap(
          request =>
            request
              ? this.requestStatusHandler.get$(request)
              : Rx.from([{ ready: false }, { ready: true }]), // Null requests are always ready
        ),
      ),
      // combining with sourceStream to set ready flag to false on initial subscribe
      sourceStream$.pipe(startWith(undefined)),
    ]).pipe(
      map(([status]) => status),
      distinctUntilChanged(requestStatusesEqual),
      publishReplay(1),
      refCount(),
    );

    return new DatastoreCollection(
      refStream$,
      this.storeBackend,
      statusStream$,
      Rx.combineLatest([
        statusStream$.pipe(startWith(undefined)),
        sourceStream$,
      ]).pipe(
        map(([, source]) => source),
        distinctUntilChanged(),
      ),
      approximateTotalCountStream$,
    );
  }

  /**
   * Returns a single document from a collection specified by id.
   * If `documentId` is an observable, new documents may be fetched from the
   * network and emitted as they arrive. Note that if it emits too quickly,
   * such that the network request has not completed before the id changes,
   * that document with the previous id will not be emitted.
   *
   * @param collectionName Collection name
   * @param documentId$ If not provided, defaults to the first document of the collection.
   * Omitting this is useful for logged-out requests when document ID is not applicable
   * @param query Only required if querying by a unique secondary ID
   */
  document<C extends DatastoreCollectionType>(
    collectionName: C['Name'],
    documentId$?:
      | string
      | number
      | Rx.Observable<string>
      | Rx.Observable<number>,
  ): DatastoreDocument<C>;
  document<
    C extends DatastoreCollectionType,
    OtherId extends keyof C['DocumentType'] = keyof C['DocumentType']
  >(
    collectionName: C['Name'],
    documentSecondaryId$:
      | C['DocumentType'][OtherId]
      | Rx.Observable<C['DocumentType'][OtherId]>,
    documentQueryOrOptionObject$:
      | DocumentQuery<C, OtherId>
      | Rx.Observable<DocumentQuery<C, OtherId> | undefined>
      | DocumentOptionsObject<DocumentQuery<C, OtherId>, C['ResourceGroup']>,
  ): DatastoreDocument<C>;

  document<
    C extends DatastoreCollectionType,
    OtherId extends keyof C['DocumentType']
  >(
    collectionName: C['Name'],
    documentId$?:
      | string
      | number
      | Rx.Observable<string>
      | Rx.Observable<number>,
    documentQueryOrOptionObject$?:
      | DocumentQuery<C, OtherId>
      | Rx.Observable<DocumentQuery<C, OtherId> | undefined>
      | DocumentOptionsObject<DocumentQuery<C, OtherId>, C['ResourceGroup']>,
  ): DatastoreDocument<C> {
    // Extract query$ and resourceGroup from documentQueryOrOptionObject$
    // depending on what is given.
    const { query$, resourceGroup$ } =
      documentQueryOrOptionObject$ &&
      isDocumentOptionsObject<DocumentQuery<C, OtherId>, C['ResourceGroup']>(
        documentQueryOrOptionObject$,
      )
        ? documentQueryOrOptionObject$
        : {
            query$: documentQueryOrOptionObject$,
            resourceGroup$: undefined,
          };

    const refStream$: Rx.Observable<Reference<C>> = Rx.combineLatest([
      toObservable(collectionName),
      toObservable(this.auth.authState$),
      toObservable<number | string | undefined>(documentId$).pipe(
        distinctUntilChanged(),
      ),
      toObservable(query$).pipe(
        distinctUntilChanged(
          (a, b) =>
            !!a &&
            !!b &&
            a.caseInsensitive === b.caseInsensitive &&
            a.index === b.index,
        ),
      ),
    ]).pipe(
      map(([collection, authState, id, documentQuery]) => {
        const path = {
          collection,
          authUid: authState ? authState.userId : LOGGED_OUT_KEY,
        };

        if (!id) {
          // Treat as a document query with no params
          return {
            path,
            query: {
              isDocumentQuery: true,
              limit: 1,
              queryParams: {},
              searchQueryParams: {},
            },
          };
        }

        return documentQuery
          ? {
              path,
              query: {
                isDocumentQuery: true,
                limit: 1,
                queryParams: ({
                  [documentQuery.index]: [
                    {
                      name: documentQuery.index,
                      condition: documentQuery.caseInsensitive
                        ? 'equalsIgnoreCase'
                        : '==',
                      value: id,
                    } as QueryParam<C['DocumentType'], OtherId>,
                  ],
                  // FIXME: shouldn't need the double cast
                } as unknown) as QueryParams<C['DocumentType']>,
                searchQueryParams: {},
              },
            }
          : {
              path: { ...path, ids: [id.toString()] },
            };
      }),
    );

    const requestStream$ = Rx.combineLatest([
      refStream$,
      toObservable(resourceGroup$),
    ]).pipe(
      map(([ref, resourceGroup]) => ({
        type: ref.path.collection,
        ref,
        clientRequestIds: [this.generateClientRequestId()],
        resourceGroup,
      })),
      tap(request => {
        if (!this.storeBackend.isFeatureLoaded(collectionName)) {
          throw new DatastoreMissingModuleError(collectionName);
        }

        const action = {
          type: 'REQUEST_DATA',
          payload: request,
        };
        this.store$.dispatch(action);
      }),
      publishReplay(1),
      refCount(),
    );

    const sourceStream$ = requestStream$.pipe(
      // Subscribe to the output of `subscribeToIds()` while `sourceStream$` is subscribed to
      withLatestFrom(
        this.storeBackend.isSubscribable(collectionName)
          ? this.webSocketService
              .subscribeToIds(
                collectionName,
                requestStream$.pipe(
                  map(request => request.ref.path.ids),
                  filter(isDefined),
                ),
              )
              .pipe(startWith(undefined))
          : Rx.of(undefined),
      ),
      map(([request]) => request),
      tap(request =>
        this.requestStatusHandler.update(request, {
          ready: false,
        }),
      ),
      switchMap(request => {
        const {
          ref,
          ref: {
            path: { collection, authUid },
          },
        } = request;
        const document$ = this.store$.pipe(
          select(collection, authUid),
          filter(isDefined),
          // FIXME: needs double cast because the store is a map of string to generic collection
          // and there's no type guarantee StoreState[collectionName] actually has a collection C
          map(
            storeSlice =>
              (storeSlice as unknown) as UserCollectionStateSlice<C>,
          ),
          map(storeSlice => this.fetchSingleDocument(storeSlice, ref)),
        );

        return Rx.combineLatest([
          document$,
          this.action$.pipe(startWith(undefined)),
        ]).pipe(
          // Update request status here on fetching from either network or cache
          tap(([document, action]) => {
            // Because the missing items check in RequestDataEffect can fail
            // when requests are batched, this is a hacky way to check that the
            // item asked for in the request does not exist even after a
            // "successful" fetch.
            // TODO: If the document is cached but then deleted this check is
            // not sufficient - need to address other actions that mutate store
            if (
              action &&
              action.type === 'API_FETCH_SUCCESS' &&
              request.clientRequestIds.every(id =>
                action.payload.clientRequestIds.some(
                  actionId => actionId === id,
                ),
              ) &&
              document === undefined
            ) {
              // TODO: replace with ErrorHandler
              console.warn(
                `Fetch succeeded but document(s) not found from document call to '${request.type}'. Result was`,
                action.payload.result,
              );
              this.requestStatusHandler.update(request, {
                ready: false,
                error: ({
                  errorCode: ErrorCodeApi.NOT_FOUND,
                } as unknown) as C extends DatastoreFetchCollectionType
                  ? RequestError<C>
                  : never,
              });
            }
          }),
          map(([document]) => document),
          filter(isDefined),
          tap(() => {
            this.requestStatusHandler.update(request, {
              ready: true,
            });
          }),
          distinctUntilChanged(),
        );
      }),
      publishReplay(1),
      refCount(),
    );

    const statusStream$ = Rx.combineLatest([
      requestStream$.pipe(
        switchMap(request => this.requestStatusHandler.get$(request)),
      ),
      // combining with sourceStream to set ready flag to false on initial subscribe
      sourceStream$.pipe(startWith(undefined)),
    ]).pipe(
      map(([status]) => status),
      distinctUntilChanged(requestStatusesEqual),
      publishReplay(1),
      refCount(),
    );

    return new DatastoreDocument(
      refStream$,
      this.storeBackend,
      statusStream$,
      Rx.combineLatest([
        statusStream$.pipe(startWith(undefined)),
        sourceStream$,
      ]).pipe(
        map(([, source]) => source),
        distinctUntilChanged(),
      ),
    );
  }

  private fetchSingleDocument<C extends DatastoreCollectionType>(
    storeSlice: UserCollectionStateSlice<C>,
    ref: Reference<C>,
  ): C['DocumentType'] | undefined {
    const defaultOrder = this.storeBackend.defaultOrder<C>(ref.path.collection);
    const documents = selectDocumentsForReference(
      storeSlice,
      ref,
      defaultOrder,
    );
    return documents ? documents[0] : undefined;
  }

  /**
   * Creates a single document.
   */
  createDocument<
    C extends DatastoreCollectionType & DatastorePushCollectionType
  >(
    collectionName: C['Name'],
    document: PushDocumentType<C> & {
      readonly id?: number | string;
    },
    extra?: { readonly [index: string]: string | number },
  ): Promise<BackendPushResponse<C>> {
    return Rx.combineLatest([
      toObservable(collectionName),
      this.auth.authState$,
    ])
      .pipe(
        map(([collection, authState]: [C['Name'], AuthState | undefined]) => {
          const path: Path<C> = {
            collection,
            authUid: authState ? authState.userId : LOGGED_OUT_KEY,
          };
          return { path };
        }),
        take(1),
        switchMap(ref => this.storeBackend.push(ref, document, extra)),
      )
      .toPromise();
  }

  private generateClientRequestId() {
    return Math.random()
      .toString(36)
      .substr(2, 16);
  }
}

export type DatastoreInterface = Interface<Datastore>;
