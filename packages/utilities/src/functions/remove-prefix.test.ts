import { describe, expect, test } from 'vitest';

import { removePrefix } from './remove-prefix';

describe(`${removePrefix.name}()`, function () {
  test.each([
    ['', '', ''],
    ['a', 'a', ''],
    ['ab', 'ab', ''],
    ['abcdef', 'abc', 'def'],
    ['abcdef', 'def', 'abcdef'],
    ['aa', 'a', 'a'],
    ['a', 'b', 'a'],
    ['ab', 'cd', 'ab'],
  ])('[%#] removePrefix("%s", "%s") === "%s"', function (input, prefix, output) {
    expect(removePrefix(input, prefix)).toBe(output);
  });
});
