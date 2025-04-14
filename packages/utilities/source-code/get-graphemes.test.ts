import { describe, expect, test } from "vitest";

import { getGraphemes } from "./get-graphemes";

describe(`${getGraphemes.name}()`, function () {
  test.each([
    ["", []],
    ["a", ["a"]],
    ["abc", ["a", "b", "c"]],
    ["あ", ["あ"]],
    ["あいうえお", ["あ", "い", "う", "え", "お"]],
    ["🍎", ["🍎"]],
    ["🏴󠁧󠁢󠁥󠁮󠁧󠁿👨🏻‍💻👨‍👩‍👧‍👦", ["🏴󠁧󠁢󠁥󠁮󠁧󠁿", "👨🏻‍💻", "👨‍👩‍👧‍👦"]],
  ])(`[%#] "%s"を%oに分割出来る`, function (input, expected) {
    expect(getGraphemes(input)).toEqual(expected);
  });
});
