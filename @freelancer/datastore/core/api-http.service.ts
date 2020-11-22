import { Inject, Injectable } from '@angular/core';
import * as Rx from 'rxjs';
import {
  BackendDeleteRequest,
  BackendFetchRequest,
  BackendPushRequest,
  BackendSetRequest,
  BackendUpdateRequest,
} from './backend';
import { HTTP_ADAPTER } from './datastore.config';
import { HttpAdapter, ResponseData } from './datastore.interface';
import {
  DatastoreCollectionType,
  DatastoreDeleteCollectionType,
  DatastoreFetchCollectionType,
  DatastorePushCollectionType,
  DatastoreSetCollectionType,
  DatastoreUpdateCollectionType,
  Pagination,
} from './store.model';

export type ApiFetchResponse<
  C extends DatastoreCollectionType & DatastoreFetchCollectionType
> = ResponseData<
  C['Backend']['Fetch']['ReturnType'],
  C['Backend']['Fetch']['ErrorType']
>;

@Injectable()
export class ApiHttp {
  constructor(@Inject(HTTP_ADAPTER) private httpAdapter: HttpAdapter) {}

  fetch<C extends DatastoreCollectionType & DatastoreFetchCollectionType>(
    request: BackendFetchRequest<C>,
    pagination?: Pagination,
  ): Rx.Observable<ApiFetchResponse<C>> {
    const params = pagination
      ? {
          limit: pagination.limit,
          offset: pagination.offset,
          ...request.params,
        }
      : request.params;

    if ('method' in request && request.method === 'POST') {
      const body = {
        ...request.payload,
        ...request.params,
      };
      const options = {
        isGaf: request.isGaf,
        serializeBody: request.asFormData,
      };
      return this.httpAdapter.post(request.endpoint, body, options);
    }

    // default to `GET` if not specified
    return this.httpAdapter.get(request.endpoint, {
      params,
      isGaf: request.isGaf,
    });
  }

  post<C extends DatastoreCollectionType & DatastorePushCollectionType>(
    request: BackendPushRequest<C>,
  ): Rx.Observable<
    ResponseData<
      C['Backend']['Push']['ReturnType'],
      C['Backend']['Push']['ErrorType']
    >
  >;
  post<C extends DatastoreCollectionType & DatastoreSetCollectionType>(
    request: BackendSetRequest<C>,
  ): Rx.Observable<
    ResponseData<
      C['Backend']['Set']['ReturnType'],
      C['Backend']['Set']['ErrorType']
    >
  >;
  post<C extends DatastoreCollectionType & DatastoreUpdateCollectionType>(
    request: BackendUpdateRequest<C>,
  ): Rx.Observable<
    ResponseData<
      C['Backend']['Update']['ReturnType'],
      C['Backend']['Update']['ErrorType']
    >
  >;
  post<C extends DatastoreCollectionType & DatastoreDeleteCollectionType>(
    request: BackendDeleteRequest<C>,
  ): Rx.Observable<
    ResponseData<
      C['Backend']['Delete']['ReturnType'],
      C['Backend']['Delete']['ErrorType']
    >
  >;
  post<
    C extends DatastoreCollectionType &
      DatastorePushCollectionType &
      DatastoreSetCollectionType &
      DatastoreUpdateCollectionType &
      DatastoreDeleteCollectionType
  >(
    request:
      | BackendPushRequest<C>
      | BackendSetRequest<C>
      | BackendUpdateRequest<C>
      | BackendDeleteRequest<C>,
  ): Rx.Observable<
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
      >
  > {
    const body = {
      ...request.payload,
      ...request.params,
    };
    const options = {
      isGaf: request.isGaf,
      serializeBody: request.asFormData,
    };
    return this.httpAdapter.post(request.endpoint, body, options);
  }

  put<C extends DatastoreCollectionType & DatastoreUpdateCollectionType>(
    request: BackendUpdateRequest<C>,
  ): Rx.Observable<
    ResponseData<
      C['Backend']['Update']['ReturnType'],
      C['Backend']['Update']['ErrorType']
    >
  >;
  put<C extends DatastoreCollectionType & DatastoreDeleteCollectionType>(
    request: BackendDeleteRequest<C>,
  ): Rx.Observable<
    ResponseData<
      C['Backend']['Delete']['ReturnType'],
      C['Backend']['Delete']['ErrorType']
    >
  >;
  put<
    C extends DatastoreCollectionType &
      DatastoreUpdateCollectionType &
      DatastoreDeleteCollectionType
  >(
    request: BackendUpdateRequest<C> | BackendDeleteRequest<C>,
  ): Rx.Observable<
    | ResponseData<
        C['Backend']['Update']['ReturnType'],
        C['Backend']['Update']['ErrorType']
      >
    | ResponseData<
        C['Backend']['Delete']['ReturnType'],
        C['Backend']['Delete']['ErrorType']
      >
  > {
    const body = {
      ...request.payload,
      ...request.params,
    };
    const options = {
      isGaf: request.isGaf,
      serializeBody: request.asFormData,
    };
    return this.httpAdapter.put(request.endpoint, body, options);
  }
  delete<C extends DatastoreCollectionType & DatastoreDeleteCollectionType>(
    request: BackendDeleteRequest<C>,
  ): Rx.Observable<
    ResponseData<
      C['Backend']['Delete']['ReturnType'],
      C['Backend']['Delete']['ErrorType']
    >
  > {
    const params = {
      ...request.payload,
      ...request.params,
    };

    const options = {
      params,
      isGaf: request.isGaf,
    };
    return this.httpAdapter.delete(request.endpoint, options);
  }
}
