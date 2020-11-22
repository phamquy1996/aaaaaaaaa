import {
  Inject,
  Injectable,
  InjectionToken,
  ModuleWithProviders,
  NgModule,
} from '@angular/core';
import { assertNever, isDefined } from '@freelancer/utils';
import { Store } from '@ngrx/store';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import * as Rx from 'rxjs';
import { filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import {
  CollectionActions,
  DeleteAction,
  DeleteErrorAction,
  DeleteRequestPayload,
  PushAction,
  PushErrorAction,
  PushRequestPayload,
  SetAction,
  SetErrorAction,
  SetRequestPayload,
  UpdateAction,
  UpdateErrorAction,
  UpdateRequestPayload,
} from './actions';
import { ApiFetchResponse, ApiHttp } from './api-http.service';
import { ResponseData } from './datastore.interface';
import { RecursivePartial } from './helpers';
import { DatastoreMissingModuleError } from './missing-module-error';
import { Ordering, SingleOrdering } from './query';
import { StoreBackendInterface } from './store-backend.interface';
import { pluckDocumentFromRawStore } from './store.helpers';
import {
  DatastoreCollectionType,
  DatastoreDeleteCollectionType,
  DatastoreFetchCollectionType,
  DatastorePushCollectionType,
  DatastoreSetCollectionType,
  DatastoreUpdateCollectionType,
  Path,
  PushDocumentType,
  RawQuery,
  Reference,
  SetDocumentType,
  StoreState,
} from './store.model';

export interface BackendSuccessResponse {
  readonly status: 'success';
}

type ExtractId<T> = T extends { readonly id: any } ? T['id'] : undefined;

export interface BackendPushSuccessResponse<
  C extends DatastoreCollectionType & DatastorePushCollectionType
> extends BackendSuccessResponse {
  readonly id: ExtractId<C['Backend']['Push']['ReturnType']>;
}

export type BackendAllErrorCodes = ErrorCodeApi | 'UNKNOWN_ERROR';

export interface BackendErrorResponse<E> {
  readonly status: 'error';
  readonly errorCode: E | 'UNKNOWN_ERROR';
  readonly requestId?: string;
}

export type BackendPushErrorResponse<
  C extends DatastoreCollectionType & DatastorePushCollectionType
> = BackendErrorResponse<C['Backend']['Push']['ErrorType']>;
export type BackendSetErrorResponse<
  C extends DatastoreCollectionType & DatastoreSetCollectionType
> = BackendErrorResponse<C['Backend']['Set']['ErrorType']>;
export type BackendUpdateErrorResponse<
  C extends DatastoreCollectionType & DatastoreUpdateCollectionType
> = BackendErrorResponse<C['Backend']['Update']['ErrorType']>;
export type BackendDeleteErrorResponse<
  C extends DatastoreCollectionType & DatastoreDeleteCollectionType
> = BackendErrorResponse<C['Backend']['Delete']['ErrorType']>;

export type BackendPushResponse<
  C extends DatastoreCollectionType & DatastorePushCollectionType
> = BackendPushSuccessResponse<C> | BackendPushErrorResponse<C>;
export type BackendSetResponse<
  C extends DatastoreCollectionType & DatastoreSetCollectionType
> = BackendSuccessResponse | BackendSetErrorResponse<C>;
export type BackendUpdateResponse<
  C extends DatastoreCollectionType & DatastoreUpdateCollectionType
> = BackendSuccessResponse | BackendUpdateErrorResponse<C>;
export type BackendDeleteResponse<
  C extends DatastoreCollectionType & DatastoreDeleteCollectionType
> = BackendSuccessResponse | BackendDeleteErrorResponse<C>;

/** Key-value pairs passed to the backend via query parameters in the URL */
export interface Params {
  readonly [key: string]:
    | string
    | number
    | boolean
    | ReadonlyArray<number | undefined>
    | ReadonlyArray<string | undefined>
    | undefined;
}

interface BackendFetchGetRequest {
  readonly endpoint: string;
  readonly params?: Params;
  readonly isGaf?: boolean;
}

interface BackendFetchPostRequest<
  C extends DatastoreCollectionType & DatastoreFetchCollectionType
> {
  readonly payload: C['Backend']['Fetch']['PayloadType'];
  readonly endpoint: string;
  readonly params?: Params;
  readonly isGaf?: boolean;
  /**
   * Serialises the body as `application/x-www-form-urlencoded` instead of
   * `application/json` (the default)
   */
  readonly asFormData?: boolean;
  readonly method: 'POST';
}

export type BackendFetchRequest<
  C extends DatastoreCollectionType & DatastoreFetchCollectionType
> = BackendFetchGetRequest | BackendFetchPostRequest<C>;

type FetchRequestFactory<
  C extends DatastoreCollectionType & DatastoreFetchCollectionType
> = (
  authUid: string,
  /** The document IDs passed to a `datastore.document` call */
  ids: ReadonlyArray<string> | undefined,
  /** The query passed to a `datastore.collection` call or `document` call by secondary ID */
  query: RawQuery<C['DocumentType']> | undefined,
  order: Ordering<C> | undefined,
  resourceGroup: C['ResourceGroup'] | undefined,
) => BackendFetchRequest<C>;

export interface BackendPushRequest<
  C extends DatastoreCollectionType & DatastorePushCollectionType
> {
  readonly payload: C['Backend']['Push']['PayloadType'];
  readonly endpoint: string;
  readonly params?: Params;
  readonly isGaf?: boolean;
  /**
   * Serialises the body as `application/x-www-form-urlencoded` instead of
   * `application/json` (the default)
   */
  readonly asFormData?: boolean;
}

type PushRequestFactory<
  C extends DatastoreCollectionType & DatastorePushCollectionType
> = (
  authUid: string,
  document: PushDocumentType<C>,
  extra: { readonly [index: string]: string | number } | undefined,
) => BackendPushRequest<C>;

export interface BackendSetRequest<
  C extends DatastoreCollectionType & DatastoreSetCollectionType
> {
  readonly payload: C['Backend']['Set']['PayloadType'];
  readonly endpoint: string;
  readonly params?: Params;
  readonly isGaf?: boolean;
  /**
   * Serialises the body as `application/x-www-form-urlencoded` instead of
   * `application/json` (the default)
   */
  readonly asFormData?: boolean;
}

type SetRequestFactory<
  C extends DatastoreCollectionType & DatastoreSetCollectionType
> = (authUid: string, document: SetDocumentType<C>) => BackendSetRequest<C>;

export interface BackendUpdateRequest<
  C extends DatastoreCollectionType & DatastoreUpdateCollectionType
> {
  readonly payload: C['Backend']['Update']['PayloadType'];
  readonly endpoint: string;
  readonly params?: Params;
  readonly isGaf?: boolean;
  /**
   * Serialises the body as `application/x-www-form-urlencoded` instead of
   * `application/json` (the default)
   */
  readonly asFormData?: boolean;
  readonly method: 'POST' | 'PUT';
}

type UpdateRequestFactory<
  C extends DatastoreCollectionType & DatastoreUpdateCollectionType
> = (
  authUid: string,
  delta: RecursivePartial<C['DocumentType']>,
  originalDocument: C['DocumentType'],
) => BackendUpdateRequest<C>;

export interface BackendDeleteRequest<
  C extends DatastoreCollectionType & DatastoreDeleteCollectionType
> {
  readonly payload: C['Backend']['Delete']['PayloadType'];
  readonly endpoint: string;
  readonly params?: Params;
  readonly isGaf?: boolean;
  readonly asFormData?: boolean;
  readonly method: 'POST' | 'PUT' | 'DELETE';
}

type DeleteRequestFactory<
  C extends DatastoreCollectionType & DatastoreDeleteCollectionType
> = (
  authUid: string,
  id: string | number,
  originalDocument: C['DocumentType'],
) => BackendDeleteRequest<C>;

/**
 * This type is strange as it seeks to enforce that the backend factory
 * implements each method if and only iff it is specified in the collection
 * type. If not you need to specify `undefined`.
 *
 * The `C['Backend']['Fetch'] extends never` is needed to check if it's actually
 * there, and the `C extends DatastoreFetchCollectionType` is necessary to let
 * TypeScript know it is there. Not sure why we need both :(
 */
export interface Backend<C extends DatastoreCollectionType> {
  readonly fetch: C['Backend']['Fetch'] extends never
    ? undefined
    : C extends DatastoreFetchCollectionType
    ? FetchRequestFactory<C>
    : undefined;

  readonly push: C['Backend']['Push'] extends never
    ? undefined
    : C extends DatastorePushCollectionType
    ? PushRequestFactory<C>
    : undefined;

  readonly set: C['Backend']['Set'] extends never
    ? undefined
    : C extends DatastoreSetCollectionType
    ? SetRequestFactory<C>
    : undefined;

  readonly update: C['Backend']['Update'] extends never
    ? undefined
    : C extends DatastoreUpdateCollectionType
    ? UpdateRequestFactory<C>
    : undefined;

  readonly remove: C['Backend']['Delete'] extends never
    ? undefined
    : C extends DatastoreDeleteCollectionType
    ? DeleteRequestFactory<C>
    : undefined;

  readonly defaultOrder: SingleOrdering<C> | Ordering<C>;

  readonly maxBatchSize?: number;

  /** Can you subscribe to these events from the websocket? */
  readonly isSubscribable?: true;
}

export const BACKEND_DEFAULT_BATCH_SIZE = 100;

export type BackendConfigs = { [K in string]?: Backend<any> }; // FIXME

@Injectable()
export class StoreBackend implements StoreBackendInterface {
  private backendConfigs: BackendConfigs = {};

  constructor(private store$: Store<StoreState>, private apiHttp: ApiHttp) {}

  /**
   * Checks if the backend config (*.backend.ts) for a given collection is available.
   * It is only available if the BackendFeatureModule (or DatastoreFeatureModule)
   * for that collection has been imported.
   *
   * Note that this does not check if the @ngrx/store feature module for that
   * collection has been imported. This is only possible when we have access to
   * store state, i.e. upon subscription to the store. However, since the both
   * the store and backend feature modules are imported together in the various
   * `DatastoreXModule` modules, checking one of these is equivalent to checking
   * the other.
   */
  isFeatureLoaded<C extends DatastoreCollectionType>(
    collection: any, // FIXME
  ): boolean {
    return collection in this.backendConfigs;
  }

  defaultOrder<C extends DatastoreCollectionType>(
    collection: C['Name'],
  ): Ordering<C> {
    const config = (this.backendConfigs[collection as any] as unknown) as
      | Backend<C>
      | undefined; // FIXME
    if (!config) {
      throw new DatastoreMissingModuleError(collection);
    }
    return Array.isArray(config.defaultOrder)
      ? config.defaultOrder
      : ([config.defaultOrder] as Ordering<C>);
  }

  batchSize<C extends DatastoreCollectionType>(ref: Reference<C>): number {
    const config = this.backendConfigs[ref.path.collection];
    return (config && config.maxBatchSize) || BACKEND_DEFAULT_BATCH_SIZE;
  }

  isSubscribable<C extends DatastoreCollectionType>(
    collectionName: C['Name'],
  ): boolean {
    const config = this.backendConfigs[collectionName];
    return (config && config.isSubscribable) || false;
  }

  fetch<C extends DatastoreCollectionType & DatastoreFetchCollectionType>(
    ref: Reference<C>,
    resourceGroup?: C['ResourceGroup'],
  ): Rx.Observable<ApiFetchResponse<C>> {
    const { path, query, order } = ref;
    const type = path.collection;
    return Rx.of(this.backendConfigs[type] as Backend<C> | undefined).pipe(
      map(config => {
        if (!config) {
          throw new DatastoreMissingModuleError(type);
        }
        return config.fetch;
      }),
      filter(isDefined),
      map((fetch: FetchRequestFactory<C>) =>
        fetch(path.authUid, path.ids, query, order, resourceGroup),
      ),
      switchMap(request => this.apiHttp.fetch(request, query)),
    );
  }

  push<C extends DatastoreCollectionType & DatastorePushCollectionType>(
    ref: Reference<C>,
    document: PushDocumentType<C>,
    extra?: { readonly [index: string]: string | number },
  ): Rx.Observable<BackendPushResponse<C>> {
    const { path, query } = ref;
    const type = path.collection;

    return Rx.of(this.backendConfigs[type] as Backend<C> | undefined).pipe(
      map(config => {
        if (!config) {
          throw new DatastoreMissingModuleError(type);
        }
        return config.push;
      }),
      filter(isDefined),
      map((push: PushRequestFactory<C>) => {
        const request = push(path.authUid, document, extra);
        return {
          request,
          payload: {
            type,
            ref,
            document,
            rawRequest: request.payload,
          },
        };
      }),
      tap(({ payload }) => {
        const action: CollectionActions<C> = {
          type: `API_PUSH`,
          payload,
        } as C extends DatastorePushCollectionType ? PushAction<C> : never;
        this.store$.dispatch(action);
      }),
      switchMap(({ request, payload }) =>
        this.apiHttp.post(request).pipe(map(result => ({ payload, result }))),
      ),
      map(({ payload, result }) =>
        this.sendActions({ type: 'PUSH', payload }, path, query, result),
      ),
    );
  }

  set<C extends DatastoreCollectionType & DatastoreSetCollectionType>(
    ref: Reference<C>,
    id: number | string,
    document: SetDocumentType<C>,
  ): Rx.Observable<BackendSetResponse<C>> {
    const { path, query } = ref;
    const type = path.collection;

    return Rx.of(this.backendConfigs[type] as Backend<C> | undefined).pipe(
      map(config => {
        if (!config) {
          throw new DatastoreMissingModuleError(type);
        }
        return config.set;
      }),
      filter(isDefined),
      map((set: SetRequestFactory<C>) => set),
      withLatestFrom(this.store$),
      map(([set, storeState]) => {
        const originalDocument = pluckDocumentFromRawStore(
          storeState,
          path,
          id,
        );
        const request = set(path.authUid, document);
        return {
          request,
          payload: {
            type,
            ref,
            document,
            originalDocument,
            rawRequest: request.payload,
          },
        };
      }),
      tap(({ payload }) => {
        const action: CollectionActions<C> = {
          type: `API_SET`,
          payload,
        } as C extends DatastoreSetCollectionType ? SetAction<C> : never;
        this.store$.dispatch(action);
      }),
      switchMap(({ request, payload }) =>
        this.apiHttp.post(request).pipe(map(result => ({ payload, result }))),
      ),
      map(({ payload, result }) =>
        this.sendActions({ type: 'SET', payload }, path, query, result),
      ),
    );
  }

  update<C extends DatastoreCollectionType & DatastoreUpdateCollectionType>(
    ref: Reference<C>,
    id: number | string,
    delta: RecursivePartial<C['DocumentType']>,
  ): Rx.Observable<BackendUpdateResponse<C>> {
    const { path } = ref;
    const type = path.collection;

    return Rx.of(this.backendConfigs[type] as Backend<C> | undefined).pipe(
      map(config => {
        if (!config) {
          throw new DatastoreMissingModuleError(type);
        }
        return config.update;
      }),
      filter(isDefined),
      map((set: UpdateRequestFactory<C>) => set),
      withLatestFrom(this.store$),
      map(([update, storeState]) => {
        const originalDocument = pluckDocumentFromRawStore(
          storeState,
          path,
          id,
        );
        if (originalDocument === undefined) {
          throw new Error('Missing original document');
        }
        const request = update(path.authUid, delta, originalDocument);
        return {
          request,
          payload: {
            type,
            ref,
            delta,
            rawRequest: request.payload,
            originalDocument,
          },
        };
      }),
      tap(({ payload }) => {
        const action: CollectionActions<C> = {
          type: `API_UPDATE`,
          payload,
        } as C extends DatastoreUpdateCollectionType ? UpdateAction<C> : never;
        this.store$.dispatch(action);
      }),
      switchMap(({ request, payload }) => {
        switch (request.method) {
          case 'POST':
            return this.apiHttp
              .post(request)
              .pipe(map(result => ({ payload, result })));
          case 'PUT':
            return this.apiHttp
              .put(request)
              .pipe(map(result => ({ payload, result })));
          default:
            return assertNever(request.method);
        }
      }),
      map(({ payload, result }) =>
        this.sendActions(
          { type: 'UPDATE', payload },
          payload.ref.path,
          payload.ref.query,
          result,
        ),
      ),
    );
  }

  delete<C extends DatastoreCollectionType & DatastoreDeleteCollectionType>(
    ref: Reference<C>,
    id: number | string,
  ): Rx.Observable<BackendDeleteResponse<C>> {
    const { path } = ref;
    const type = path.collection;

    return Rx.of(this.backendConfigs[type] as Backend<C> | undefined).pipe(
      map(config => {
        if (!config) {
          throw new DatastoreMissingModuleError(type);
        }
        return config.remove;
      }),
      filter(isDefined),
      map((set: DeleteRequestFactory<C>) => set),
      withLatestFrom(this.store$),
      map(([del, storeState]) => {
        const originalDocument = pluckDocumentFromRawStore(
          storeState,
          path,
          id,
        );
        if (originalDocument === undefined) {
          throw new Error('Missing original document');
        }
        const request = del(path.authUid, id, originalDocument);
        return {
          request,
          payload: {
            type,
            ref,
            rawRequest: request.payload,
            originalDocument,
          },
        };
      }),
      tap(({ payload }) => {
        const action: CollectionActions<C> = {
          type: `API_DELETE`,
          payload,
        } as C extends DatastoreDeleteCollectionType ? DeleteAction<C> : never;
        this.store$.dispatch(action);
      }),
      switchMap(({ request, payload }) => {
        switch (request.method) {
          case 'POST':
            return this.apiHttp
              .post(request)
              .pipe(map(result => ({ payload, result })));
          case 'PUT':
            return this.apiHttp
              .put(request)
              .pipe(map(result => ({ payload, result })));
          case 'DELETE':
            return this.apiHttp
              .delete(request)
              .pipe(map(result => ({ payload, result })));
          default:
            return assertNever(request.method);
        }
      }),
      map(({ payload, result }) =>
        this.sendActions(
          { type: 'DELETE', payload },
          payload.ref.path,
          payload.ref.query,
          result,
        ),
      ),
    );
  }

  private sendActions<
    C extends DatastoreCollectionType & DatastorePushCollectionType
  >(
    baseAction: {
      readonly type: 'PUSH';
      readonly payload: PushRequestPayload<C>;
    },
    path: Path<C>,
    query: RawQuery<C['DocumentType']> | undefined,
    data: ResponseData<
      C['Backend']['Push']['ReturnType'],
      C['Backend']['Push']['ErrorType']
    >,
  ): BackendPushResponse<C>;
  private sendActions<
    C extends DatastoreCollectionType & DatastoreSetCollectionType
  >(
    baseAction: {
      readonly type: 'SET';
      readonly payload: SetRequestPayload<C>;
    },
    path: Path<C>,
    query: RawQuery<C['DocumentType']> | undefined,
    data: ResponseData<
      C['Backend']['Set']['ReturnType'],
      C['Backend']['Set']['ErrorType']
    >,
  ): BackendSetResponse<C>;
  private sendActions<
    C extends DatastoreCollectionType & DatastoreUpdateCollectionType
  >(
    baseAction: {
      readonly type: 'UPDATE';
      readonly payload: UpdateRequestPayload<C>;
    },
    path: Path<C>,
    query: RawQuery<C['DocumentType']> | undefined,
    data: ResponseData<
      C['Backend']['Update']['ReturnType'],
      C['Backend']['Update']['ErrorType']
    >,
  ): BackendUpdateResponse<C>;
  private sendActions<
    C extends DatastoreCollectionType & DatastoreDeleteCollectionType
  >(
    baseAction: {
      readonly type: 'DELETE';
      readonly payload: DeleteRequestPayload<C>;
    },
    path: Path<C>,
    query: RawQuery<C['DocumentType']> | undefined,
    data: ResponseData<
      C['Backend']['Delete']['ReturnType'],
      C['Backend']['Delete']['ErrorType']
    >,
  ): ResponseData<
    C['Backend']['Delete']['ReturnType'],
    C['Backend']['Delete']['ErrorType']
  >;
  private sendActions<
    C extends DatastoreCollectionType &
      DatastorePushCollectionType &
      DatastoreSetCollectionType &
      DatastoreUpdateCollectionType &
      DatastoreDeleteCollectionType
  >(
    baseAction:
      | { readonly type: 'PUSH'; readonly payload: PushRequestPayload<C> }
      | { readonly type: 'SET'; readonly payload: SetRequestPayload<C> }
      | { readonly type: 'UPDATE'; readonly payload: UpdateRequestPayload<C> }
      | { readonly type: 'DELETE'; readonly payload: DeleteRequestPayload<C> },
    path: Path<C>,
    query: RawQuery<C['DocumentType']> | undefined,
    data:
      | ResponseData<
          C['Backend']['Push']['ReturnType'],
          C['Backend']['Push']['ErrorType']
        >
      | ResponseData<
          C['Backend']['Set']['ReturnType'],
          C['Backend']['Set']['ErrorType']
        >
      | ResponseData<
          C['Backend']['Update']['ReturnType'],
          C['Backend']['Update']['ErrorType']
        >
      | ResponseData<
          C['Backend']['Delete']['ReturnType'],
          C['Backend']['Delete']['ErrorType']
        >,
  ):
    | BackendPushResponse<C>
    | BackendSetResponse<C>
    | BackendUpdateResponse<C>
    | BackendDeleteResponse<C> {
    switch (data.status) {
      case 'success': {
        const action: CollectionActions<C> =
          baseAction.type === 'PUSH'
            ? ({
                type: 'API_PUSH_SUCCESS',
                payload: {
                  type: baseAction.payload.type,
                  ref: baseAction.payload.ref,
                  document: baseAction.payload.document,
                  rawRequest: baseAction.payload.rawRequest,
                  result: data.result,
                },
              } as CollectionActions<C>)
            : baseAction.type === 'SET'
            ? ({
                type: 'API_SET_SUCCESS',
                payload: {
                  type: baseAction.payload.type,
                  ref: baseAction.payload.ref,
                  document: baseAction.payload.document,
                  originalDocument: baseAction.payload.originalDocument,
                  rawRequest: baseAction.payload.rawRequest,
                  result: data.result,
                },
              } as CollectionActions<C>)
            : baseAction.type === 'UPDATE'
            ? ({
                type: 'API_UPDATE_SUCCESS',
                payload: {
                  type: baseAction.payload.type,
                  ref: baseAction.payload.ref,
                  delta: baseAction.payload.delta,
                  originalDocument: baseAction.payload.originalDocument,
                  rawRequest: baseAction.payload.rawRequest,
                  result: data.result,
                },
              } as CollectionActions<C>)
            : ({
                type: 'API_DELETE_SUCCESS',
                payload: {
                  type: baseAction.payload.type,
                  ref: baseAction.payload.ref,
                  originalDocument: baseAction.payload.originalDocument,
                  rawRequest: baseAction.payload.rawRequest,
                  result: data.result,
                },
              } as CollectionActions<C>);
        this.store$.dispatch(action);
        return baseAction.type === 'PUSH'
          ? ({
              status: 'success',
              id: data.result && (data.result as any).id, // FIXME
            } as BackendSuccessResponse)
          : { status: 'success' };
      }
      default: {
        const action: CollectionActions<C> =
          baseAction.type === 'PUSH'
            ? ({
                type: 'API_PUSH_ERROR',
                payload: baseAction.payload,
              } as C extends DatastorePushCollectionType
                ? PushErrorAction<C>
                : never)
            : baseAction.type === 'SET'
            ? ({
                type: 'API_SET_ERROR',
                payload: baseAction.payload,
              } as C extends DatastoreSetCollectionType
                ? SetErrorAction<C>
                : never)
            : baseAction.type === 'UPDATE'
            ? ({
                type: 'API_UPDATE_ERROR',
                payload: baseAction.payload,
              } as C extends DatastoreUpdateCollectionType
                ? UpdateErrorAction<C>
                : never)
            : ({
                type: 'API_DELETE_ERROR',
                payload: baseAction.payload,
              } as C extends DatastoreDeleteCollectionType
                ? DeleteErrorAction<C>
                : never);
        this.store$.dispatch(action);
        return data;
      }
    }
  }

  addFeature<C extends DatastoreCollectionType>(
    collectionName: any, // FIXME
    requestFactory: BackendConfigs[any], // FIXME
  ): void {
    this.backendConfigs[collectionName] = requestFactory;
  }
}

export const BACKEND_COLLECTIONS = new InjectionToken<
  BackendCollectionsProvider
>('Backend Collections');

export const BACKEND_CONFIGS = new InjectionToken<BackendConfigsProvider>(
  'Backend Configs',
);

type BackendConfigFactory<C extends DatastoreCollectionType> = () => Backend<C>;

export type BackendCollectionsProvider = ReadonlyArray<any>; // FIXME
export type BackendConfigsProvider = ReadonlyArray<Backend<any>>; // FIXME

@NgModule({})
export class BackendRootModule {}

@NgModule({})
export class BackendFeatureModule {
  constructor(
    storeBackend: StoreBackend,
    @Inject(BACKEND_COLLECTIONS) backendCollections: BackendCollectionsProvider,
    @Inject(BACKEND_CONFIGS) backendConfigs: BackendConfigsProvider,
  ) {
    backendCollections.map((collectionName, index) => {
      storeBackend.addFeature(collectionName, backendConfigs[index]);
    });
  }
}

@NgModule({})
export class BackendModule {
  static forRoot(): ModuleWithProviders<BackendRootModule> {
    return {
      ngModule: BackendRootModule,
      providers: [StoreBackend],
    };
  }

  static forFeature<C extends DatastoreCollectionType>(
    collectionName: C['Name'],
    configFactory: BackendConfigFactory<C>,
  ): ModuleWithProviders<BackendFeatureModule> {
    return {
      ngModule: BackendFeatureModule,
      providers: [
        {
          provide: BACKEND_COLLECTIONS,
          multi: true,
          useValue: collectionName,
        },
        {
          provide: BACKEND_CONFIGS,
          multi: true,
          useFactory: configFactory,
        },
      ],
    };
  }
}
