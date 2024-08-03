import { describe, expect, test } from 'vitest';

import { toTimeNumber } from './to-time-number';

describe(`${toTimeNumber.name}()`, function () {
  test.each([
    [[-0, -0, -0, -0, -0, -0], -0b0000000000_0000000000_0000000000_000000_000000_00000],
    [[+0, +0, +0, +0, +0, +0], 0b0000000000_0000000000_0000000000_000000_000000_00000],
    [[23, 59, 59, 999, 999, 999], 0b1111100111_1111100111_1111100111_111011_111011_10111],
  ])(
    `[%#] [ hour, minute, second, millisecond, microsecond, nanosecond ] = %o => %d`,
    function ([hour, minute, second, millisecond, microsecond, nanosecond], expected) {
      expect(toTimeNumber(hour, minute, second, millisecond, microsecond, nanosecond)).toBe(
        expected,
      );
    },
  );
});
