import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { MapCoordinates } from '@freelancer/datastore';
import * as Rx from 'rxjs';

export function isDefined<T>(x: T): x is NonNullable<T> {
  return x !== undefined && x !== null;
}

export function assertNever(
  x: never,
  error: string = 'Unexpected object',
): never {
  throw new Error(`${error}: ${JSON.stringify(x)}`);
}

/**
 * Converts a value into a number, provided it is a number or string.
 * Otherwise, convert it to undefined.
 *
 * For general use, but especially for transformer functions where the backend
 * type for "empty/falsey" values should be universally turned into `undefined`
 * to be consumed by the application.
 */
export function toNumber(value: string | number): number;
export function toNumber(
  value: string | number | null | undefined | false,
): number | undefined;
export function toNumber(
  value: string | number | null | undefined | false,
): number | undefined {
  // check type OR truthiness to avoid 0 issues
  return typeof value === 'number' || value ? Number(value) : undefined;
}

/**
 * Returns an object composed from key-value `pairs`.
 *
 * Signature same as lodash, see also https://github.com/tc39/proposal-object-from-entries
 * @param {Array} pairs The key-value pairs.
 * @returns {Object} Returns the new object.
 * @example
 *
 * _.fromPairs([['a', 1], ['b', 2]]);
 * // => { 'a': 1, 'b': 2 }
 */
export function fromPairs<T, K extends PropertyKey = string>(
  values: ReadonlyArray<readonly [K, T]>,
): { readonly [key in K]: T } {
  return values.reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {} as { readonly [key in K]: T },
  );
}

/** A version of JSON.stringify that sorts object keys
 * (and optionally array entries) for a stable sort.
 * Useful for using as an object's hash.
 *
 * Based on https://github.com/substack/json-stable-stringify
 */
export function jsonStableStringify(
  node: any,
  sortArrays = false,
): string | undefined {
  if (node && node.toJSON && typeof node.toJSON === 'function') {
    // eslint-disable-next-line no-param-reassign
    node = node.toJSON();
  }

  if (node === undefined) {
    return;
  }

  if (typeof node !== 'object' || node === null) {
    return JSON.stringify(node);
  }

  if (Array.isArray(node)) {
    return `[${(sortArrays ? [...node].sort() : node)
      .map(
        value => jsonStableStringify(value, sortArrays) || JSON.stringify(null),
      )
      .join(',')}]`;
  }

  return `{${Object.keys(node)
    .sort()
    .map(key => {
      const value = jsonStableStringify(node[key], sortArrays);
      return value ? `${JSON.stringify(key)}:${value}` : undefined;
    })
    .filter(isDefined)
    .join(',')}}`;
}

