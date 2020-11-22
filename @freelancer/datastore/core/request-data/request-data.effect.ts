import { Inject, Injectable, NgZone } from '@angular/core';
import { leaveZone } from '@freelancer/time-utils';
import { isDefined } from '@freelancer/utils';
import { Actions, Effect } from '@ngrx/effects';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import * as Rx from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  mergeAll,
  mergeMap,
  publishReplay,
  refCount,
  startWith,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  CollectionActions,
  isRequestDataAction,
  RequestDataPayload,
  TypedAction,
} from '../actions';
import { ApiFetchResponse } from '../api-http.service';
import { StoreBackend } from '../backend';
import { ResponseData, SuccessResponseData } from '../datastore.interface';
import { chunk, flatMap, isObject } from '../helpers';
import { slidingBufferTime } from '../operators/slidingBufferTime';
import {
  RequestErrorWithoutRetry,
  RequestStatusHandler,
} from '../request-status-handler.service';
import {
  isDocumentRef,
  isPlainDocumentRef,
  referencesEqual,
  resourceGroupsEqual,
} from '../store.helpers';
import {
  DatastoreCollectionType,
  DatastoreFetchCollectionType,
} from '../store.model';
import { batchRequests } from './operators/batchRequests';
import { dedupeRequests } from './operators/dedupeRequests';
import { retryRequests } from './operators/retryRequests';
import { REQUEST_DATA_CONFIG } from './request-data.config';
import { RequestDataConfig } from './request-data.interface';

interface RequestAndResponse<C extends DatastoreCollectionType, E> {
  readonly request: RequestDataPayload<C>;
  readonly res: ResponseData<any, E>;
}

@Injectable()
export class RequestDataEffect {
  @Effect() readonly requestData$: Rx.Observable<TypedAction>;

  private readonly ORIGINAL_REQUESTS_WINDOW = 10000;

