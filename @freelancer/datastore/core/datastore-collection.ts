import * as Rx from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import {
  BackendDeleteResponse,
  BackendPushResponse,
  BackendSetResponse,
  BackendUpdateResponse,
} from './backend';
import { DatastoreDocument } from './datastore-document';
import { RecursivePartial } from './helpers';
import { RequestStatus } from './request-status-handler.service';
import { StoreBackendInterface } from './store-backend.interface';
import {
  ApproximateTotalCountType,
  DatastoreCollectionType,
  DatastorePushCollectionType,
  DatastoreSetCollectionType,
  MaybeDatastoreDeleteCollectionType,
  MaybeDatastorePushCollectionType,
  MaybeDatastoreSetCollectionType,
  MaybeDatastoreUpdateCollectionType,
  PushDocumentType,
  Reference,
  SetDocumentType,
} from './store.model';

export class DatastoreCollection<C extends DatastoreCollectionType> {
  constructor(
    private ref$: Rx.Observable<Reference<C>>,
    private storeBackend: StoreBackendInterface,
    public status$: Rx.Observable<RequestStatus<C>>,
    private valueChanges$: Rx.Observable<ReadonlyArray<C['DocumentType']>>,
    private approximateTotalCount$: Rx.Observable<
      ApproximateTotalCountType<C> | undefined
    >,
  ) {}

  valueChanges(): Rx.Observable<ReadonlyArray<C['DocumentType']>> {
    return this.valueChanges$;
  }

  approximateTotalCount(): Rx.Observable<
    ApproximateTotalCountType<C> | undefined
  > {
    return this.approximateTotalCount$;
  }

  push(
    // Make calling this function fail if you haven't defined `C['Backend']['Push']`
    document: C extends DatastorePushCollectionType
      ? PushDocumentType<C>
      : never,
  ): Promise<BackendPushResponse<MaybeDatastorePushCollectionType<C>>> {
    return this.ref$
      .pipe(
        take(1),
        map(
          // Unfortunate type casting
          ref => (ref as unknown) as Reference<C>,
        ),
        switchMap(ref => this.storeBackend.push(ref, document)),
      )
      .toPromise();
  }

  set(
    id: number | string,
    // Make calling this function fail if you haven't defined `C['Backend']['Set']`
    document: C extends DatastoreSetCollectionType ? SetDocumentType<C> : never,
  ): Promise<BackendSetResponse<MaybeDatastoreSetCollectionType<C>>> {
    return this.ref$
      .pipe(
        take(1),
        map(
          // Unfortunate type casting
          ref => (ref as unknown) as Reference<C>,
        ),
        switchMap(ref => this.storeBackend.set(ref, id, document)),
      )
      .toPromise();
  }

  update(
    id: number | string,
    // Make calling this function fail if you haven't defined `C['Backend']['Update']`
    delta: C['Backend']['Update'] extends never
      ? never
      : RecursivePartial<C['DocumentType']>,
  ): Promise<BackendUpdateResponse<MaybeDatastoreUpdateCollectionType<C>>> {
    return this.ref$
      .pipe(
        take(1),
        map(
          // Unfortunate type casting
          ref =>
            (ref as unknown) as Reference<
              MaybeDatastoreUpdateCollectionType<C>
            >,
        ),
        switchMap(ref =>
          this.storeBackend.update<MaybeDatastoreUpdateCollectionType<C>>(
            ref,
            id,
            delta,
          ),
        ),
      )
      .toPromise();
  }

  remove(
    // Make calling this function fail if you haven't defined `C['Backend']['Delete']`
    id: C['Backend']['Delete'] extends never ? never : number | string,
  ): Promise<BackendDeleteResponse<MaybeDatastoreDeleteCollectionType<C>>> {
    return this.ref$
      .pipe(
        take(1),
        map(
          // Unfortunate type casting
          ref =>
            (ref as unknown) as Reference<
              MaybeDatastoreDeleteCollectionType<C>
            >,
        ),
        switchMap(ref => this.storeBackend.delete(ref, id)),
      )
      .toPromise();
  }

  toDatastoreDocumentList(): Rx.Observable<
    ReadonlyArray<DatastoreDocument<C>>
  > {
    return this.valueChanges$.pipe(
      map(collections =>
        collections.map(
          collection =>
            new DatastoreDocument<C>(
              this.ref$.pipe(
                map(ref => ({
                  path: {
                    ...ref.path,
                    ids: [collection.id.toString()] as const,
                  },
                })),
              ),
              this.storeBackend,
              this.status$,
              Rx.of(collection),
            ),
        ),
      ),
    );
  }
}
