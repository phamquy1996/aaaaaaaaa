import * as Rx from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import {
  BackendDeleteResponse,
  BackendSetResponse,
  BackendUpdateResponse,
} from './backend';
import { RecursivePartial } from './helpers';
import { RequestStatus } from './request-status-handler.service';
import { StoreBackendInterface } from './store-backend.interface';
import {
  DatastoreCollectionType,
  MaybeDatastoreDeleteCollectionType,
  MaybeDatastoreSetCollectionType,
  MaybeDatastoreUpdateCollectionType,
  Reference,
} from './store.model';

export type ReferenceWithId<C extends DatastoreCollectionType> = Reference<
  C
> & {
  // The path needs to have a single entry in `ids` for a Document
  readonly path: {
    readonly ids: [string];
  };
};

export class DatastoreDocument<C extends DatastoreCollectionType> {
  /**
   * There are two types of documents, those referenced by `id` and those
   * referenced by a `secondary id`. The former have a single `id` in the path,
   * the latter have a query and will need to check `valueChanges` to get the
   * `id`.
   *
   * The latter way will do a network request if the observable has not been
   * subscribed to already (which should be rare).
   */
  private id$: Rx.Observable<string>;

  constructor(
    private ref$: Rx.Observable<Reference<C>>,
    private storeBackend: StoreBackendInterface,
    public status$: Rx.Observable<RequestStatus<C>>,
    private valueChanges$: Rx.Observable<C['DocumentType']>,
  ) {
    this.id$ = this.ref$.pipe(
      switchMap(ref =>
        ref.path.ids
          ? Rx.of(ref.path.ids[0])
          : this.valueChanges$.pipe(
              map(valueChange => valueChange.id.toString()),
            ),
      ),
    );
  }

  valueChanges(): Rx.Observable<C['DocumentType']> {
    return this.valueChanges$;
  }

  set(
    // Make calling this function fail if you haven't defined `C['Backend']['Set']`
    document: C['Backend']['Set'] extends never ? never : C['DocumentType'],
  ): Promise<BackendSetResponse<MaybeDatastoreSetCollectionType<C>>> {
    return Rx.combineLatest([this.ref$, this.id$])
      .pipe(
        take(1),
        map(
          // Unfortunate type casting
          ([ref, id]) =>
            [
              (ref as unknown) as Reference<MaybeDatastoreSetCollectionType<C>>,
              id,
            ] as const,
        ),
        switchMap(([ref, id]) => this.storeBackend.set(ref, id, document)),
      )
      .toPromise();
  }

  update(
    // Make calling this function fail if you haven't defined `C['Backend']['Update']`
    delta: C['Backend']['Update'] extends never
      ? never
      : RecursivePartial<C['DocumentType']>,
  ): Promise<BackendUpdateResponse<MaybeDatastoreUpdateCollectionType<C>>> {
    return Rx.combineLatest([this.ref$, this.id$])
      .pipe(
        take(1),
        map(
          // Unfortunate type casting
          ([ref, id]) =>
            [
              (ref as unknown) as Reference<
                MaybeDatastoreUpdateCollectionType<C>
              >,
              id,
            ] as const,
        ),
        switchMap(([ref, id]) =>
          this.storeBackend.update<MaybeDatastoreUpdateCollectionType<C>>(
            ref,
            id,
            delta,
          ),
        ),
      )
      .toPromise();
  }

  remove(): Promise<
    BackendDeleteResponse<MaybeDatastoreDeleteCollectionType<C>>
  > {
    return Rx.combineLatest([this.ref$, this.id$])
      .pipe(
        take(1),
        map(
          // Unfortunate type casting
          ([ref, id]) =>
            [
              (ref as unknown) as Reference<
                MaybeDatastoreDeleteCollectionType<C>
              >,
              id,
            ] as const,
        ),
        switchMap(([ref, id]) => this.storeBackend.delete(ref, id)),
      )
      .toPromise();
  }
}
