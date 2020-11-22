/*********************************************************************************
 * This is `select` from ngrx/store pulled out into a pipeable operator with the *
 * the type definitions fixed as per https://github.com/ngrx/platform/issues/528 *
 ********************************************************************************/

import * as Rx from 'rxjs';
import { distinctUntilChanged, map, pluck } from 'rxjs/operators';

export function select<T, K>(
  mapFn: (state: T) => K,
): (source$: Rx.Observable<T>) => Rx.Observable<K | undefined>;
export function select<T, a extends keyof T>(
  key: a,
): (source$: Rx.Observable<T>) => Rx.Observable<T[a] | undefined>;
export function select<T, a extends keyof T, b extends keyof NonNullable<T[a]>>(
  key1: a,
  key2: b,
): (
  source$: Rx.Observable<T>,
) => Rx.Observable<NonNullable<T[a]>[b] | undefined>;
export function select<
  T,
  a extends keyof T,
  b extends keyof NonNullable<T[a]>,
  c extends keyof NonNullable<NonNullable<T[a]>[b]>
>(
  key1: a,
  key2: b,
  key3: c,
): (
  source$: Rx.Observable<T>,
) => Rx.Observable<NonNullable<NonNullable<T[a]>[b]>[c] | undefined>;
export function select<
  T,
  a extends keyof T,
  b extends keyof NonNullable<T[a]>,
  c extends keyof NonNullable<NonNullable<T[a]>[b]>,
  d extends keyof NonNullable<NonNullable<T[a]>[b]>[c]
>(
  key1: a,
  key2: b,
  key3: c,
  key4: d,
): (
  source$: Rx.Observable<T>,
) => Rx.Observable<NonNullable<NonNullable<T[a]>[b]>[c][d] | undefined>;
export function select<
  T,
  a extends keyof T,
  b extends keyof NonNullable<T[a]>,
  c extends keyof NonNullable<NonNullable<T[a]>[b]>,
  d extends keyof NonNullable<NonNullable<NonNullable<T[a]>[b]>[c]>,
  e extends keyof NonNullable<NonNullable<NonNullable<NonNullable<T[a]>[b]>[c]>[d]> // prettier-ignore
>(
  key1: a,
  key2: b,
  key3: c,
  key4: d,
  key5: e,
): (
  source$: Rx.Observable<T>,
) => Rx.Observable<NonNullable<NonNullable<NonNullable<NonNullable<T[a]>[b]>[c]>[d]>[e] | undefined>; // prettier-ignore
export function select<T>(
  pathOrMapFn: ((state: T) => any) | string,
  ...paths: string[]
): (source$: Rx.Observable<T>) => Rx.Observable<any> {
  if (typeof pathOrMapFn === 'string') {
    return Rx.pipe(
      pluck<T, any>(pathOrMapFn, ...paths),
      distinctUntilChanged(),
    );
  }
  if (typeof pathOrMapFn === 'function') {
    return Rx.pipe(map(pathOrMapFn), distinctUntilChanged());
  }

  throw new TypeError(
    `Unexpected type '${typeof pathOrMapFn}' in select operator,` +
      ` expected 'string' or 'function'`,
  );
}
