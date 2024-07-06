import { describe, expect, test } from 'vitest';

import { fromPercentEncoded } from './from-percent-encoded';

describe(`${fromPercentEncoded.name}`, function () {
  test.each([
    ['%20', ' '],
    ['a', 'a'],
    ['aa', 'aa'],
    ['%21', '!'],
    ['%21%21', '!!'],
    ['%E3%81%82', 'あ'],
    ['%E3%81%82%E3%81%82', 'ああ'],
  ])('`%s`を`%s`に変換できる', function (input, expected) {
    expect(fromPercentEncoded(input)).toBe(expected);
  });
});
