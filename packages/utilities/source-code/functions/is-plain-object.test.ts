import { describe, expect, test } from "vitest";

import { isPlainObject } from "./is-plain-object";

describe(`${isPlainObject.name}()`, function () {
  class Test {}

  test.each([
    [{}, true],
    [{ a: 1 }, true],
    [Object.create({}), true],
    [Object.create(null), true],
    [Object.create(Object.prototype), true],
    [null, false],
    [undefined, false],
    [true, false],
    [false, false],
    [0, false],
    [1, false],
    [0n, false],
    [1n, false],
    [NaN, false],
    ["", false],
    ["a", false],
    [[], false],
    [[1], false],
    [new Date(), false],
    [new Error(), false],
    [new Map(), false],
    [new Set(), false],
    [Symbol(), false],
    [Symbol("a"), false],
    [new WeakMap(), false],
    [new WeakSet(), false],
    [function () {}, false],
    [new Test(), false],
    [/./, false],
  ])(`[%#] ${isPlainObject.name}(%o) = %o`, function (target, result) {
    expect(isPlainObject(target)).toStrictEqual(result);
  });
});
