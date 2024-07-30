import { describe, expect, test } from 'vitest';

import { countGraphemes } from './count-graphemes';

describe(`${countGraphemes.name}()`, function () {
  test.each([
    ['', 0],
    ['a', 1],
    ['abc', 3],
    ['あ', 1],
    ['あいうえお', 5],
    ['🍎', 1],
    ['𩸽', 1],
    ['🏴󠁧󠁢󠁥󠁮󠁧󠁿', 1],
    ['👨🏻‍💻', 1],
    ['👨‍👩‍👧‍👦', 1],
    ['🏴󠁧󠁢󠁥󠁮󠁧󠁿👨🏻‍💻👨‍👩‍👧‍👦', 3],
  ])(`[%#] "%s"を%i文字と数えられる`, function (input, expected) {
    expect(countGraphemes(input)).toBe(expected);
  });
});
