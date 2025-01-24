import { describe, expect, test } from "vitest";

import { toDateNumber } from "./to-date-number";

describe(`${toDateNumber.name}()`, function () {
  test.each([
    [[-0, 1, 1], 0b1_00001_0001_0],
    [[+0, 1, 1], 0b1_00001_0001_0],
    [[1, 1, 1], 0b1_00001_0001_1],
    [[1, 1, 31], 0b1_11111_0001_1],
    [[1, 12, 31], 0b1_11111_1100_1],
    [[2024, 12, 31], 0b1_11111_1100_11111101000],
    [[8796093022207, 1, 1], 0b1_00001_0001_1111111111111111111111111111111111111111111],
    [[8796093022207, 12, 31], 0b1_11111_1100_1111111111111111111111111111111111111111111],
  ])(`[%#] [ year, month, day ] = %o => %d`, function ([year, month, day], expected) {
    expect(toDateNumber(year, month, day)).toBe(expected);
  });
});
