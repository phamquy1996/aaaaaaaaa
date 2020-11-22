import * as Rx from 'rxjs';

/**
 * Returns an Rx.Observable that emits all items emitted by the source$ Rx.Observable
 * that are distinct by comparison from previous items in a sliding time window.
 *
 * If a comparator function is provided, then it will be called for each item
 * to test for whether or not that value should be emitted.
 *
 * If a comparator function is not provided, an equality check is used by default.
 */
export function distinctInWindow<T>(
  windowTimeSpan: number,
  compare: (x: T, y: T) => boolean = (x: T, y: T) => x === y,
  scheduler?: Rx.SchedulerLike,
): (source$: Rx.Observable<T>) => Rx.Observable<T> {
  // default to Rx.asyncScheduler since operator deals explicitly with time
  const internalScheduler = scheduler || Rx.asyncScheduler;

  return (source$: Rx.Observable<T>) =>
    new Rx.Observable<T>(observer => {
      const buffer: T[] = [];
      return source$.subscribe({
        next(x) {
          if (!buffer.some(v => compare(x, v))) {
            buffer.push(x);
            internalScheduler.schedule(() => {
              if (buffer.length > 0) {
                buffer.shift();
              }
            }, windowTimeSpan);

            observer.next(x);
          }
        },
        error(err) {
          observer.error(err);
        },
        complete() {
          observer.complete();
        },
      });
    });
}
