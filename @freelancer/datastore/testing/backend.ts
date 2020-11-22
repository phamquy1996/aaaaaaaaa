import {
  Inject,
  Injectable,
  ModuleWithProviders,
  NgModule,
} from '@angular/core';
import {
  addDocumentMetadata,
  Backend,
  BackendCollectionsProvider,
  BackendConfigs,
  BackendConfigsProvider,
  BackendPushResponse,
  BackendSuccessResponse,
  BACKEND_COLLECTIONS,
  BACKEND_CONFIGS,
  BACKEND_DEFAULT_BATCH_SIZE,
  DatastoreCollectionType,
  DatastoreFetchCollectionType,
  DatastoreMissingModuleError,
  DatastorePushCollectionType,
  DatastoreSetCollectionType,
  DatastoreUpdateCollectionType,
  deepSpread,
  mergeRawDocuments,
  Ordering,
  PushDocumentType,
  RecursivePartial,
  Reference,
  StoreBackend,
  StoreBackendInterface,
} from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import * as Rx from 'rxjs';
import {
  MutationPropagator,
  PushTransformer,
  UpdateTransformer,
} from './datastore-testing-controller';
import { DatastoreFakeConfig, DATASTORE_FAKE_CONFIG } from './datastore.config';
import { debugConsoleLog, debugConsoleWarn } from './datastore.helpers';
import { FakeStoreState } from './store.model';

/**
 * The error code from `RequestError`,
 * combined with `'UNKNOWN_ERROR'` from `BackendErrorResponse`
 */
export type RequestErrorCode<
  C extends DatastoreCollectionType & DatastoreFetchCollectionType
> =
  | C['Backend']['Fetch']['ErrorType']
  | ErrorCodeApi.NOT_FOUND
  | 'UNKNOWN_ERROR';

/**
 * We can simulate either that the datastore errors, or never returns a result.
 */
export type SimulatedRequestFailure<
  C extends DatastoreCollectionType & DatastoreFetchCollectionType
> =
  | { readonly status: 'error'; readonly errorCode: RequestErrorCode<C> }
  | { readonly status: 'pending' };

@Injectable()
export class StoreBackendFake implements StoreBackendInterface {
  // FIXME: Consider saving this in session storage
  private storeStateSubject$: Rx.BehaviorSubject<
    FakeStoreState
  > = new Rx.BehaviorSubject({});
  storeState$ = this.storeStateSubject$.asObservable();

  private backendConfigs: BackendConfigs = {};

  // This isn't typed wonderfully. Ideally it would know what type it maps to.
  pushTransformers: Map<
    string,
    PushTransformer<DatastoreCollectionType & DatastorePushCollectionType>
  > = new Map();
  updateTransformers: Map<
    string,
    UpdateTransformer<DatastoreCollectionType & DatastoreUpdateCollectionType>
  > = new Map();
  mutationPropagators: ReadonlyArray<
    MutationPropagator<
      DatastoreCollectionType &
        DatastorePushCollectionType &
        DatastoreUpdateCollectionType,
      DatastoreCollectionType &
        DatastorePushCollectionType &
        DatastoreUpdateCollectionType
    >
  > = [];

  collectionsToFail: Map<string, SimulatedRequestFailure<any>> = new Map();
  requestsToFail: Map<string, SimulatedRequestFailure<any>> = new Map();

