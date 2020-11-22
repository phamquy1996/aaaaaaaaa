/**
 * Adds a startWith with an empty array of the right type.
 */

import * as Rx from 'rxjs';
import { startWith } from 'rxjs/operators';

export function startWithEmptyList<T>(): (
  source$: Rx.Observable<ReadonlyArray<T>>,
) => Rx.Observable<ReadonlyArray<T>> {
  return startWith([] as ReadonlyArray<T>);
}
