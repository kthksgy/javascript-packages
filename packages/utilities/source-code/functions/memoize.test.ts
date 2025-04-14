import { expect, test } from "vitest";

import { memoize } from "./memoize";

test("戻り値がメモ化されている", function () {
  function target(a: number, b: number) {
    return { a, b };
  }
  expect(target(1, 2)).not.toBe(target(1, 2));

  const memoized = memoize(target, function (a, b) {
    return a + "," + b;
  });
  expect(memoized(1, 2)).toBe(memoized(1, 2));
  expect(memoized(2, 3)).toBe(memoized(2, 3));
  expect(memoized(1, 2)).not.toBe(memoized(2, 3));
});

test("キャッシュがクリアできる", function () {
  const memoized = memoize(
    function target(a: number, b: number) {
      return { a, b };
    },
    function (a, b) {
      return a + "," + b;
    },
  );
  const result = memoized(1, 2);
  expect(result).toBe(memoized(1, 2));
  memoized.clear();
  expect(result).not.toBe(memoized(1, 2));
});
