import { describe, expect, test } from 'vitest';

import { fromTimeNumber } from './from-time-number';

describe(`${fromTimeNumber.name}()`, function () {
  test.each([
    [0b0000000000_0000000000_0000000000_000000_000000_00000, [0, 0, 0, 0, 0, 0]],
    [0b1111100111_1111100111_1111100111_111011_111011_10111, [23, 59, 59, 999, 999, 999]],
  ])(`[%#] %d => %o`, function (timeNumber, expected) {
    expect(fromTimeNumber(timeNumber)).toStrictEqual(expected);
  });
});
