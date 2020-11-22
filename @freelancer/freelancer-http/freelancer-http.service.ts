import { isPlatformServer } from '@angular/common';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHeaders,
  HttpParameterCodec,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import {
  ErrorHandler,
  Inject,
  Injectable,
  Optional,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceInterface } from '@freelancer/auth';
import { Applications, APP_NAME } from '@freelancer/config';
import {
  ErrorResponseData,
  HttpAdapter,
  ResponseData,
} from '@freelancer/datastore';
import { Localization } from '@freelancer/localization';
import { Location } from '@freelancer/location';
import { isDefined } from '@freelancer/utils';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import * as Rx from 'rxjs';
import {
  catchError,
  map,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  FREELANCER_HTTP_ABTEST_OVERRIDES_PROVIDER,
  FREELANCER_HTTP_AUTH_PROVIDERS,
  FREELANCER_HTTP_CONFIG,
} from './freelancer-http.config';
import {
  FreelancerHttpABTestOverridesInterface,
  FreelancerHttpConfig,
} from './freelancer-http.interface';

type RequestParamsObjectArrayValue = ReadonlyArray<
  string | number | boolean | RequestParamsObject | undefined
>;

export enum FreelancerHttpService {
  AJAX_API,
  API,
  AUTH,
}

// headers for tracking app info
export const FREELANCER_APP_BUILD_TIMESTAMP_HEADER =
  'freelancer-app-build-timestamp';
export const FREELANCER_APP_NAME_HEADER = 'freelancer-app-name';
export const FREELANCER_APP_LOCALE_HEADER = 'freelancer-app-locale';

interface RequestParamsObject {
  [k: string]:
    | string
    | number
    | boolean
    | RequestParamsObjectArrayValue
    | RequestParamsObject
    | undefined;
}

interface RawSuccessResponseData<T> {
  status: 'success';
  result: T;
  request_id?: string;
}

/**
 * Request options that serves as an alias for request options for HttpClient
 * methods (because they don't export them) plus a couple .
 * These are limited to currently the commonly used options for a direct
 * HTTP request. If you're missing anything that HttpClient has, please check
 * the docs on HttpClient requests and see if they are shared between all CRUD
 * methods first, then you're free to add it in.
 */
export interface RequestOptions<E> {
  // @deprecated, use service
  isGaf?: boolean;
  service?: FreelancerHttpService;
  serializeBody?: boolean;
  /**
   * A list of errors "expected" as part of the normal site flow.
   * These errors won't be sent to the `ErrorHandler` so they won't log extra details
   * and they won't be sent as part of our backend error logging.
   */
  errorWhitelist?: E[];
  params?: RequestParamsObject | HttpParams;
  reportProgress?: boolean;
  headers?: HttpHeaders;
  withCredentials?: boolean;
}

/*
 * This removes the special parameter encoding done by Angular for apparently
 * no reason, see https://github.com/angular/angular/issues/18261.
 * FIXME: remove that when Angular has fixed it.
 */
class CustomEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}

@Injectable({
  providedIn: 'root',
})
export class FreelancerHttp implements HttpAdapter {
  private readonly requestParams = {
    // Strip out null values on the response.
    compact: 'true',
    // Receive new error format
    new_errors: 'true',
    // Receive integer Pool IDs in the response. FIXME: Cleanup T220848
    new_pools: 'true',
  };

  private isCheckingAuthState: boolean;

  constructor(
    private location: Location,
    private router: Router,
    private http: HttpClient,
    @Inject(FREELANCER_HTTP_AUTH_PROVIDERS)
    private authProviders: ReadonlyArray<AuthServiceInterface>,
    private errorHandler: ErrorHandler,
    @Inject(FREELANCER_HTTP_CONFIG)
    private freelancerHttpConfig: FreelancerHttpConfig,
    @Inject(APP_NAME) private appName: Applications,
    @Inject(PLATFORM_ID) private platformId: Object,
    private localization: Localization,
    @Inject(FREELANCER_HTTP_ABTEST_OVERRIDES_PROVIDER)
    @Optional()
    private abTestOverridesHeader?: FreelancerHttpABTestOverridesInterface,
  ) {}

