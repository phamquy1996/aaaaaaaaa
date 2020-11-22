import { flatten, fromPairs } from '@freelancer/utils';

/**
 * This Is like Partial only it applies it recursively.
 *
 * This type isn't 100% perfect as it maps `foo: number[]`
 * to `foo: (number | undefined)[] | undefined`
 * rather than `foo: number[] | undefined`
 * but it does map `foo: User` to `foo: RecursivePartial<User>`
 * which is what we want, and it keeps `ReadonlyArray` (somehow)
 * which we definitely want so it's probably fine.
 */

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[] // tslint:disable-line:readonly-array
    ? RecursivePartial<U>[] // tslint:disable-line:readonly-array
    : RecursivePartial<T[P]>;
};

export function isObject(item: unknown): item is object {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Deeply merges two objects to create a new object, where the second object
 * does not need to have all properties of the first.
 */
export function deepSpread<T>(original: T, delta: RecursivePartial<T>): T {
  if (!isObject(delta)) {
    return delta;
  }

  return {
    ...original,
    ...mapValues<any, keyof T>(delta, (value, key) =>
      deepSpread(((original || {}) as any)[key], value),
    ),
  };
}

export function sameElements<T>(
  as: ReadonlyArray<T>,
  bs: ReadonlyArray<T>,
): boolean {
  const setAs = new Set(as);
  const setBs = new Set(bs);
  return as.every(a => setBs.has(a)) && bs.every(b => setAs.has(b));
}

// All the (distinct) elements in `as` that isn't in `bs`.
export function setDiff<T>(
  as: ReadonlyArray<T>,
  bs: ReadonlyArray<T>,
): ReadonlyArray<T> {
  const setAs = new Set(as);
  const setBs = new Set(bs);
  return Array.from(setAs).filter(a => !setBs.has(a));
}

export enum OrderByDirection {
  ASC,
  DESC,
}

/**
 * Returns a compare function that can be used by Array.prototype.sort()
 */
export function compareMultipleFields<T>([order, ...orders]: ReadonlyArray<{
  readonly field: keyof T;
  readonly direction?: OrderByDirection;
}>): (a: T, b: T) => 0 | 1 | -1 {
  if (order === undefined) {
    return () => 0;
  }

  const { field, direction = OrderByDirection.ASC } = order;
  return (a: T, b: T) => {
    if (a[field] < b[field]) {
      return direction === OrderByDirection.DESC ? 1 : -1;
    }
    if (a[field] > b[field]) {
      return direction === OrderByDirection.DESC ? -1 : 1;
    }
    return compareMultipleFields(orders)(a, b);
  };
}

/**
 * Returns an array with no duplicate elements, where uniqueness is defined
 * by the comparator function passed in. Preserves order of the original array.
 * If the comparator is not given, it defaults to '===' equality.
 *
 * Example: Get all unique names from users
 *
 * const names = uniqWith(users, (u1, u2) => u1.name === u2.name).map(u => u.name)
 */
export function uniqWith<T>(
  xs: ReadonlyArray<T>,
  compareFunction: (a: T, b: T) => boolean = (a: T, b: T) => a === b,
): ReadonlyArray<T> {
  return xs.reduce(
    (acc: T[], x: T) =>
      acc.find(y => compareFunction(x, y)) ? acc : [...acc, x],
    [],
  );
}

export function uniq<T>(xs: ReadonlyArray<T>): ReadonlyArray<T> {
  return uniqWith(xs, (x, y) => x === y);
}

export function takeWhile<T, S extends T>(
  array: ReadonlyArray<T>,
  predicate: (
    value: T,
    index: number,
    collection: ReadonlyArray<T>,
  ) => value is S,
): ReadonlyArray<S>;

export function takeWhile<T>(
  array: ReadonlyArray<T>,
  predicate: (value: T, index: number, collection: ReadonlyArray<T>) => boolean,
): ReadonlyArray<T>;

export function takeWhile<T>(
  array: ReadonlyArray<T>,
  predicate: (value: T, index: number, collection: ReadonlyArray<T>) => boolean,
): ReadonlyArray<T> {
  const index = array.findIndex((v, i, c) => !predicate(v, i, c));
  return index === -1 ? array : array.slice(0, index);
}

export function flatMap<T, U>(
  array: ReadonlyArray<T>,
  callbackfn: (
    value: T,
    index: number,
    array: ReadonlyArray<T>,
  ) => ReadonlyArray<U>,
): ReadonlyArray<U> {
  return flatten(array.map(callbackfn));
}

export function chunk<T>(
  array: ReadonlyArray<T>,
  size = 1,
): ReadonlyArray<ReadonlyArray<T>> {
  const result: ReadonlyArray<T>[] = [];
  for (let index = 0; index < array.length; index += size) {
    result.push(array.slice(index, index + size));
  }
  return result;
}

export function objectKeysFilter<K extends PropertyKey, V>(
  object: { readonly [s in K]?: V },
  predicate: (value: V, key: string) => boolean,
): ReadonlyArray<K> {
  return Object.entries<V | undefined>(object)
    .filter(([key, value]) => value && predicate(value, key))
    .map(([key, value]) => key) as K[];
}

export function arrayIsShallowEqual<T>(
  a?: ReadonlyArray<T>,
  b?: ReadonlyArray<T>,
): boolean {
  return Boolean(
    a &&
      b &&
      a.length === b.length &&
      a.every((entity, index) => entity === b[index]),
  );
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
 * Creates an object with the same keys as `object` and values generated
 * by running each own enumerable string keyed property of `object` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, key, object).
 *
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns the new mapped object.
 * @example
 *
 * const users = {
 *   'fred':    { 'user': 'fred',    'age': 40 },
 *   'pebbles': { 'user': 'pebbles', 'age': 1 }
 * };
 *
 * _.mapValues(users, o => o.age);
 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
 */
export function mapValues<T, S>(
  object: { readonly [key: string]: T },
  iteratee: (x: T, y: string) => S,
): {
  readonly [key: string]: S;
};
export function mapValues<T, S, E extends string | number | symbol = string>(
  object: { readonly [key in E]?: T },
  iteratee: (x: T | undefined, y: string) => S,
): {
  readonly [key in E]?: S;
};
export function mapValues<T, S, E extends string | number | symbol = string>(
  object: { readonly [key in E]?: T },
  iteratee: (x: T | undefined, y: string) => S,
): {
  readonly [key in E]?: S;
} {
  return fromPairs(
    Object.entries<T | undefined>(object).map(([key, value]) => [
      key as E,
      iteratee(value, key),
    ]),
  );
}

/**
 * Creates an object composed of keys generated from the results of running
 * each element of `collection` thru `iteratee`. The corresponding value of
 * each key is the last element responsible for generating the key. The
 * iteratee is invoked with one argument: (value).
 *
 * @param collection The collection to iterate over.
 * @param iteratee The iteratee to transform keys.
 * @returns Returns the composed aggregate object.
 * @example
 *
 * const array = [
 *   { 'dir': 'left', 'code': 97 },
 *   { 'dir': 'right', 'code': 100 }
 * ]
 *
 * keyBy(array, ({ code }) => String.fromCharCode(code))
 * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
 */

export function keyBy<T>(
  collection: ReadonlyArray<T>,
  iteratee: (value: T) => PropertyKey,
): { readonly [x: string]: T } {
  return fromPairs(collection.map(item => [iteratee(item), item]));
}
