import { Inject, Injectable } from '@angular/core';
import { Auth, AuthState } from '@freelancer/auth';
import {
  arrayIsShallowEqual,
  BackendPushResponse,
  compareMultipleFields,
  DatastoreCollection,
  DatastoreCollectionType,
  DatastoreDocument,
  DatastoreFetchCollectionType,
  DatastoreInterface,
  DatastorePushCollectionType,
  DatastoreUpdateCollectionType,
  DocumentOptionsObject,
  DocumentQuery,
  DocumentWithMetadata,
  documentWithMetadataMatchesQueryParams,
  flattenQuery,
  isDocumentOptionsObject,
  isSearchQuery,
  LOGGED_OUT_KEY,
  NullQuery,
  Ordering,
  Path,
  PushDocumentType,
  Query,
  QueryParam,
  QueryParams,
  Reference,
  RequestDataPayload,
  RequestStatus,
  requestStatusesEqual,
  select,
  stringifyReference,
  UserCollectionStateSlice,
} from '@freelancer/datastore/core';
import { isArray, isDefined, toObservable } from '@freelancer/utils';
import * as Rx from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  publishReplay,
  refCount,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import {
  RequestErrorCode,
  SimulatedRequestFailure,
  StoreBackendFake,
} from './backend';
import {
  DatastoreTestingController,
  MutationPropagator,
  PushTransformer,
  SearchTransformer,
  UpdateTransformer,
} from './datastore-testing-controller';
import { DatastoreFakeConfig, DATASTORE_FAKE_CONFIG } from './datastore.config';
import { debugConsoleLog, debugConsoleWarn } from './datastore.helpers';
import { NonObservableQuery } from './non-observable-query';
import { FakeUserCollectionStateSlice } from './store.model';

type IdOrIdsOrQuery<C extends DatastoreCollectionType> =
  | string
  | number
  | ReadonlyArray<string>
  | ReadonlyArray<number>
  | ((q: NonObservableQuery<C>) => NonObservableQuery<C>);