  /**
   * Utility function to merge the Auth headers with the request headers.
   * @param extraHeaders HttpHeaders from Auth
   * @param requestHeaders HttpHeaders specified on the request options.
   */
  private mergeExtraHeadersWithRequestHeaders(
    extraHeadersArray: ReadonlyArray<HttpHeaders>,
    requestHeaders?: HttpHeaders,
  ) {
    let extraHeaders = new HttpHeaders();
    extraHeadersArray.forEach(headers =>
      headers.keys().forEach(key => {
        const values = headers.getAll(key);
        if (values) {
          extraHeaders = extraHeaders.append(key, values);
        }
      }),
    );

    if (!requestHeaders) {
      return extraHeaders;
    }

    return extraHeaders.keys().reduce((obj, key) => {
      const values = extraHeaders.getAll(key);
      return values ? obj.append(key, values) : obj;
    }, requestHeaders);
  }

  /**
   * Get the base URL to use based on the resource you want to access
   * @param service FreelancerHttpService
   */
  getBaseServiceUrl(
    service: FreelancerHttpService = FreelancerHttpService.API,
  ) {
    switch (service) {
      case FreelancerHttpService.API:
        return this.freelancerHttpConfig.apiBaseUrl;
      case FreelancerHttpService.AJAX_API:
        return this.freelancerHttpConfig.ajaxBaseUrl;
      case FreelancerHttpService.AUTH:
        return this.freelancerHttpConfig.authBaseUrl;
      default:
        return this.freelancerHttpConfig.apiBaseUrl;
    }
  }

  /**
   * Format response body to the interface that we want to return.
   * For now it's only adding a status code into the response body.
   * @param response The HttpResponse object.
   */
  private formatResponseBody<T, E>(
    response: HttpResponse<RawSuccessResponseData<T>>,
  ): ResponseData<T, E | 'UNKNOWN_ERROR'> {
    if (response.body === null) {
      console.error('No response body', response);
      return {
        status: 'error',
        errorCode: 'UNKNOWN_ERROR',
      };
    }

    if (response.body.status !== 'success') {
      console.error('Malformed backend response', response.body);
      return {
        status: 'error',
        errorCode: 'UNKNOWN_ERROR',
      };
    }

    return {
      status: response.body.status,
      result: response.body.result,
      requestId: response.body.request_id,
    };
  }

  private formatErrorBody<E>(
    error: HttpErrorResponse,
  ): ErrorResponseData<E | 'UNKNOWN_ERROR'> {
    if (error.error && error.error.error !== undefined) {
      return {
        status: 'error',
        errorCode: error.error.error.code,
        requestId: error.error.request_id,
      };
    }

    // Another type of backend error occured, e.g. External LB or Varnish.
    return {
      status: 'error',
      errorCode: 'UNKNOWN_ERROR',
    };
  }

