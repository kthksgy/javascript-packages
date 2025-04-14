import { describe, expect, test } from "vitest";

import { toPercentEncoded } from "./to-percent-encoded";

describe(`${toPercentEncoded.name}`, function () {
  test.each([
    [" ", "%20"],
    ["a", "a"],
    ["aa", "aa"],
    ["!", "%21"],
    ["!!", "%21%21"],
    ["あ", "%E3%81%82"],
    ["ああ", "%E3%81%82%E3%81%82"],
  ])("`%s`を`%s`に変換できる", function (input, expected) {
    expect(toPercentEncoded(input)).toBe(expected);
  });
});
