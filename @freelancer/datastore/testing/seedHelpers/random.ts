/**
 * These functions make pseudo-random numbers.
 * The difference here is that they have a fixed seed
 * so they always return the same values given the same inputs.
 *
 * This is necessary for stable tests.
 */

export function generateNumbersInRangeWithDuplicates(
  min: number,
  max: number,
  count: number,
  seed: string,
) {
  const smallBatchSize = Math.floor(count / 3);

  const biggerList = generateNumbersInRange(min, max, count - smallBatchSize);
  const smallerList = randomiseList(biggerList, seed).slice(smallBatchSize);
  return randomiseList([...smallerList, ...biggerList].sort(), seed);
}

export function generateNumbersInRange(
  min: number,
  max: number,
  count: number,
) {
  return count === 1
    ? [min]
    : Array.from(
        { length: count },
        (v, i) => min + ((i % count) * (max - min)) / (count - 1),
      );
}

export function generateArrayWithValues<T>(
  length: number,
  value: T,
): ReadonlyArray<T> {
  return Array.from({ length }, () => value);
}

export function generateIntegersInRange(
  min: number,
  max: number,
  count: number,
) {
  if (max - min + 1 < count) {
    throw new Error(
      `Cannot generate ${count} integers between ${min} and ${max}.`,
    );
  }
  return generateNumbersInRange(min, max, count).map(x => Math.floor(x));
}

// tslint:disable:no-bitwise
/* eslint-disable no-bitwise */
/* Based on https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript */
function hashCode(s: string) {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0;
  }
  return hash;
}
// tslint:enable:no-bitwise
/* eslint-enable no-bitwise */

// Based on code from https://stackoverflow.com/a/19303725
export function randomiseList<T>(
  list: ReadonlyArray<T>,
  seed: string,
): ReadonlyArray<T> {
  return list
    .map((value, index) => {
      const x = Math.sin(index + 1 + hashCode(seed)) * 10_000;
      return [value, x - Math.floor(x)] as const;
    })
    .sort(([, a], [, b]) => b - a)
    .map(([a]) => a);
}

export const generateId = (() => {
  const ids = [
    ...randomiseList(generateIntegersInRange(1, 1_000_000, 10_000), 'ids'),
  ];
  return () => {
    const id = ids.pop();
    if (id === undefined) {
      throw new Error('Ran out of ids, used more than 10,000.');
    }
    return id;
  };
})();

export function average(values: ReadonlyArray<number>): number | undefined {
  if (values.length === 0) {
    return undefined;
  }

  return values.reduce((a, b) => a + b, 0) / values.length;
}