  /**
   * Handles error responses from the API and returns a formatted body
   * in a form appropriate for the request options
   *
   * Reports to the global error handler depending on whitelist logic.
   * @param error The HttpErrorResponse object
   * @param options The request options
   */
  private handleError<T = any, E = any>(
    error: HttpErrorResponse,
    options?: RequestOptions<E | 'UNKNOWN_ERROR'> & { reportProgress?: false },
  ): Rx.Observable<ResponseData<T, E | 'UNKNOWN_ERROR'>>;
  private handleError<T = any, E = any>(
    error: HttpErrorResponse,
    options?: RequestOptions<E | 'UNKNOWN_ERROR'> & { reportProgress: true },
  ): Rx.Observable<HttpEvent<ResponseData<T, E | 'UNKNOWN_ERROR'>>>;
  private handleError<T = any, E = any>(
    error: HttpErrorResponse,
    options: RequestOptions<E | 'UNKNOWN_ERROR'> = {},
  ):
    | Rx.Observable<ResponseData<T, E | 'UNKNOWN_ERROR'>>
    | Rx.Observable<HttpEvent<ResponseData<T, E | 'UNKNOWN_ERROR'>>> {
    let baseObservable$ = Rx.of(true);
    const formattedBody = this.formatErrorBody<E | 'UNKNOWN_ERROR'>(error);
    if (
      !options.errorWhitelist ||
      !options.errorWhitelist.includes(formattedBody.errorCode)
    ) {
      // send error to errorHandler
      this.errorHandler.handleError(error);

      if (error.status === 401 && !this.isCheckingAuthState) {
        this.isCheckingAuthState = true;
        baseObservable$ = Rx.combineLatest(
          this.authProviders.map(auth => auth.isLoggedIn()),
        ).pipe(
          take(1),
          switchMap(loginStatuses =>
            // if we are logged in
            loginStatuses.includes(true)
              ? // check our token validity
                this.get('info/', {
                  service: FreelancerHttpService.AUTH,
                  withCredentials: true,
                  errorWhitelist: [ErrorCodeApi.UNAUTHORIZED],
                }).pipe(take(1))
              : Rx.of(undefined),
          ),
          switchMap(infoResult => {
            this.isCheckingAuthState = false;
            if (infoResult && infoResult.status === 'error') {
              // if the token is invalid, clear it and force a page reload
              // HACK: DON'T TRY THIS AT HOME
              // force page to reload without changing the route
              this.router.onSameUrlNavigation = 'reload';
              this.authProviders.forEach(auth => auth.deleteSession());
              return this.location
                .navigateByUrl(this.router.url)
                .pipe(tap(() => (this.router.onSameUrlNavigation = 'ignore')));
            }
            return Rx.of(true);
          }),
        );
      }
    }
    return options.reportProgress
      ? baseObservable$.pipe(
          map(
            () =>
              new HttpResponse<ErrorResponseData<E | 'UNKNOWN_ERROR'>>({
                body: this.formatErrorBody(error),
              }),
          ),
        )
      : baseObservable$.pipe(map(() => formattedBody));
  }

  /**
   * Helper function to convert an object to HttpParams, which is conformant
   * to the `application/x-www-form-urlencoded` MIME type.
   *
   * `undefined` values and empty arrays are not serialized.
   *  Non-empty array values have `[]` appended to their keys.
   *
   * @param paramsObject The object to convert. Limited to string, number,
   * boolean primitives as values, array containing those primitives, or
   * nested objects. This means NO nested arrays, e.g. [1, [2, 3]]
   */
  _serialize(paramsObject: RequestParamsObject | HttpParams = {}) {
    if (paramsObject instanceof HttpParams) {
      return paramsObject;
    }

    return Object.entries(paramsObject).reduce<HttpParams>(
      (httpParams, [key, value]) => {
        if (Array.isArray(value)) {
          return (value as RequestParamsObjectArrayValue)
            .filter(isDefined)
            .reduce((innerParams, arrayItem) => {
              // FIXME: This is not allowed according to the type definition
              // of RequestParamsObject, so this branch is unlikely to be taken
              if (Array.isArray(arrayItem)) {
                // Make sure that batching is handled here. Break all & into more
                // params additions.
                return String(arrayItem as RequestParamsObjectArrayValue)
                  .split('&')
                  .reduce(
                    (innerInnerParams, arrayBatchItem) =>
                      innerInnerParams.append(
                        `${key}[]`,
                        typeof arrayBatchItem !== 'string'
                          ? JSON.stringify(arrayBatchItem)
                          : arrayBatchItem,
                      ),
                    innerParams,
                  );
              }

              // Stringify the array item because we need a string and if it's an
              // inner object just stringify to JSON.
              return innerParams.append(
                `${key}[]`,
                typeof arrayItem !== 'string'
                  ? JSON.stringify(arrayItem)
                  : arrayItem,
              );
            }, httpParams);
        }

        // Our REST API backend expects arrays foo=[1,2] to be encoded as
        // foo[]=1&foo[]=2 (but only for form-encoded payloads, see T74444)
        if (value !== undefined) {
          // Don't stringify the value if it's a string, otherwise you'll end up
          // with quotation marks surrounding the string (`"foo"` instead of `foo`).
          return httpParams.append(
            key,
            typeof value !== 'string' ? JSON.stringify(value) : value,
          );
        }

        return httpParams;
      },
      new HttpParams({ encoder: new CustomEncoder() }),
    );
  }

