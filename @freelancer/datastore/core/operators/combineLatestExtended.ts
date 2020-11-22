/**
 * An extension of combineLatest which takes in more arguments
 */
import * as Rx from 'rxjs';

/**
 * Like combineLatest, but takes in more than 6 inputs.
 * Just adds type information.
 */
export function combineLatestExtended<T, T2, T3, T4, T5, T6, T7>(
  observables: [
    Rx.ObservableInput<T>,
    Rx.ObservableInput<T2>,
    Rx.ObservableInput<T3>,
    Rx.ObservableInput<T4>,
    Rx.ObservableInput<T5>,
    Rx.ObservableInput<T6>,
    Rx.ObservableInput<T7>,
  ],
): Rx.Observable<[T, T2, T3, T4, T5, T6, T7]>;

export function combineLatestExtended<T, T2, T3, T4, T5, T6, T7, T8>(
  observables: [
    Rx.ObservableInput<T>,
    Rx.ObservableInput<T2>,
    Rx.ObservableInput<T3>,
    Rx.ObservableInput<T4>,
    Rx.ObservableInput<T5>,
    Rx.ObservableInput<T6>,
    Rx.ObservableInput<T7>,
    Rx.ObservableInput<T8>,
  ],
): Rx.Observable<[T, T2, T3, T4, T5, T6, T7, T8]>;

export function combineLatestExtended<T, T2, T3, T4, T5, T6, T7, T8, T9>(
  observables: [
    Rx.ObservableInput<T>,
    Rx.ObservableInput<T2>,
    Rx.ObservableInput<T3>,
    Rx.ObservableInput<T4>,
    Rx.ObservableInput<T5>,
    Rx.ObservableInput<T6>,
    Rx.ObservableInput<T7>,
    Rx.ObservableInput<T8>,
    Rx.ObservableInput<T9>,
  ],
): Rx.Observable<[T, T2, T3, T4, T5, T6, T7, T8, T9]>;

export function combineLatestExtended<T, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
  observables: [
    Rx.ObservableInput<T>,
    Rx.ObservableInput<T2>,
    Rx.ObservableInput<T3>,
    Rx.ObservableInput<T4>,
    Rx.ObservableInput<T5>,
    Rx.ObservableInput<T6>,
    Rx.ObservableInput<T7>,
    Rx.ObservableInput<T8>,
    Rx.ObservableInput<T9>,
    Rx.ObservableInput<T10>,
  ],
): Rx.Observable<[T, T2, T3, T4, T5, T6, T7, T8, T9, T10]>;

export function combineLatestExtended<
  T,
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  T9,
  T10,
  T11
>(
  observables: [
    Rx.ObservableInput<T>,
    Rx.ObservableInput<T2>,
    Rx.ObservableInput<T3>,
    Rx.ObservableInput<T4>,
    Rx.ObservableInput<T5>,
    Rx.ObservableInput<T6>,
    Rx.ObservableInput<T7>,
    Rx.ObservableInput<T8>,
    Rx.ObservableInput<T9>,
    Rx.ObservableInput<T10>,
    Rx.ObservableInput<T11>,
  ],
): Rx.Observable<[T, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11]>;

export function combineLatestExtended<
  T,
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  T9,
  T10,
  T11,
  T12
>(
  observables: [
    Rx.ObservableInput<T>,
    Rx.ObservableInput<T2>,
    Rx.ObservableInput<T3>,
    Rx.ObservableInput<T4>,
    Rx.ObservableInput<T5>,
    Rx.ObservableInput<T6>,
    Rx.ObservableInput<T7>,
    Rx.ObservableInput<T8>,
    Rx.ObservableInput<T9>,
    Rx.ObservableInput<T10>,
    Rx.ObservableInput<T11>,
    Rx.ObservableInput<T12>,
  ],
): Rx.Observable<[T, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12]>;

export function combineLatestExtended(
  // tslint:disable-next-line:readonly-array
  observables: Rx.ObservableInput<any>[],
): Rx.Observable<any> {
  return Rx.combineLatest(observables) as Rx.Observable<any>;
}
