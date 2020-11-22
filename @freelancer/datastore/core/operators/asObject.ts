/**
 * Convert a list into a map.
 */

import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';
import { keyBy } from '../helpers';

export function asObject<T extends { id: K }, K extends string | number>(): (
  list$: Rx.Observable<ReadonlyArray<T>>,
) => Rx.Observable<{ readonly [id: string]: T }> {
  return map(list => keyBy(list, item => item.id));
}
