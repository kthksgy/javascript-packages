import { describe, expect, test } from "vitest";

import { toDateTimeNumber } from "./to-date-time-number";

describe(`${toDateTimeNumber.name}()`, function () {
  test.each([
    [
      [-0, 1, 1, -0, -0, -0, -0, -0, -0, true],
      0b0_0001_00001_00000_000000_000000_0000000000_0000000000_0000000000n,
    ],
    [
      [+0, 1, 1, +0, +0, +0, +0, +0, +0, true],
      0b0_0001_00001_00000_000000_000000_0000000000_0000000000_0000000000n,
    ],
    [
      [2024, 12, 31, 23, 59, 59, 999, 999, 999, true],
      0b11111101000_1100_11111_10111_111011_111011_1111100111_1111100111_1111100111n,
    ],
    // TODO: テストケースを追加する。
  ] as const)(
    `[%#] [ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, linear ] = %o => %d`,
    function (
      [year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, linear],
      expected,
    ) {
      expect(
        toDateTimeNumber(
          year,
          month,
          day,
          hour,
          minute,
          second,
          millisecond,
          microsecond,
          nanosecond,
          linear,
        ),
      ).toBe(expected);
    },
  );
});
