import { describe, expect, test } from 'vitest';

import { isIterable } from './is-iterable';

describe(`${isIterable.name}()`, function () {
  test.each([
    [],
    Object.entries({}),
    Object.keys({}),
    Object.values({}),
    new Map(),
    new Set(),
    new Map().keys(),
    new Map().values(),
    new Map().entries(),
    new Set().keys(),
    new Set().values(),
    new Set().entries(),
  ])('[%#] `true`を返す', function (value) {
    expect(isIterable(value)).toBe(true);
  });

  test.each([undefined, null, 1234, 'abcd', true, false, Symbol.iterator])(
    '[%#] `false`を返す',
    function (value) {
      expect(isIterable(value)).toBe(false);
    },
  );
});
