import * as Rx from 'rxjs';

/**
 * Maintains a sliding window of values emitted in the last bufferTimeSpan ms,
 * and emits them as an array everytime the source emits. Similar to the
 * bufferTime operator, but does not wait until the end of the interval to emit.
 *
 * Note: Unlike bufferTime, this operator does NOT guarantee an emission every
 * bufferTimeSpan ms. If the source does not emit within this interval, nothing
 * will be emitted. In contrast, bufferTime will emit an empty array.
 *
 * FIXME: This operator doesn't seem to be testable with `rx-sandbox` - always
 * emits the same buffer at the time the scheduler is flushed to rather than
 * emitting as the source emits.
 *
 * @param bufferTimeSpan Width of sliding window in milliseconds
 * @param scheduler Custom scheduler
 */
export function slidingBufferTime<T>(
  bufferTimeSpan: number,
  scheduler?: Rx.SchedulerLike,
): Rx.OperatorFunction<T, ReadonlyArray<T>> {
  // default to Rx.asyncScheduler since operator deals explicitly with time
  const internalScheduler = scheduler || Rx.asyncScheduler;

  if (bufferTimeSpan < 0) {
    throw new Error('Timespan cannot be negative');
  }

  return (source$: Rx.Observable<T>) =>
    new Rx.Observable<T[]>(observer => {
      const buffer: T[] = [];
      return source$.subscribe({
        next(value: T) {
          buffer.push(value);
          internalScheduler.schedule(() => {
            if (buffer.length > 0) {
              buffer.shift();
            }
          }, bufferTimeSpan);

          observer.next(buffer);
        },
        error(err: any) {
          buffer.length = 0;
          observer.error(err);
        },
        complete() {
          observer.complete();
        },
      });
    });
}
