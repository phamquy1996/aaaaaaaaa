/**
 * Combines two observables pairing the elements from the first
 * observable with the corresponding elements from the second (if they exist)
 * indexed by id.
 */
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';
import { startWithEmptyList } from './startWithEmptyList';

export function combineWithLatestItem<
  T,
  S extends { id: T[P] },
  P extends keyof T
>(
  ys$: Rx.Observable<ReadonlyArray<S>>,
  property: P,
): (
  source$: Rx.Observable<ReadonlyArray<T>>,
) => Rx.Observable<ReadonlyArray<readonly [T, S | undefined]>> {
  return xs$ =>
    Rx.combineLatest([xs$, ys$.pipe(startWithEmptyList())]).pipe(
      map(([xs, ys]) => xs.map(x => [x, ys.find(y => y.id === x[property])])),
    );
}