export function objectFilter<V>(
  object: { readonly [key: string]: V },
  predicate: (key: string, v: V) => boolean,
): { readonly [key: string]: V } {
  return Object.entries(object)
    .filter(([key, value]) => predicate(key, value))
    .reduce((obj: { [key: string]: V }, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
}

export function toObservable<T>(x$: T | Rx.Observable<T>): Rx.Observable<T> {
  return Rx.isObservable(x$) ? x$ : Rx.of(x$);
}

/**
 * A wrapper around Array.isArray with better types.
 *
 * https://github.com/microsoft/TypeScript/issues/17002
 */

export function isArray(arg: any): arg is readonly any[] {
  return Array.isArray(arg);
}

/**
 * Splits an array into two groups, the first containing all elements which
 * were truthy when evaluated for the given projection function, and the second
 * containing all other elements.
 *
 * Example: Partitioning a list into odd and even numbers
 *
 * partition([1, 2, 3, 4], val => val % 2 !== 0) => [[1, 3], [2, 4]]
 *
 * @param collection An array.
 * @param projection A function to be called for each item in the collection.
 * @returns A two-item array, the first containing a list of truthy values, and
 *          the second containing a list of falsey values.
 */
export function partition<T>(
  collection: ReadonlyArray<T>,
  projection: (value: T) => boolean,
): [ReadonlyArray<T>, ReadonlyArray<T>] {
  const matching: T[] = [];
  const nonMatching: T[] = [];

  collection.forEach(item => {
    if (projection(item)) {
      matching.push(item);
    } else {
      nonMatching.push(item);
    }
  });

  return [matching, nonMatching];
}

// https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
export function isNumeric(n: any) {
  return !Number.isNaN(parseFloat(n)) && Number.isFinite(Number(n));
}

export function flatten<T>(
  arr: ReadonlyArray<ReadonlyArray<T>>,
): ReadonlyArray<T> {
  return arr.reduce((acc, inner) => [...acc, ...inner], []);
}

/** Performs a deep comparison between two values to determine if they are equivalent.
 *
 * Signature same as lodash
 * @param value The value to compare.
 * @param other The other value to compare.
 * @returns Returns `true` if the values are equivalent, else `false`.
 */
export function isEqual(a: any, b: any): boolean {
  if (a === b) {
    return true;
  }

  if (Array.isArray(a)) {
    return (
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((value, i) => isEqual(value, b[i]))
    );
  }

  if (a instanceof Date) {
    return b instanceof Date && a.getTime() === b.getTime();
  }

  if (a instanceof RegExp) {
    return b instanceof RegExp && a.toString() === b.toString();
  }

  if (a instanceof Object && b instanceof Object) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    return (
      keysA.length === keysB.length &&
      keysA.every(key => keysB.includes(key) && isEqual(a[key], b[key]))
    );
  }

  return false;
}

/**
 * An implementation of the Haversine formula used to calculate "great circle"
 * distance.
 *
 * Example:
 *
 * Sydney Airport to London Heathrow Airport
 * `haversineDistance(51.469916, -0.454353, -33.939887, 151.175276) / 1000`
 * => ~17_019 km
 *
 * @see https://en.wikipedia.org/wiki/Haversine_formula
 *
 * @returns {number} Approximate distance in metres between two spatial points on Earth.
 */
export function haversineDistance(
  { latitude: latDeg1, longitude: lonDeg1 }: MapCoordinates,
  { latitude: latDeg2, longitude: lonDeg2 }: MapCoordinates,
) {
  const toRadians = (degree: number) => (degree / 180.0) * Math.PI;

  const lat1 = toRadians(latDeg1);
  const lon1 = toRadians(lonDeg1);
  const lat2 = toRadians(latDeg2);
  const lon2 = toRadians(lonDeg2);

  // Radius of earth in meters
  const earthRadius = 6_371_000;

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.asin(Math.sqrt(a));

  return earthRadius * c;
}

/* Maps an enum object to a list of its values */
export function enumToArray<T>(enumObject: T) {
  return (
    Object.keys(enumObject)
      // .filter(key => !isNumeric(key))
      .map(key => enumObject[key as keyof T])
  );
}

/**
 * This is used to cast + typeguard from AbstractControl to FormGroup
 * Issue with form controls not being strong typed since 2016
 * FIXME: https://github.com/angular/angular/issues/13721
 */

export function isFormGroup(
  item: AbstractControl | FormGroup | FormControl | FormArray,
): item is FormGroup {
  const castedItem = item as FormGroup | FormControl | FormArray;
  return (
    'controls' in castedItem &&
    castedItem.controls !== null &&
    typeof castedItem.controls === 'object'
  );
}

/**
 * This is used to cast + typeguard from AbstractControl to FormControl
 * Issue with form controls not being strong typed since 2016
 * FIXME: https://github.com/angular/angular/issues/13721
 */

export function isFormControl(
  item: AbstractControl | FormGroup | FormControl | FormArray,
): item is FormControl {
  const castedItem = item as FormGroup | FormControl | FormArray;
  return !('controls' in castedItem);
}
