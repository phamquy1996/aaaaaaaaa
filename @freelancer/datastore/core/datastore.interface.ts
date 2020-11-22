import { HttpEvent } from '@angular/common/http';
import { Type } from '@angular/core';
import * as Rx from 'rxjs';
import { BackendErrorResponse } from './backend';
import { RequestDataOptions } from './request-data';

/** Auth user ID for logged-out use of the datastore */
export const LOGGED_OUT_KEY = '0';

export interface DatastoreConfig {
  readonly webSocketUrl: string;
  readonly enableStoreFreeze: boolean;
  readonly httpAdapter: Type<HttpAdapter>;
  readonly requestData: RequestDataOptions;
}

export interface SuccessResponseData<T> {
  readonly status: 'success';
  readonly result: T;
  readonly requestId?: string;
}

export type ErrorResponseData<E> = BackendErrorResponse<E>;

export type ResponseData<T, E> = SuccessResponseData<T> | ErrorResponseData<E>;

export interface HttpAdapter {
  get<T, E>(endpoint: string, options?: {}): Rx.Observable<ResponseData<T, E>>;
  get<T, E>(
    endpoint: string,
    options?: {},
  ): Rx.Observable<HttpEvent<ResponseData<T, E>>>;

  post<T, E>(
    endpoint: string,
    body: any | null,
    options?: {},
  ): Rx.Observable<ResponseData<T, E>>;
  post<T, E>(
    endpoint: string,
    body: any | null,
    options?: {},
  ): Rx.Observable<HttpEvent<ResponseData<T, E>>>;

  put<T, E>(
    endpoint: string,
    body: any | null,
    options?: {},
  ): Rx.Observable<ResponseData<T, E>>;
  put<T, E>(
    endpoint: string,
    body: any | null,
    options?: {},
  ): Rx.Observable<HttpEvent<ResponseData<T, E>>>;

  delete<T, E>(
    endpoint: string,
    options?: {},
  ): Rx.Observable<ResponseData<T, E>>;
  delete<T, E>(
    endpoint: string,
    options?: {},
  ): Rx.Observable<HttpEvent<ResponseData<T, E>>>;
}
