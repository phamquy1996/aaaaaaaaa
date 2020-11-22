import * as Rx from 'rxjs';
import { concatMap, retryWhen } from 'rxjs/operators';

export interface RetryRequestsConfig {
  // Time to first retry
  readonly initialInterval: number;
  // Maximum number of retry attempts
  readonly maxRetries?: number;
  readonly scheduler?: Rx.SchedulerLike;
  // Determines how often retries occur - by default this is a constant function
  // equal to the initialInterval
  intervalFn?(iteration: number, initialInterval: number): number;
}

/**
 * Returns an Observable that mirrors the source Observable with the exception
 * of an error. If the source Observable calls error, rather than propagating
 * the error call this method will resubscribe to the source Observable with
 * a given interval and up to a maximum of count resubscriptions (if provided).
 *
 * Mostly replicates https://github.com/alex-okrushko/backoff-rxjs
 */
export function retryRequests(
  config: RetryRequestsConfig,
): <T>(source$: Rx.Observable<T>) => Rx.Observable<T> {
  const {
    initialInterval,
    maxRetries = Infinity,
    scheduler = Rx.asyncScheduler,
    intervalFn = (i: number, initInterval: number) => initInterval,
  } = config;
  return <T>(source$: Rx.Observable<T>) =>
    source$.pipe(
      retryWhen<T>(errors$ =>
        errors$.pipe(
          concatMap((error, i) =>
            Rx.iif(
              () => i < maxRetries,
              // tslint:disable-next-line:validate-timers
              Rx.timer(intervalFn(i, initialInterval), scheduler),
              Rx.throwError(error),
            ),
          ),
        ),
      ),
    );
}
