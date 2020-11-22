import { jsonStableStringify } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { RequestDataPayload } from '../../actions';

/**
 * Batches requests that occur within `windowTime` milliseconds of each other,
 * such that at the end of the interval, requests to the same slice of the
 * datastore are grouped together into one request. Requests will not be batched
 * if they differ in either collection or authUid.
 *
 * Example: With a window size of 3 seconds, a request for user with id 1 (U1),
 * then for ids 2 and 3 (U2:3) one second later, then for project 5 (P5)
 *
 * 0     1     2     3     4     5s
 * U1----U2:3----P5--------------|
 *        batchRequests(3000)
 * ------------------B-----------|
 *
 * Where B is the list [ U1:2:3, P5 ], with the first request for users 1, 2, 3
 * and the second for project 5
 */
export function batchRequests(
  windowTime: number,
  scheduler: Rx.SchedulerLike = Rx.asyncScheduler,
): (
  source$: Rx.Observable<RequestDataPayload<any>>,
) => Rx.Observable<ReadonlyArray<RequestDataPayload<any>>> {
  if (windowTime === 0) {
    return (source$: Rx.Observable<RequestDataPayload<any>>) =>
      source$.pipe(map(request => [request]));
  }

  const requestsBuffer: RequestDataPayload<any>[] = [];
  return (requestStream$: Rx.Observable<RequestDataPayload<any>>) =>
    requestStream$.pipe(
      mergeMap(request => {
        if (requestsBuffer.length === 0) {
          requestsBuffer.push(request);
          // We do want to run the timer inside the Angular Zone here as
          // otherwise the zone will stabilized before that the batched
          // requests have been run, i.e. data will be missing on the page in
          // e2e tests, web worker, or server-side rendering scenarios.
          // tslint:disable-next-line:validate-timers
          return Rx.timer(windowTime, scheduler).pipe(
            map(() => requestsBuffer.splice(0, requestsBuffer.length)),
          );
        }
        requestsBuffer.push(request);
        return Rx.EMPTY;
      }),
      map(requests => {
        const requestsToBatch = requests.reduce((toBatch, req) => {
          // Group requests by their given resource group if given
          const resourceGroupKey = req.resourceGroup
            ? `-${jsonStableStringify(req.resourceGroup, true)}`
            : '';
          const key = `${req.type}-${req.ref.path.authUid}${resourceGroupKey}`;
          const ids = req.ref.path.ids || [];
          let existingIds: ReadonlyArray<string> = [];

          // TODO: Add batch limits to prevent overloading backend
          if (toBatch[key]) {
            const existingClientRequestIds: ReadonlyArray<string> =
              toBatch[key].clientRequestIds;
            existingIds = toBatch[key].ref.path.ids || [];
            toBatch[key] = {
              ...toBatch[key],
              ref: {
                ...toBatch[key].ref,
                path: {
                  ...toBatch[key].ref.path,
                  ids: [...existingIds, ...ids],
                },
              },
              // A batched request id is the concatenation of the orginal request ids
              clientRequestIds: [
                ...existingClientRequestIds,
                ...req.clientRequestIds.filter(
                  id => !existingClientRequestIds.includes(id),
                ),
              ],
            };
            return toBatch;
          }

          return {
            ...toBatch,
            [key]: {
              type: req.ref.path.collection,
              ref: {
                path: {
                  collection: req.ref.path.collection,
                  authUid: req.ref.path.authUid,
                  ids,
                },
              },
              clientRequestIds: req.clientRequestIds,
              resourceGroup: req.resourceGroup,
            },
          };
        }, {} as { [key: string]: RequestDataPayload<any> });

        return Object.values(requestsToBatch);
      }),
    );
}