  /**
   * Construct a GET request to the backend.
   * @param endpoint The endpoint
   * @param options Request options
   */
  get<T = any, E = any>(
    endpoint: string,
    options?: RequestOptions<E | 'UNKNOWN_ERROR'> & { reportProgress?: false },
  ): Rx.Observable<ResponseData<T, E | 'UNKNOWN_ERROR'>>;
  get<T = any, E = any>(
    endpoint: string,
    options?: RequestOptions<E | 'UNKNOWN_ERROR'> & { reportProgress: true },
  ): Rx.Observable<HttpEvent<ResponseData<T, E | 'UNKNOWN_ERROR'>>>;
  get<T = any, E = any>(
    endpoint: string,
    options: RequestOptions<E | 'UNKNOWN_ERROR'> = {},
  ) {
    const service = options.isGaf
      ? FreelancerHttpService.AJAX_API
      : options.service || FreelancerHttpService.API;
    const baseUrl = this.getBaseServiceUrl(service);

    // Add webapp=1 for tracking in the backend to API requests
    const requestParams = options.isGaf
      ? { ...options.params, ...this.requestParams }
      : { ...options.params, webapp: 1, ...this.requestParams };

    if (options.reportProgress) {
      return Rx.of(endpoint).pipe(
        withLatestFrom<string, HttpHeaders[]>(
          ...this.authProviders.map(p => p.getAuthorizationHeader()),
          this.getApplicationInfoHeaders(),
          this.abTestOverridesHeader
            ? this.abTestOverridesHeader.getOverridesHeader()
            : Rx.of(new HttpHeaders()),
        ),
        switchMap(([requestEndpoint, ...extraHeaders]) =>
          this.http.get<RawSuccessResponseData<T>>(
            `${baseUrl}/${requestEndpoint}`,
            {
              reportProgress: options.reportProgress,
              observe: 'events',
              params: this._serialize(requestParams),
              withCredentials: options.withCredentials,
              headers: this.mergeExtraHeadersWithRequestHeaders(
                extraHeaders,
                options.headers,
              ),
            },
          ),
        ),
        map(event => {
          if (event instanceof HttpResponse) {
            return event.clone({
              body: this.formatResponseBody<T, E>(event),
            });
          }

          return event;
        }),
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, { ...options, reportProgress: true }),
        ),
      );
    }

    return Rx.of(endpoint).pipe(
      withLatestFrom<string, HttpHeaders[]>(
        ...this.authProviders.map(p => p.getAuthorizationHeader()),
        this.getApplicationInfoHeaders(),
        this.abTestOverridesHeader
          ? this.abTestOverridesHeader.getOverridesHeader()
          : Rx.of(new HttpHeaders()),
      ),
      switchMap(([requestEndpoint, ...extraHeaders]) =>
        this.http.get<RawSuccessResponseData<T>>(
          `${baseUrl}/${requestEndpoint}`,
          {
            reportProgress: options.reportProgress,
            observe: 'response',
            params: this._serialize(requestParams),
            withCredentials: options.withCredentials,
            headers: this.mergeExtraHeadersWithRequestHeaders(
              extraHeaders,
              options.headers,
            ),
          },
        ),
      ),
      map(response => this.formatResponseBody<T, E>(response)),
      catchError((error: HttpErrorResponse) =>
        this.handleError(error, { ...options, reportProgress: false }),
      ),
    );
  }

  /**
   * Construct a POST request to the backend
   * @param endpoint The endpoint
   * @param body Request body
   * @param options Request options
   */
  post<T = any, E = any>(
    endpoint: string,
    body: any | null,
    options?: RequestOptions<E | 'UNKNOWN_ERROR'> & { reportProgress?: false },
  ): Rx.Observable<ResponseData<T, E | 'UNKNOWN_ERROR'>>;
  post<T = any, E = any>(
    endpoint: string,
    body: any | null,
    options?: RequestOptions<E | 'UNKNOWN_ERROR'> & { reportProgress: true },
  ): Rx.Observable<HttpEvent<ResponseData<T, E | 'UNKNOWN_ERROR'>>>;
  post<T = any, E = any>(
    endpoint: string,
    body: any | null,
    options: RequestOptions<E | 'UNKNOWN_ERROR'> = {},
  ):
    | Rx.Observable<ResponseData<T, E | 'UNKNOWN_ERROR'>>
    | Rx.Observable<HttpEvent<ResponseData<T, E | 'UNKNOWN_ERROR'>>> {
    const service = options.isGaf
      ? FreelancerHttpService.AJAX_API
      : options.service || FreelancerHttpService.API;
    const baseUrl = this.getBaseServiceUrl(service);

    const requestBody = options.serializeBody ? this._serialize(body) : body;

    if (options.reportProgress) {
      return Rx.of(endpoint).pipe(
        withLatestFrom<string, HttpHeaders[]>(
          ...this.authProviders.map(p => p.getAuthorizationHeader()),
          this.getApplicationInfoHeaders(),
          this.abTestOverridesHeader
            ? this.abTestOverridesHeader.getOverridesHeader()
            : Rx.of(new HttpHeaders()),
        ),
        switchMap(([requestEndpoint, ...extraHeaders]) =>
          this.http.post<RawSuccessResponseData<T>>(
            `${baseUrl}/${requestEndpoint}`,
            requestBody,
            {
              reportProgress: options.reportProgress,
              observe: 'events',
              withCredentials: options.withCredentials,
              headers: this.mergeExtraHeadersWithRequestHeaders(
                extraHeaders,
                options.headers,
              ),
              params: this.requestParams,
            },
          ),
        ),
        map(event => {
          if (event instanceof HttpResponse) {
            return event.clone({
              body: this.formatResponseBody<T, E>(event),
            });
          }

          return event;
        }),
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, { ...options, reportProgress: true }),
        ),
      );
    }

    return Rx.of(endpoint).pipe(
      withLatestFrom<string, HttpHeaders[]>(
        ...this.authProviders.map(p => p.getAuthorizationHeader()),
        this.getApplicationInfoHeaders(),
        this.abTestOverridesHeader
          ? this.abTestOverridesHeader.getOverridesHeader()
          : Rx.of(new HttpHeaders()),
      ),
      switchMap(([requestEndpoint, ...extraHeaders]) =>
        this.http.post<RawSuccessResponseData<T>>(
          `${baseUrl}/${requestEndpoint}`,
          requestBody,
          {
            reportProgress: options.reportProgress,
            observe: 'response',
            withCredentials: options.withCredentials,
            headers: this.mergeExtraHeadersWithRequestHeaders(
              extraHeaders,
              options.headers,
            ),
            params: this.requestParams,
          },
        ),
      ),
      map(event => this.formatResponseBody<T, E>(event)),
      catchError((error: HttpErrorResponse) =>
        this.handleError(error, { ...options, reportProgress: false }),
      ),
    );
  }

  /**
   * Construct a PUT request to the backend
   * @param endpoint The endpoint
   * @param body Request body
   * @param options Request options
   */
  put<T = any, E = any>(
    endpoint: string,
    body: any | null,
    options?: RequestOptions<E | 'UNKNOWN_ERROR'> & { reportProgress?: false },
  ): Rx.Observable<ResponseData<T, E | 'UNKNOWN_ERROR'>>;
  put<T = any, E = any>(
    endpoint: string,
    body: any | null,
    options?: RequestOptions<E | 'UNKNOWN_ERROR'> & { reportProgress: true },
  ): Rx.Observable<HttpEvent<ResponseData<T, E | 'UNKNOWN_ERROR'>>>;
  put<T = any, E = any>(
    endpoint: string,
    body: any | null,
    options: RequestOptions<E | 'UNKNOWN_ERROR'> = {},
  ):
    | Rx.Observable<ResponseData<T, E | 'UNKNOWN_ERROR'>>
    | Rx.Observable<HttpEvent<ResponseData<T, E | 'UNKNOWN_ERROR'>>> {
    const service = options.isGaf
      ? FreelancerHttpService.AJAX_API
      : options.service || FreelancerHttpService.API;
    const baseUrl = this.getBaseServiceUrl(service);

    const requestBody = options.serializeBody ? this._serialize(body) : body;

    if (options.reportProgress) {
      return Rx.of(endpoint).pipe(
        withLatestFrom<string, HttpHeaders[]>(
          ...this.authProviders.map(p => p.getAuthorizationHeader()),
          this.getApplicationInfoHeaders(),
          this.abTestOverridesHeader
            ? this.abTestOverridesHeader.getOverridesHeader()
            : Rx.of(new HttpHeaders()),
        ),
        switchMap(([requestEndpoint, ...extraHeaders]) =>
          this.http.put<RawSuccessResponseData<T>>(
            `${baseUrl}/${requestEndpoint}`,
            requestBody,
            // FIXME: <any> is needed because of
            // https://github.com/angular/angular/issues/23600
            {
              reportProgress: options.reportProgress,
              observe: 'events',
              withCredentials: options.withCredentials,
              headers: this.mergeExtraHeadersWithRequestHeaders(
                extraHeaders,
                options.headers,
              ),
              params: this.requestParams,
            } as any,
          ),
        ),
        map(event => {
          if (event instanceof HttpResponse) {
            return event.clone({
              body: this.formatResponseBody<T, E>(event),
            });
          }

          return event;
        }),
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, { ...options, reportProgress: true }),
        ),
      );
    }

    return Rx.of(endpoint).pipe(
      withLatestFrom<string, HttpHeaders[]>(
        ...this.authProviders.map(p => p.getAuthorizationHeader()),
        this.getApplicationInfoHeaders(),
        this.abTestOverridesHeader
          ? this.abTestOverridesHeader.getOverridesHeader()
          : Rx.of(new HttpHeaders()),
      ),
      switchMap(([requestEndpoint, ...extraHeaders]) =>
        this.http.put<RawSuccessResponseData<T>>(
          `${baseUrl}/${requestEndpoint}`,
          requestBody,
          {
            reportProgress: options.reportProgress,
            observe: 'response',
            withCredentials: options.withCredentials,
            headers: this.mergeExtraHeadersWithRequestHeaders(
              extraHeaders,
              options.headers,
            ),
            params: this.requestParams,
          },
        ),
      ),
      map(event => this.formatResponseBody<T, E>(event)),
      catchError((error: HttpErrorResponse) =>
        this.handleError(error, { ...options, reportProgress: false }),
      ),
    );
  }

  /**
   * Construct a DELETE request to the backend
   * @param endpoint The endpoint
   * @param options Request options
   */
  delete<T = any, E = any>(
    endpoint: string,
    options?: RequestOptions<E | 'UNKNOWN_ERROR'> & { reportProgress?: false },
  ): Rx.Observable<ResponseData<T, E | 'UNKNOWN_ERROR'>>;
  delete<T = any, E = any>(
    endpoint: string,
    options?: RequestOptions<E | 'UNKNOWN_ERROR'> & { reportProgress: true },
  ): Rx.Observable<HttpEvent<ResponseData<T, E | 'UNKNOWN_ERROR'>>>;
  delete<T = any, E = any>(
    endpoint: string,
    options: RequestOptions<E | 'UNKNOWN_ERROR'> = {},
  ):
    | Rx.Observable<ResponseData<T, E | 'UNKNOWN_ERROR'>>
    | Rx.Observable<HttpEvent<ResponseData<T, E | 'UNKNOWN_ERROR'>>> {
    const service = options.isGaf
      ? FreelancerHttpService.AJAX_API
      : options.service || FreelancerHttpService.API;
    const baseUrl = this.getBaseServiceUrl(service);

    // Add webapp=1 for tracking in the backend to API requests
    const requestParams = options.isGaf
      ? { ...options.params, ...this.requestParams }
      : { ...options.params, webapp: 1, ...this.requestParams };

    if (options.reportProgress) {
      return Rx.of(endpoint).pipe(
        withLatestFrom<string, HttpHeaders[]>(
          ...this.authProviders.map(p => p.getAuthorizationHeader()),
          this.getApplicationInfoHeaders(),
          this.abTestOverridesHeader
            ? this.abTestOverridesHeader.getOverridesHeader()
            : Rx.of(new HttpHeaders()),
        ),
        switchMap(([requestEndpoint, ...extraHeaders]) =>
          this.http.delete<RawSuccessResponseData<T>>(
            `${baseUrl}/${requestEndpoint}`,
            {
              reportProgress: options.reportProgress,
              observe: 'events',
              withCredentials: options.withCredentials,
              headers: this.mergeExtraHeadersWithRequestHeaders(
                extraHeaders,
                options.headers,
              ),
              params: this._serialize(requestParams),
            },
          ),
        ),
        map(event => {
          if (event instanceof HttpResponse) {
            return event.clone({
              body: this.formatResponseBody<T, E>(event),
            });
          }

          return event;
        }),
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, { ...options, reportProgress: true }),
        ),
      );
    }

    return Rx.of(endpoint).pipe(
      withLatestFrom<string, HttpHeaders[]>(
        ...this.authProviders.map(p => p.getAuthorizationHeader()),
        this.getApplicationInfoHeaders(),
        this.abTestOverridesHeader
          ? this.abTestOverridesHeader.getOverridesHeader()
          : Rx.of(new HttpHeaders()),
      ),
      switchMap(([requestEndpoint, ...extraHeaders]) =>
        this.http.delete<RawSuccessResponseData<T>>(
          `${baseUrl}/${requestEndpoint}`,
          {
            reportProgress: options.reportProgress,
            observe: 'response',
            withCredentials: options.withCredentials,
            headers: this.mergeExtraHeadersWithRequestHeaders(
              extraHeaders,
              options.headers,
            ),
            params: this._serialize(requestParams),
          },
        ),
      ),
      map(event => this.formatResponseBody<T, E>(event)),
      catchError((error: HttpErrorResponse) =>
        this.handleError(error, { ...options, reportProgress: false }),
      ),
    );
  }

  private getApplicationInfoHeaders(): Rx.Observable<HttpHeaders> {
    let headers = new HttpHeaders();
    if (isPlatformServer(this.platformId)) {
      return Rx.of(headers);
    }
    // set the build timestamp header
    if (window?.webapp?.version?.buildTimestamp) {
      headers = headers.set(
        FREELANCER_APP_BUILD_TIMESTAMP_HEADER,
        `${window.webapp.version.buildTimestamp}`,
      );
    }
    // set the locale header
    if (this.localization.locale) {
      headers = headers.set(
        FREELANCER_APP_LOCALE_HEADER,
        this.localization.locale,
      );
    }
    // set the app name header
    if (this.appName) {
      headers = headers.set(FREELANCER_APP_NAME_HEADER, this.appName);
    }
    return Rx.of(headers);
  }
}
