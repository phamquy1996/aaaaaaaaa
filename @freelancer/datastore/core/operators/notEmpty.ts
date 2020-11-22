/**
 * Filters an observable of a list to return only non-empty lists.
 */

import * as Rx from 'rxjs';
import { filter } from 'rxjs/operators';

export function notEmpty<T>(): (
  source$: Rx.Observable<ReadonlyArray<T>>,
) => Rx.Observable<ReadonlyArray<T>> {
  return filter(xs => xs.length > 0);
}