  constructor(
    private storeBackend: StoreBackend,
    private actions$: Actions<TypedAction>,
    private ngZone: NgZone,
    private requestStatusHandler: RequestStatusHandler,
    @Inject(REQUEST_DATA_CONFIG) private config: RequestDataConfig,
  ) {
    const {
      scheduler,
      dedupeWindowTime,
      batchWindowTime,
      retryConfig,
    } = this.config;
    const { initialInterval, maxRetries, intervalFn } = retryConfig;

    // this is a bit of a hack, but not leaving the NgZone when the
    // dedupeWindowTime is null enables the unit tests to work
    const dedupeScheduler = dedupeWindowTime
      ? leaveZone(this.ngZone, scheduler)
      : scheduler;

    let originalRequestsMap: {
      readonly [requestId: string]: RequestDataPayload<any>;
    } = {};

    // Optimisation: dedupe requests with limit smaller than the largest in window
    const allRequests$ = this.actions$.pipe(
      filter(isRequestDataAction),
      map(action => action.payload),
    );
    const requestErrors$ = this.requestStatusHandler.statusStream$.pipe(
      filter(({ statusObject }) => statusObject.error !== undefined),
    );

    const propagateDedupedRequestStatuses$ = requestErrors$.pipe(
      withLatestFrom(
        Rx.combineLatest([
          // sliding buffer of failed requests clientRequestIds
          requestErrors$.pipe(
            map(({ request }) => request),
            slidingBufferTime(dedupeWindowTime, dedupeScheduler),
            map(requestIdErrorBuffer =>
              flatMap(
                requestIdErrorBuffer,
                ({ clientRequestIds }) => clientRequestIds,
              ),
            ),
          ),
          // sliding buffer of all requests
          allRequests$.pipe(
            slidingBufferTime(
              dedupeWindowTime,
              dedupeWindowTime ? leaveZone(this.ngZone, scheduler) : undefined,
            ),
          ),
        ]),
      ),
      tap(
        ([
          { request, statusObject },
          [requestIdErrorBuffer, requestBuffer],
        ]) => {
          // updates statuses of deduped requests so that the first request's
          // status is propagated to subsequent deduped ones
          requestBuffer
            .filter(
              r =>
                // has a previous request (r) been made to the same ref
                referencesEqual(r.ref, request.ref) &&
                // has a previous request (r) been made with the same resource
                // group
                resourceGroupsEqual(r.resourceGroup, request.resourceGroup) &&
                // has none of the current request (request) clientRequestIds
                // resulted in a previous error
                r.clientRequestIds.find(id =>
                  requestIdErrorBuffer.includes(id),
                ) === undefined,
            )
            .forEach(r => this.requestStatusHandler.update(r, statusObject));
        },
      ),
      mapTo(undefined),
      startWith<undefined>(undefined),
    );

    const allDedupedRequests$ = Rx.combineLatest([
      allRequests$.pipe(
        dedupeRequests(
          dedupeWindowTime,
          requestErrors$.pipe(map(e => e.request)),
          dedupeScheduler,
        ),
      ),
      propagateDedupedRequestStatuses$,
    ]).pipe(
      map(([request]) => request),
      tap(request => {
        originalRequestsMap = {
          ...originalRequestsMap,
          [request.clientRequestIds[0]]: request,
        };

        // remove request after window elapses
        dedupeScheduler.schedule(() => {
          const {
            [request.clientRequestIds[0]]: _deleted,
            ...cleanedOriginalRequestsMap
          } = originalRequestsMap;
          originalRequestsMap = cleanedOriginalRequestsMap;
        }, this.ORIGINAL_REQUESTS_WINDOW);
      }),
      distinctUntilChanged(),
      publishReplay(1),
      refCount(),
    );

    const plainRequests$ = allDedupedRequests$.pipe(
      filter(request => isPlainDocumentRef(request.ref)),
    );
    const queriedRequests$ = allDedupedRequests$.pipe(
      filter(request => !isPlainDocumentRef(request.ref)),
    );

    // Batching only for plain requests (no query)
    // TODO: Address queried requests, i.e. regular datastore.list() calls
    const batchedRequests$ = plainRequests$.pipe(
      batchRequests(batchWindowTime, scheduler),
      map(requests =>
        flatMap(requests, request =>
          splitRequestsOnId(request, this.storeBackend.batchSize(request.ref)),
        ),
      ),
      mergeAll(),
    );

    const response$: Rx.Observable<ReadonlyArray<
      RequestAndResponse<DatastoreCollectionType, any>
    >> = Rx.merge(batchedRequests$, queriedRequests$).pipe(
      mergeMap(request =>
        this.storeBackend.fetch(request.ref, request.resourceGroup).pipe(
          map(response => {
            if (request.clientRequestIds.length > 1) {
              const unbatchedRequests = request.clientRequestIds
                .map(id => originalRequestsMap[id])
                .filter(isDefined);

              return { res: response, unbatchedRequests };
            }

            return { res: response, unbatchedRequests: [request] };
          }),
          map(({ res, unbatchedRequests }) =>
            this.checkEmptyResponse(res, request, unbatchedRequests),
          ),
          switchMap(({ res, otherRequests, requestsWithMissingItems }) => {
            if (requestsWithMissingItems.length > 0) {
              return Rx.throwError({
                res,
                otherRequests,
                requestsWithMissingItems,
              });
            }

            // No missing items - dispatch a success action with the original,
            // possibly batched request
            return Rx.of([{ request, res }]);
          }),
          // On missing items, retry twice with exponential backoff
          retryRequests({
            initialInterval,
            maxRetries,
            intervalFn,
            scheduler,
          }),
          // After all retries fail, produce an error status for the unbatched
          // requests that were missing items
          catchError(err => {
            const { res, otherRequests, requestsWithMissingItems } = err;

            // Only handle the error thrown by missing item logic above
            if (res && otherRequests && requestsWithMissingItems) {
              // TODO: replace with ErrorHandler
              console.warn(
                `Object(s) not found in response from document call to '${request.type}'. Response was`,
                res,
              );

              return Rx.of([
                ...((otherRequests || []) as RequestDataPayload<any>[]).map(
                  req => ({
                    request: req,
                    res,
                  }),
                ),
                ...((requestsWithMissingItems || []) as RequestDataPayload<
                  any
                >[]).map(req => ({
                  request: req,
                  res: {
                    status: 'error' as const,
                    errorCode: ErrorCodeApi.NOT_FOUND,
                  },
                })),
              ]);
            }

            // Rethrow other errors - mainly here to so that the missing module
            // error is correctly thrown from `storeBackend.fetch`.
            throw err;
          }),
        ),
      ),
    );

    this.requestData$ = response$.pipe(
      tap(requests => {
        requests.forEach(({ request, res }) =>
          this.updateRequestStatuses(res, request),
        );
      }),
      map(requests =>
        requests.map(({ request, res }) =>
          this.dispatchResponseAction(res, request),
        ),
      ),
      mergeAll(),
    );
  }