@Injectable()
export class DatastoreFake
  implements DatastoreInterface, DatastoreTestingController {
  searchTransformers: Map<
    string,
    SearchTransformer<DatastoreCollectionType>
  > = new Map();

  constructor(
    @Inject(DATASTORE_FAKE_CONFIG) private datastoreConfig: DatastoreFakeConfig,
    private storeBackend: StoreBackendFake,
    private auth: Auth,
  ) {}

  /**
   * Returns a collection of objects, customised by query.
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
      tap(ref => {
        const { query, path } = ref;
        // Don't log null queries
        if (query.queryParams || isSearchQuery(query)) {
          debugConsoleLog(
            this.datastoreConfig,
            `datastore.collection ${path.collection}`,
            `Query: ${stringifyReference(ref)}`,
          );
        }
      }),
    );

    // Requests to the backend, further processed in `request-data.effect.ts`
    const requestStream$: Rx.Observable<RequestDataPayload<
      C
    >> = refStream$.pipe(
      map(ref => {
        const request: RequestDataPayload<C> = {
          type: ref.path.collection,
          ref,
          clientRequestIds: [this.generateClientRequestId()],
        };

        return request;
      }),
      publishReplay(1),
      refCount(),
    );

    /**
     * Unlike the "real" datastore this isn't filtered for `undefined`
     * so that you can use this to defined the status stream.
     */
    const sourceStream$ = requestStream$.pipe(
      switchMap((request: RequestDataPayload<C>) => {
        const {
          ref,
          ref: {
            path: { collection, authUid },
            query,
          },
        } = request;

        const errorState = this.getCollectionErrorState(request.ref);
        if (errorState) {
          debugConsoleLog(
            this.datastoreConfig,
            `datastore.collection: Making request to ${collection} fail/pending`,
            stringifyReference(request.ref),
            errorState,
          );

          return Rx.NEVER;
        }

        return query && !query.queryParams && !isSearchQuery(query)
          ? Rx.of([]) // immediately emit on null query
          : this.storeBackend.storeState$.pipe(
              // store$ emits on every action dispatched and store state change
              select(collection, authUid),
              map(storeSlice => storeSlice as FakeUserCollectionStateSlice<C>),
              map(storeSlice => this.selectDocumentsForQuery(storeSlice, ref)),
            );
      }),
      distinctUntilChanged(arrayIsShallowEqual),
      publishReplay(1),
      refCount(),
    );

    const statusStream$ = Rx.combineLatest([
      requestStream$,
      sourceStream$,
    ]).pipe(
      map(
        ([request, source]) =>
          /* While the real datastore will emit `false` then `true`,
           * doing this immediately can break Angular's change detection,
           * so let's derive this from the request and source streams
           * and only emit once.
           */
          this.getCollectionErrorState(request.ref) ?? {
            ready: source !== undefined,
          },
      ),
      distinctUntilChanged(requestStatusesEqual),
      publishReplay(1),
      refCount(),
    );

    return new DatastoreCollection(
      refStream$,
      this.storeBackend,
      statusStream$,
      sourceStream$.pipe(filter(isDefined), distinctUntilChanged()),
      Rx.NEVER, // FIXME
    );
  }

  /**
   * Returns a single document from a collection specified by id.
   * If `documentId` is an observable, new objects may be fetched from the
   * network and emitted as they arrive. Note that if it emits too quickly,
   * such that the network request has not completed before the id changes,
   * that object with the previous id will not be emitted.
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
    OtherId extends keyof C['DocumentType']
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
              path: {
                ...path,
                ids: [id.toString()],
              },
            };
      }),
      tap(ref => {
        const { path } = ref;
        debugConsoleLog(
          this.datastoreConfig,
          'datastore.document',
          path.collection,
          'ids' in path ? path.ids : stringifyReference(ref),
        );
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
      publishReplay(1),
      refCount(),
    );

    const sourceStream$ = requestStream$.pipe(
      switchMap(request => {
        const {
          ref,
          ref: {
            path: { collection, authUid },
          },
        } = request;

        const errorState = this.getCollectionErrorState(request.ref);
        if (errorState) {
          debugConsoleLog(
            this.datastoreConfig,
            `datastore.document: Making request to ${collection} fail/pending`,
            stringifyReference(request.ref),
            errorState,
          );

          return Rx.NEVER;
        }

        return this.storeBackend.storeState$.pipe(
          select(collection, authUid),
          map(storeSlice => storeSlice as UserCollectionStateSlice<C>), // FIXME?
          map(state => this.fetchSingleDocument(state, ref)),
        );
      }),
      distinctUntilChanged(),
      publishReplay(1),
      refCount(),
    );

    const statusStream$ = Rx.combineLatest([
      requestStream$,
      sourceStream$.pipe(startWith(undefined)),
    ]).pipe(
      map(
        ([request, source]) =>
          /* While the real datastore will emit `false` then `true`,
           * doing this immediately can break Angular's change detection,
           * so let's derive this from the request and source streams
           * and only emit once.
           */
          this.getCollectionErrorState(request.ref) ?? {
            ready: source !== undefined,
          },
      ),
      distinctUntilChanged(requestStatusesEqual),
      publishReplay(1),
      refCount(),
    );

    return new DatastoreDocument(
      refStream$,
      this.storeBackend,
      statusStream$,
      sourceStream$.pipe(filter(isDefined), distinctUntilChanged()),
    );
  }

  private selectDocumentsForQuery<C extends DatastoreCollectionType>(
    storeSlice: FakeUserCollectionStateSlice<C>,
    ref: Reference<C>,
  ): ReadonlyArray<C['DocumentType']> | undefined {
    const {
      query,
      path: { collection },
    } = ref;

    if (!storeSlice) {
      debugConsoleWarn(
        this.datastoreConfig,
        `'${collection}' collection has no documents. Did you intentionally omit creating a document?`,
      );
      return [];
    }

    let documents: ReadonlyArray<DocumentWithMetadata<C['DocumentType']>>;
    const searchTransformer = this.searchTransformers.get(collection);
    if (isSearchQuery(query) && searchTransformer && query?.searchQueryParams) {
      // Apply the search transformer before filtering on query params
      const rawDocuments = Object.values(storeSlice.documents).map(
        documentWithMetadata => documentWithMetadata.rawDocument,
      );
      const now = Date.now();
      documents = searchTransformer(rawDocuments, query.searchQueryParams).map(
        document => ({
          rawDocument: document,
          timeFetched: now,
          timeUpdated: now,
        }),
      );
    } else {
      documents = Object.values(storeSlice.documents);
    }

    // Filter entities instead of the default list (which the real datastore does)
    const matchingObjects = documents
      .filter(documentWithMetadata =>
        documentWithMetadataMatchesQueryParams(
          documentWithMetadata,
          query && query.queryParams,
        ),
      )
      .map(documentWithMetadata => documentWithMetadata.rawDocument)
      .slice(0, query && query.limit);

    const order =
      (ref.order as Ordering<DatastoreCollectionType> | undefined) ??
      this.storeBackend.defaultOrder(collection);

    // Respect search transformer's order, otherwise fall back to the query.orderBy
    // clause, then the collection's backend defaultOrder
    return order && !isSearchQuery(query)
      ? matchingObjects.sort((document1, document2) =>
          compareMultipleFields<C['DocumentType']>(
            Array.isArray(order) ? order : [order],
          )(document1, document2),
        )
      : matchingObjects;
  }

  private fetchSingleDocument<C extends DatastoreCollectionType>(
    storeSlice: UserCollectionStateSlice<C>,
    ref: Reference<C>,
  ): C['DocumentType'] | undefined {
    const {
      path: { collection, ids },
      query,
    } = ref;

    if (!storeSlice) {
      const idOrQuery = ids
        ? `id ${ids[0]}`
        : `query ${query &&
            query.queryParams &&
            JSON.stringify(Object.values(query.queryParams)[0])}`;
      debugConsoleWarn(
        this.datastoreConfig,
        `'${collection}' document with ${idOrQuery} does not exist. Did you intentionally omit creating a document?`,
      );

      return undefined;
    }

    if (ids) {
      return (
        storeSlice.documents[ids[0]] && storeSlice.documents[ids[0]].rawDocument
      );
    }

    const documents = this.selectDocumentsForQuery(storeSlice, ref);
    return documents ? documents[0] : undefined;
  }

  /**
   * Creates a single object.
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
        switchMap(ref => this.storeBackend.push<C>(ref, document, extra)),
      )
      .toPromise();
  }

  /**
   * Creates an object directly in the store.
   */
  createRawDocument<
    C extends DatastoreCollectionType & DatastorePushCollectionType
  >(
    collectionName: C['Name'],
    document: C['DocumentType'],
  ): Promise<BackendPushResponse<any>> {
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
        switchMap(ref => this.storeBackend.pushRaw<C>(ref, document)),
      )
      .toPromise();
  }

  /**
   * Clears the state, push transformers and resets errors.
   */
  resetState<C extends DatastoreCollectionType>(
    collectionName?: C['Name'],
  ): Promise<void> {
    return this.auth.authState$
      .pipe(
        take(1),
        tap(authState => {
          if (!collectionName) {
            this.searchTransformers.clear();
          } else {
            this.searchTransformers.delete(collectionName);
          }

          this.storeBackend.reset(
            authState ? authState.userId : LOGGED_OUT_KEY,
            collectionName,
          );
        }),
      )
      .toPromise()
      .then(_ => undefined);
  }

  printState() {
    return this.storeBackend.storeState$
      .pipe(take(1))
      .toPromise()
      .then(state => console.log('Store state:', state));
  }

  /**
   * Since the real datastore supports fields that are computed in the backend
   * the fake needs explicit functions to do this computation to be registered.
   */
  addPushTransformer<
    C extends DatastoreCollectionType & DatastorePushCollectionType
  >(collectionName: C['Name'], transformer: PushTransformer<C>) {
    this.storeBackend.pushTransformers.set(
      collectionName,
      (transformer as unknown) as PushTransformer<
        DatastoreCollectionType & DatastorePushCollectionType
      >,
    );
  }

  /**
   * Since the real datastore's reducers can use the backend response to merge
   * documents for updates, the fake needs functions to replicate this.
   */
  addUpdateTransformer<
    C extends DatastoreCollectionType & DatastoreUpdateCollectionType
  >(collectionName: C['Name'], transformer: UpdateTransformer<C>) {
    this.storeBackend.updateTransformers.set(
      collectionName,
      (transformer as unknown) as UpdateTransformer<
        DatastoreCollectionType & DatastoreUpdateCollectionType
      >,
    );
  }

  addMutationPropagator<
    C1 extends DatastoreCollectionType & DatastorePushCollectionType,
    C2 extends DatastoreCollectionType & DatastorePushCollectionType
  >(propagator: MutationPropagator<C1, C2>) {
    if (propagator.to === propagator.from) {
      throw new Error(
        'Mutation propagators between the same collection are not allowed. Use a push/update transformer instead.',
      );
    }

    if (
      this.storeBackend.mutationPropagators.find(
        p => propagator.from === p.from && propagator.to === p.to,
      )
    ) {
      throw new Error(
        `Mutation propagator from '${propagator.from}' to '${propagator.to}' already exists, add any logic to that instead.`,
      );
    }

    this.storeBackend.mutationPropagators = [
      ...this.storeBackend.mutationPropagators,
      propagator,
    ];
  }

  addSearchTransformer<C extends DatastoreCollectionType>(
    collectionName: C['Name'],
    transformer: SearchTransformer<C>,
  ) {
    return this.searchTransformers.set(
      collectionName,
      (transformer as unknown) as SearchTransformer<DatastoreCollectionType>,
    );
  }

  /**
   * Make all requests to a particular datastore collection fail.
   */
  makeCollectionFail<
    C extends DatastoreCollectionType & DatastoreFetchCollectionType
  >(
    collectionName: C['Name'],
    errorCode: RequestErrorCode<C> = 'UNKNOWN_ERROR',
  ): void {
    return this.makeCollectionError(collectionName, {
      status: 'error',
      errorCode,
    });
  }

  /**
   * Make a specific request to the datastore fail.
   */
  makeRequestFail<
    C extends DatastoreCollectionType & DatastoreFetchCollectionType
  >(
    collectionName: C['Name'],
    idOrIdsOrQuery: IdOrIdsOrQuery<C>,
    errorCode: RequestErrorCode<C> = 'UNKNOWN_ERROR',
  ): void {
    return this.makeRequestError(collectionName, idOrIdsOrQuery, {
      status: 'error',
      errorCode,
    });
  }

  /**
   * Make all requests to a particular datastore collection never return.
   */
  makeCollectionPending<
    C extends DatastoreCollectionType & DatastoreFetchCollectionType
  >(collectionName: C['Name']): void {
    return this.makeCollectionError(collectionName, {
      status: 'pending',
    });
  }

  /**
   * Make a specific request to the datastore never return.
   */
  makeRequestPending<
    C extends DatastoreCollectionType & DatastoreFetchCollectionType
  >(collectionName: C['Name'], idOrIdsOrQuery: IdOrIdsOrQuery<C>): void {
    this.makeRequestError(collectionName, idOrIdsOrQuery, {
      status: 'pending',
    });
  }

  /**
   * Makes a datastore call to a particular collection error in the say specified
   */
  private makeCollectionError<
    C extends DatastoreCollectionType & DatastoreFetchCollectionType
  >(collectionName: C['Name'], error: SimulatedRequestFailure<C>): void {
    this.storeBackend.collectionsToFail.set(collectionName, error);
  }

  private makeRequestError<
    C extends DatastoreCollectionType & DatastoreFetchCollectionType
  >(
    collectionName: C['Name'],
    idOrIdsOrQuery: IdOrIdsOrQuery<C>,
    error: SimulatedRequestFailure<C>,
  ): void {
    if (isArray(idOrIdsOrQuery)) {
      this.storeBackend.requestsToFail.set(
        this.generateRefKey({
          path: {
            collection: collectionName,
            authUid: '', // Let's keep things simple and not make this user dependent
            // FIXME: https://github.com/microsoft/TypeScript/pull/31023
            ids: (idOrIdsOrQuery as readonly (number | string)[]).map(id =>
              id.toString(),
            ),
          },
        }),
        error,
      );
    } else if (
      typeof idOrIdsOrQuery === 'number' ||
      typeof idOrIdsOrQuery === 'string'
    ) {
      this.storeBackend.requestsToFail.set(
        this.generateRefKey({
          path: {
            collection: collectionName,
            authUid: '', // Let's keep things simple and not make this user dependent
            ids: [idOrIdsOrQuery.toString()],
          },
        }),
        error,
      );
    } else {
      const {
        queryParams = {},
        searchQueryParams = {},
        limitValue: limit,
        orderByValue: order,
      } = idOrIdsOrQuery(NonObservableQuery.newQuery());
      this.storeBackend.requestsToFail.set(
        this.generateRefKey({
          path: { collection: collectionName, authUid: '' },
          query: {
            queryParams,
            searchQueryParams,
            isDocumentQuery: false, // This is ignored
            limit,
          },
          order,
        }),
        error,
      );
    }
  }

  /**
   * A request should fail if either:
   *  - the whole collection should fail, OR
   *  - if that specify request should fail
   *
   * The `retry` method is set to clear the error on being called.
   */
  private getCollectionErrorState<C extends DatastoreCollectionType>(
    ref: Reference<C>,
  ): RequestStatus<C> | undefined {
    const collectionFailure = this.storeBackend.collectionsToFail.get(
      ref.path.collection,
    );
    const requestFailure = this.storeBackend.requestsToFail.get(
      this.generateRefKey(ref),
    );
    const failure = collectionFailure ?? requestFailure;

    if (failure?.status === 'error') {
      return {
        ready: false,
        error: {
          errorCode: failure.errorCode,
          retry: () => {
            if (collectionFailure) {
              this.storeBackend.collectionsToFail.delete(ref.path.collection);
            } else {
              this.storeBackend.requestsToFail.delete(this.generateRefKey(ref));
            }
          },
        } as RequestStatus<C>['error'],
      };
    }

    if (failure?.status === 'pending') {
      return {
        ready: false,
      };
    }
    return undefined;
  }

  private generateRefKey<C extends DatastoreCollectionType>(
    ref: Reference<C>,
  ): string {
    return `${ref.path.collection};${stringifyReference(ref)}`;
  }

  private generateClientRequestId() {
    return Math.random()
      .toString(36)
      .substr(2, 16);
  }
}