  constructor(
    @Inject(DATASTORE_FAKE_CONFIG) private datastoreConfig: DatastoreFakeConfig,
  ) {}

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
    return BACKEND_DEFAULT_BATCH_SIZE;
  }

  /** Pushes a document without transforming it or pushing to related collections. */
  pushRaw<C extends DatastoreCollectionType & DatastorePushCollectionType>(
    ref: Reference<C>,
    document: C['DocumentType'],
  ): Rx.Observable<BackendPushResponse<C>> {
    debugConsoleLog(
      this.datastoreConfig,
      `Pushing to '${ref.path.collection}' raw document`,
      document,
    );

    this.pushInternal(ref, document);

    return Rx.of({
      status: 'success',
      id: (document as any).id,
    });
  }

  push<C extends DatastoreCollectionType & DatastorePushCollectionType>(
    ref: Reference<C>,
    document: PushDocumentType<C> & Partial<Pick<C['DocumentType'], 'id'>>,
    extra?: { readonly [index: string]: string | number },
  ): Rx.Observable<BackendPushResponse<C>> {
    debugConsoleLog(
      this.datastoreConfig,
      `Pushing to '${ref.path.collection}' document`,
      document,
    );

    const refCollection = ref.path.collection;
    const collectionFailure = this.collectionsToFail.get(refCollection);

    if (collectionFailure?.status === 'error') {
      debugConsoleLog(
        this.datastoreConfig,
        `Push to '${ref.path.collection}' failing with error code ${collectionFailure.errorCode}`,
        document,
      );
      return Rx.of({
        status: 'error',
        errorCode: collectionFailure.errorCode,
      } as const);
    }

    if (collectionFailure?.status === 'pending') {
      return Rx.NEVER;
    }

    const collectionsToPush = this.getTargetCollections(
      refCollection,
      'push',
      this.mutationPropagators,
    );

    let refDocumentId: string | number | undefined;
    collectionsToPush.forEach(collection => {
      if (collection !== refCollection) {
        debugConsoleLog(
          this.datastoreConfig,
          `Pushing to '${collection}' document which is related to '${refCollection}'`,
          document,
        );
      }

      const pushTransformer = this.getPushTransformer(
        refCollection,
        collection,
        this.pushTransformers,
        this.mutationPropagators,
      );

      const transformedDocument = pushTransformer(
        toNumber(ref.path.authUid),
        document,
        extra,
      );
      if (collection === refCollection) {
        refDocumentId = transformedDocument.id;
      }

      this.pushInternal(
        { ...ref, path: { ...ref.path, collection } },
        transformedDocument,
      );
    });

    return Rx.of({
      status: 'success',
      id: (refDocumentId as any) || 0,
    });
  }

  private pushInternal<
    C extends DatastoreCollectionType & DatastorePushCollectionType
  >(
    { path: { collection, authUid } }: Reference<C>,
    document: C['DocumentType'],
  ): void {
    const storeState = this.storeStateSubject$.getValue();
    const collectionSlice = storeState[collection];

    if (collectionSlice === undefined) {
      this.storeStateSubject$.next({
        ...storeState,
        [collection]: {
          [authUid]: {
            documents: addDocumentMetadata([document]),
          },
        },
      });
    } else {
      const userCollectionSlice = collectionSlice[authUid];

      if (userCollectionSlice === undefined) {
        this.storeStateSubject$.next({
          ...storeState,
          [collection]: {
            ...collectionSlice,
            [authUid]: {
              documents: addDocumentMetadata([document]),
            },
          },
        });
      } else {
        this.storeStateSubject$.next({
          ...storeState,
          [collection]: {
            ...collectionSlice,
            [authUid]: {
              documents: mergeRawDocuments(
                userCollectionSlice.documents,
                addDocumentMetadata([document]),
              ),
            },
          },
        });
      }
    }
  }

  set<C extends DatastoreCollectionType & DatastoreSetCollectionType>(
    { path: { collection, authUid } }: Reference<C>,
    id: number | string,
    document: C['DocumentType'],
  ): Rx.Observable<BackendSuccessResponse> {
    debugConsoleLog(
      this.datastoreConfig,
      `Setting '${id}' in '${collection}' document`,
      document,
    );

    const storeState = this.storeStateSubject$.getValue();
    const collectionSlice = storeState[collection];

    if (collectionSlice === undefined) {
      this.storeStateSubject$.next({
        ...storeState,
        [collection]: {
          [authUid]: {
            documents: addDocumentMetadata([document]),
          },
        },
      });
    } else {
      const userCollectionSlice = collectionSlice[authUid];

      if (userCollectionSlice === undefined) {
        this.storeStateSubject$.next({
          ...storeState,
          [collection]: {
            ...collectionSlice,
            [authUid]: {
              documents: addDocumentMetadata([document]),
            },
          },
        });
      } else {
        this.storeStateSubject$.next({
          ...storeState,
          [collection]: {
            ...collectionSlice,
            [authUid]: {
              documents: mergeRawDocuments(
                userCollectionSlice.documents,
                addDocumentMetadata([document]),
              ),
            },
          },
        });
      }
    }

    return Rx.of({ status: 'success' });
  }

  /**
   * Merges a delta to the document, as well as the same delta to any documents
   * in related collections.
   */
  update<C extends DatastoreCollectionType>(
    { path: { collection: refCollection, authUid } }: Reference<C>,
    id: number | string,
    delta: RecursivePartial<C['DocumentType']>,
  ): Rx.Observable<BackendSuccessResponse> {
    debugConsoleLog(
      this.datastoreConfig,
      `Updating '${id}' in ${refCollection} with delta`,
      delta,
    );

    const collectionsToUpdate = this.getTargetCollections(
      refCollection,
      'update',
      this.mutationPropagators,
    );

    collectionsToUpdate.forEach(collection => {
      const storeState = this.storeStateSubject$.getValue();
      const collectionSlice = storeState[collection];
      if (collectionSlice === undefined) {
        debugConsoleWarn(
          this.datastoreConfig,
          "Trying to merge into a collection that doesn't exist. Skipping",
        );
        return Rx.of({ status: 'success' });
      }

      const userCollectionSlice = collectionSlice[authUid];
      if (userCollectionSlice === undefined) {
        debugConsoleWarn(
          this.datastoreConfig,
          "Trying to merge into a collection that doesn't exist for this user. Skipping",
        );
        return Rx.of({ status: 'success' });
      }

      const updatePropagator = this.getUpdatePropagator(
        refCollection,
        collection,
        this.mutationPropagators,
      );

      let updatedDocument;
      if (updatePropagator) {
        // Update document in the related collection, applying the propagator transformer
        const refCollectionSlice = storeState[refCollection];
        if (refCollectionSlice === undefined) {
          throw new Error(`Cannot merge into a collection that doesn't exist`);
        }
        const userRefCollectionSlice = refCollectionSlice[authUid];
        if (userRefCollectionSlice === undefined) {
          throw new Error(
            `Cannot merge into a collection that doesn't exist for this user`,
          );
        }

        const originalDocument =
          userRefCollectionSlice.documents[id].rawDocument;
        const targetDocumentId = updatePropagator.targetDocumentId(
          originalDocument,
        );
        const targetDocument = userCollectionSlice.documents[targetDocumentId];
        if (!targetDocument) {
          throw new Error(
            `Document '${targetDocumentId}' in ${collection} could not be found while propagating updates from ${refCollection}`,
          );
        }

        // Default to merging the delta if no propagator transformer is provided
        updatedDocument = updatePropagator.transformer
          ? updatePropagator.transformer(
              toNumber(authUid),
              delta as any, // FIXME
              originalDocument,
              targetDocument.rawDocument,
            )
          : deepSpread(targetDocument.rawDocument, delta);

        debugConsoleLog(
          this.datastoreConfig,
          `Updating '${targetDocumentId}' in ${collection} which is related to '${refCollection}' with document`,
          updatedDocument,
        );
      } else {
        // Update document in the original collection, applying the transformer
        // if present, otherwise merge the delta
        const originalDocument = userCollectionSlice.documents[id].rawDocument;
        const updateTransformer = this.updateTransformers.get(collection);
        updatedDocument = updateTransformer
          ? updateTransformer(toNumber(authUid), originalDocument, delta as any) // FIXME
          : deepSpread(originalDocument, delta);
      }

      this.storeStateSubject$.next({
        ...storeState,
        [collection]: {
          ...collectionSlice,
          [authUid]: {
            documents: mergeRawDocuments(
              userCollectionSlice.documents,
              addDocumentMetadata([updatedDocument]),
            ),
          },
        },
      });
    });

    return Rx.of({ status: 'success' });
  }

  delete<C extends DatastoreCollectionType>(
    { path: { collection, authUid } }: Reference<C>,
    id: number | string,
  ): Rx.Observable<BackendSuccessResponse> {
    debugConsoleLog(
      this.datastoreConfig,
      `Deleting '${id}' from ${collection}.`,
    );

    const storeState = this.storeStateSubject$.getValue();
    const collectionSlice = storeState[collection];

    if (collectionSlice === undefined) {
      debugConsoleWarn(
        this.datastoreConfig,
        `Trying to delete from '${collection}' which doesn't exist. Skipping`,
      );
      return Rx.of({ status: 'success' });
    }

    const userCollectionSlice = collectionSlice[authUid];
    if (userCollectionSlice === undefined) {
      debugConsoleWarn(
        this.datastoreConfig,
        `Trying to delete from '${collection}' which doesn't exist for user ${authUid}. Skipping`,
      );
      return Rx.of({ status: 'success' });
    }

    const documents = { ...userCollectionSlice.documents };
    delete documents[id];

    this.storeStateSubject$.next({
      ...storeState,
      [collection]: {
        ...collectionSlice,
        [authUid]: {
          documents,
        },
      },
    });
    return Rx.of({ status: 'success' });
  }

  /**
   * Clears the state, push transformers and resets errors.
   */
  reset<C extends DatastoreCollectionType>(
    authUid: string,
    collection?: C['Name'],
  ) {
    const storeState = this.storeStateSubject$.getValue();

    if (!collection) {
      debugConsoleLog(
        this.datastoreConfig,
        'Resetting the store to an empty state. You can ignore any "missing collection/document" warnings after this message.',
      );
      this.collectionsToFail.clear();
      this.requestsToFail.clear();
      this.pushTransformers.clear();
      this.updateTransformers.clear();
      this.mutationPropagators = [];
      this.storeStateSubject$.next({});
      return;
    }

    this.collectionsToFail.delete(collection);
    this.requestsToFail.forEach((value, key) => {
      if (key.split(';')[0] === collection) {
        this.requestsToFail.delete(key);
      }
    });
    this.pushTransformers.delete(collection);
    this.updateTransformers.delete(collection);
    this.mutationPropagators = this.mutationPropagators.filter(
      propagator =>
        propagator.from === collection || propagator.to === collection,
    );

    const collectionSlice = storeState[collection];
    if (collectionSlice === undefined) {
      debugConsoleWarn(
        this.datastoreConfig,
        `Trying to reset '${collection}' which doesn't exist. Skipping`,
      );
      return;
    }

    this.storeStateSubject$.next(
      collection
        ? {
            ...storeState,
            [collection]: {
              ...collectionSlice,
              [authUid]: {
                documents: {},
              },
            },
          }
        : {},
    );
  }

  addFeature<C extends DatastoreCollectionType>(
    collectionName: any, // FIXME
    requestFactory: BackendConfigs[any], // FIXME
  ): void {
    this.backendConfigs[collectionName] = requestFactory;
  }

  // Get a list of collections to update.
  private getTargetCollections<C extends DatastoreCollectionType>(
    originalCollection: C['Name'],
    method: 'push' | 'update',
    mutationPropagators: ReadonlyArray<
      MutationPropagator<
        DatastoreCollectionType & DatastorePushCollectionType,
        DatastoreCollectionType & DatastorePushCollectionType
      >
    >,
  ): ReadonlyArray<C['Name']> {
    const targets = new Set([originalCollection]);
    mutationPropagators.forEach(propagator => {
      if (propagator.from === originalCollection && propagator.config[method]) {
        targets.add(propagator.to);
      }
    });
    return Array.from(targets);
  }

  private getPushTransformer<
    C1 extends DatastoreCollectionType,
    C2 extends DatastoreCollectionType
  >(
    originalCollection: C1['Name'],
    targetCollection: C2['Name'],
    pushTransformers: Map<
      string,
      PushTransformer<DatastoreCollectionType & DatastorePushCollectionType>
    >,
    mutationPropagators: ReadonlyArray<
      MutationPropagator<
        DatastoreCollectionType &
          DatastorePushCollectionType &
          DatastorePushCollectionType,
        DatastoreCollectionType &
          DatastorePushCollectionType &
          DatastorePushCollectionType
      >
    >,
  ) {
    // Use the propagator transformer instead of the push transformer if it has
    // been specified between two different collections
    if (originalCollection !== targetCollection) {
      const propagator = mutationPropagators.find(
        p =>
          p.from === originalCollection &&
          p.to === targetCollection &&
          p.config.push,
      );

      if (!(propagator && propagator.config.push)) {
        debugConsoleWarn(
          this.datastoreConfig,
          `Missing push propagator from '${originalCollection}' to '${targetCollection}'`,
        );
        throw new Error(
          `Missing push propagator from '${originalCollection}' to '${targetCollection}'`,
        );
      }

      return propagator.config.push;
    }

    const transformer = pushTransformers.get(targetCollection);
    if (!transformer) {
      // toPromise() on a `createDocument` call seems to swallow errors
      console.error(
        this.datastoreConfig,
        `Missing push transformer for collection '${targetCollection}'`,
      );
      throw new Error(
        `Missing push transformer for collection '${targetCollection}'`,
      );
    }
    return transformer;
  }

  private getUpdatePropagator<
    C1 extends DatastoreCollectionType,
    C2 extends DatastoreCollectionType
  >(
    originalCollection: C1['Name'],
    targetCollection: C2['Name'],
    mutationPropagators: ReadonlyArray<
      MutationPropagator<
        DatastoreCollectionType &
          DatastorePushCollectionType &
          DatastoreUpdateCollectionType,
        DatastoreCollectionType &
          DatastorePushCollectionType &
          DatastoreUpdateCollectionType
      >
    >,
  ) {
    if (originalCollection !== targetCollection) {
      const propagator = mutationPropagators.find(
        p =>
          p.from === originalCollection &&
          p.to === targetCollection &&
          p.config.update,
      );

      if (!propagator) {
        debugConsoleWarn(
          this.datastoreConfig,
          `Missing update propagator from '${originalCollection}' to '${targetCollection}'`,
        );
        throw new Error(
          `Missing update propagator from '${originalCollection}' to '${targetCollection}'`,
        );
      }

      return propagator.config.update;
    }

    return undefined;
  }
}

type BackendConfigFactory<C extends DatastoreCollectionType> = () => Backend<C>;

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
export class BackendFakeModule {
  static forRoot(): ModuleWithProviders<BackendRootModule> {
    return {
      ngModule: BackendRootModule,
      providers: [
        StoreBackendFake,
        { provide: StoreBackend, useExisting: StoreBackendFake }, // BackendModule.forFeature
      ],
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
