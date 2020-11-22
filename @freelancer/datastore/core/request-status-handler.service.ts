import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import * as Rx from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { RequestDataPayload } from './actions';
import { BackendErrorResponse } from './backend';
import {
  DatastoreCollectionType,
  DatastoreFetchCollectionType,
  StoreState,
} from './store.model';

interface RequestStatusWrapper {
  readonly request: RequestDataPayload<any>;
  readonly statusObject: RequestStatusWithoutRetry<any>;
}

export type RequestErrorWithoutRetry<
  C extends DatastoreCollectionType & DatastoreFetchCollectionType
> = Pick<
  // Technically only datastore.document calls return NOT_FOUND, rather than
  // needing to add this to datastore.collection calls too. This type is
  // separate from BackendErrorResponse because NOT_FOUND is added by the
  // datastore internally, rather than originating from the backend.
  BackendErrorResponse<
    C['Backend']['Fetch']['ErrorType'] | ErrorCodeApi.NOT_FOUND
  >,
  'errorCode' | 'requestId'
>;

export interface RequestError<
  C extends DatastoreCollectionType & DatastoreFetchCollectionType
> extends RequestErrorWithoutRetry<C> {
  retry(): void;
}

export interface RequestStatusWithoutRetry<C extends DatastoreCollectionType> {
  readonly ready: boolean;
  readonly error?: C extends DatastoreFetchCollectionType
    ? RequestErrorWithoutRetry<C>
    : never;
}

export interface RequestStatus<C extends DatastoreCollectionType> {
  readonly ready: boolean;
  readonly error?: C extends DatastoreFetchCollectionType
    ? RequestError<C>
    : never;
}

@Injectable()
export class RequestStatusHandler {
  private _statusStreamSubject$: Rx.Subject<RequestStatusWrapper>;

  constructor(private store$: Store<StoreState>) {
    this._statusStreamSubject$ = new Rx.Subject();
  }

  get statusStream$() {
    return this._statusStreamSubject$.asObservable();
  }

  /**
   * Get an observable for the status of a given request
   *
   * @privateRemarks
   *
   * The original request is spread into the payload member to create a new
   * instance of the object which will not get deduped by the `dedupeRequests`
   * handler which only compared object references to determine whether an
   * object is a duplicate or not.
   */
  get$<C extends DatastoreCollectionType>(
    request: RequestDataPayload<C>,
  ): Rx.Observable<RequestStatus<C>> {
    return this._statusStreamSubject$.pipe(
      filter(e =>
        e.request.clientRequestIds.some(id =>
          request.clientRequestIds.includes(id),
        ),
      ),
      map(e => {
        if (e.statusObject.error) {
          return {
            ...e.statusObject,
            error: {
              ...e.statusObject.error,
              retry: () => {
                const action = {
                  type: 'REQUEST_DATA',
                  payload: {
                    ...e.request,
                  },
                };
                this.store$.dispatch(action);
                this.update(e.request, { ready: false });
              },
            },
          } as RequestStatus<C>;
        }
        // FIXME: Remove cast
        return e.statusObject as RequestStatus<C>;
      }),
    );
  }

  update<C extends DatastoreCollectionType>(
    request: RequestDataPayload<C>,
    status: RequestStatusWithoutRetry<C>,
  ) {
    this._statusStreamSubject$.next({
      request,
      statusObject: status,
    });
  }
}

export function requestStatusesEqual<C extends DatastoreCollectionType>(
  a: RequestStatus<C>,
  b: RequestStatus<C>,
) {
  return (
    // Plain ready flag, no error
    (a.ready === b.ready && !a.error && !b.error) ||
    // Not ready, error codes equal
    (!a.ready &&
      !b.ready &&
      !!a.error &&
      !!b.error &&
      a.error.errorCode === b.error.errorCode)
  );
}