  /**
   * Inspects the network response to verify all items expected by the request
   * actually exist.
   *
   * FIXME: This is not a comprehensive check for missing items, as it relies on
   * several assumptions about the structure of the result object. These
   * assumptions often don't hold for our inconsistent API. This problem can also
   * be avoided entirely by not batching requests.
   * TODO: Find a generic way to check if a response is missing items.
   */
  private checkEmptyResponse<
    C extends DatastoreCollectionType & DatastoreFetchCollectionType
  >(
    response: ApiFetchResponse<C>,
    originalRequest: RequestDataPayload<C>,
    unbatchedRequests: ReadonlyArray<RequestDataPayload<C>>,
  ) {
    if (isDocumentRef(originalRequest.ref) && response.status === 'success') {
      const {
        requestsWithMissingItems,
        otherRequests,
      } = this.getRequestsWithMissingItems(response, unbatchedRequests);

      return {
        res: response,
        requestsWithMissingItems,
        otherRequests,
      };
    }

    return {
      res: response,
      requestsWithMissingItems: [] as ReadonlyArray<RequestDataPayload<C>>,
      otherRequests: unbatchedRequests,
    };
  }

  /**
   * Partitions requests into ones that are missing items, and ones that are not.
   */
  private getRequestsWithMissingItems<
    C extends DatastoreCollectionType & DatastoreFetchCollectionType
  >(
    response: SuccessResponseData<C['Backend']['Fetch']['ReturnType']>,
    unbatchedRequests: ReadonlyArray<RequestDataPayload<C>>,
  ): {
    readonly requestsWithMissingItems: ReadonlyArray<RequestDataPayload<C>>;
    readonly otherRequests: ReadonlyArray<RequestDataPayload<C>>;
  } {
    const result = response.result as any; // FIXME
    const keys = isObject(result) ? Object.keys(result) : [];

    // Check if result is a single key with an empty Array or Object value
    if (keys.length === 1) {
      const resultItems = result[keys[0]];

      if (
        resultItems &&
        ((Array.isArray(resultItems) && resultItems.length === 0) ||
          (isObject(resultItems) && Object.keys(resultItems).length === 0))
      ) {
        return {
          requestsWithMissingItems: unbatchedRequests,
          otherRequests: [],
        };
      }
    }

    // Assume all other result structures are fine
    return { requestsWithMissingItems: [], otherRequests: unbatchedRequests };
  }

  private updateRequestStatuses(
    response: ApiFetchResponse<any>,
    request: RequestDataPayload<any>,
  ) {
    if (response.status === 'error') {
      this.requestStatusHandler.update(request, {
        ready: false,
        error: response as RequestErrorWithoutRetry<any>,
      });
    }
  }

  private dispatchResponseAction(
    response: ApiFetchResponse<any>,
    request: RequestDataPayload<any>,
  ): CollectionActions<any> {
    const order =
      request.ref.order ||
      this.storeBackend.defaultOrder(request.ref.path.collection);

    switch (response.status) {
      case 'success': {
        const action: TypedAction = {
          type: 'API_FETCH_SUCCESS',
          payload: {
            type: request.ref.path.collection,
            result: response.result,
            ref: request.ref,
            order,
            clientRequestIds: request.clientRequestIds,
          },
        };
        return action;
      }
      default: {
        const action: TypedAction = {
          type: 'API_FETCH_ERROR',
          payload: {
            type: request.ref.path.collection,
            ref: request.ref,
            order,
            clientRequestIds: request.clientRequestIds,
          },
        };
        return action;
      }
    }
  }
}

function splitRequestsOnId<C extends DatastoreCollectionType>(
  request: RequestDataPayload<C>,
  size: number,
): ReadonlyArray<RequestDataPayload<C>> {
  const { ids } = request.ref.path;
  if (!ids) {
    return [request];
  }

  return chunk(ids, size).map(chunkedIds => ({
    ...request,
    ref: {
      ...request.ref,
      path: {
        ...request.ref.path,
        ids: chunkedIds,
      },
    },
  }));
}
