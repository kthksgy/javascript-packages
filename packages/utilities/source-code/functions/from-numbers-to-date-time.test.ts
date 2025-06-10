import { Temporal } from "temporal-polyfill";
import { describe, expect, test } from "vitest";

import { fromNumbersToDateTime } from "./from-numbers-to-date-time";

describe(`${fromNumbersToDateTime.name}`, function () {
  test("型が正しい。", function () {
    expect(fromNumbersToDateTime([0])).toBeInstanceOf(Temporal.PlainDateTime);
  });

  test.each([
    [[0], [0, 1, 1, 0, 0, 0, 0, 0, 0]],
    [[1], [1, 1, 1, 0, 0, 0, 0, 0, 0]],
    [[9999], [9999, 1, 1, 0, 0, 0, 0, 0, 0]],
    [[99999], [99999, 1, 1, 0, 0, 0, 0, 0, 0]],
    [
      [9999, 1],
      [9999, 1, 1, 0, 0, 0, 0, 0, 0],
    ],
    [
      [9999, 12],
      [9999, 12, 1, 0, 0, 0, 0, 0, 0],
    ],
    [
      [9999, 12, 1],
      [9999, 12, 1, 0, 0, 0, 0, 0, 0],
    ],
    [
      [9999, 12, 31],
      [9999, 12, 31, 0, 0, 0, 0, 0, 0],
    ],
    [
      [9999, 12, 31, 0],
      [9999, 12, 31, 0, 0, 0, 0, 0, 0],
    ],
    [
      [9999, 12, 31, 0],
      [9999, 12, 31, 0, 0, 0, 0, 0, 0],
    ],
    [
      [9999, 12, 31, 23],
      [9999, 12, 31, 23, 0, 0, 0, 0, 0],
    ],
    [
      [9999, 12, 31, 23, 0],
      [9999, 12, 31, 23, 0, 0, 0, 0, 0],
    ],
    [
      [9999, 12, 31, 23, 59],
      [9999, 12, 31, 23, 59, 0, 0, 0, 0],
    ],
    [
      [9999, 12, 31, 23, 59, 0],
      [9999, 12, 31, 23, 59, 0, 0, 0, 0],
    ],
    [
      [9999, 12, 31, 23, 59, 59],
      [9999, 12, 31, 23, 59, 59, 0, 0, 0],
    ],
    [
      [9999, 12, 31, 23, 59, 59, 0],
      [9999, 12, 31, 23, 59, 59, 0, 0, 0],
    ],
    [
      [9999, 12, 31, 23, 59, 59, 999],
      [9999, 12, 31, 23, 59, 59, 999, 0, 0],
    ],
    [
      [9999, 12, 31, 23, 59, 59, 999, 0],
      [9999, 12, 31, 23, 59, 59, 999, 0, 0],
    ],
    [
      [9999, 12, 31, 23, 59, 59, 999, 999],
      [9999, 12, 31, 23, 59, 59, 999, 999, 0],
    ],
    [
      [9999, 12, 31, 23, 59, 59, 999, 999, 0],
      [9999, 12, 31, 23, 59, 59, 999, 999, 0],
    ],
    [
      [9999, 12, 31, 23, 59, 59, 999, 999, 999],
      [9999, 12, 31, 23, 59, 59, 999, 999, 999],
    ],
  ] as const)(`[%#] %o => %o`, function (numbers, expected) {
    const dateTime = fromNumbersToDateTime(numbers);
    const [year, month, day, hour, minute, second, millisecond, microsecond, nanosecond] = expected;
    expect(dateTime.year).toBe(year);
    expect(dateTime.month).toBe(month);
    expect(dateTime.day).toBe(day);
    expect(dateTime.hour).toBe(hour);
    expect(dateTime.minute).toBe(minute);
    expect(dateTime.second).toBe(second);
    expect(dateTime.millisecond).toBe(millisecond);
    expect(dateTime.microsecond).toBe(microsecond);
    expect(dateTime.nanosecond).toBe(nanosecond);
  });
});
