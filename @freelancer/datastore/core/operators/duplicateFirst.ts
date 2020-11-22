/*******************************************************************************
 * Duplicate the first thing emitted from an observable so it is emitted twice.
 * Takes two optional tranformations to apply to those two emitted values.
 ******************************************************************************/

import * as Rx from 'rxjs';

export function duplicateFirst<T>(
  firstTransform?: (from: T) => T,
  secondTransform?: (from: T) => T,
): (source$: Rx.Observable<T>) => Rx.Observable<T> {
  return (source$: Rx.Observable<T>) =>
    new Rx.Observable<T>(observer => {
      let first = true;
      return source$.subscribe({
        next(x) {
          if (first) {
            first = false;
            observer.next(firstTransform ? firstTransform(x) : x);
            observer.next(secondTransform ? secondTransform(x) : x);
          } else {
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
