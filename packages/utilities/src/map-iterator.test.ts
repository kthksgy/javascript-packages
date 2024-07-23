import { describe, expect, test } from 'vitest';

import { mapIterator } from './map-iterator';

describe(`${mapIterator.name}()`, function () {
  test(`配列をマップできる`, function () {
    const array = [1, 2, 3];
    expect(Array.from(mapIterator(array, (value) => value * 2))).toEqual([2, 4, 6]);
  });

  test(`セットをマップできる`, function () {
    const set = new Set<number>();
    set.add(1);
    set.add(2);
    set.add(3);
    expect(Array.from(mapIterator(set, (value) => value * 2))).toEqual([2, 4, 6]);
  });

  test(`マップをマップできる`, function () {
    const map = new Map<string, number>();
    map.set('1', 1);
    map.set('2', 2);
    map.set('3', 3);
    expect(Array.from(mapIterator(map, ([_, value]) => value * 2))).toEqual([2, 4, 6]);
  });

  test(`二重に適用できる`, function () {
    const array = [1, 2, 3];
    expect(
      Array.from(
        mapIterator(
          mapIterator(array, (value) => value * 2),
          (value) => value * 2,
        ),
      ),
    ).toEqual([4, 8, 12]);
  });
});
