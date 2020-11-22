/**
 * Check all the observable arguments are true.
 */

import * as Rx from 'rxjs';
import { defaultIfEmpty, distinctUntilChanged, map } from 'rxjs/operators';

export function allTrue(
  ...observables: Rx.Observable<boolean>[]
): Rx.Observable<boolean> {
  return Rx.combineLatest(
    observables.map(observable$ =>
      observable$.pipe(defaultIfEmpty<boolean>(false)),
    ),
  ).pipe(
    map(args => args.every(x => x)),
    distinctUntilChanged(),
  );
}
