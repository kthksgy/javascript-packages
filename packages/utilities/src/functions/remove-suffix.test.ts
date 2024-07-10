import { describe, expect, test } from 'vitest';

import { removeSuffix } from './remove-suffix';

describe(`${removeSuffix.name}()`, function () {
  test.each([
    ['', '', ''],
    ['a', 'a', ''],
    ['ab', 'ab', ''],
    ['abcdef', 'abc', 'abcdef'],
    ['abcdef', 'def', 'def'],
    ['aa', 'a', 'a'],
    ['a', 'b', 'a'],
    ['ab', 'cd', 'ab'],
  ])(`[%#] ${removeSuffix.name}("%s", "%s") === "%s"`, function (input, suffix, output) {
    expect(removeSuffix(input, suffix)).toBe(output);
  });
});
