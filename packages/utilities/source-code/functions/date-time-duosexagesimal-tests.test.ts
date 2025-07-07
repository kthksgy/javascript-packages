import { describe, expect, test } from "vitest";

import { toDateTimeNumber } from "./to-date-time-number";
import { toDuosexagesimal } from "./to-duosexagesimal";

describe("日時六十二進数のテスト", function () {
  test("モードビットを省略したナノ秒までの日時六十二進数の12文字の上限値", function () {
    expect(
      toDuosexagesimal(toDateTimeNumber(44773, 7, 4, 3, 46, 32, 774, 515, 999, null)).length,
    ).toEqual(12);
    expect(
      toDuosexagesimal(toDateTimeNumber(44773, 7, 4, 3, 46, 32, 774, 516, 0, null)).length,
    ).toEqual(13);
  });

  test("モードビットを省略したマイクロ秒までの日時六十二進数の10文字の上限値", function () {
    expect(
      toDuosexagesimal(toDateTimeNumber(11927, 2, 18, 19, 36, 44, 704, 999, null)).length,
    ).toEqual(10);
    expect(
      toDuosexagesimal(toDateTimeNumber(11927, 2, 18, 19, 36, 44, 705, 0, null)).length,
    ).toEqual(11);
  });

  test("モードビットを省略したミリ秒までの日時六十二進数の9文字の上限値", function () {
    expect(toDuosexagesimal(toDateTimeNumber(196990, 8, 18, 11, 34, 15, 511, null)).length).toEqual(
      9,
    );
    expect(toDuosexagesimal(toDateTimeNumber(196990, 8, 18, 11, 34, 15, 512, null)).length).toEqual(
      10,
    );
  });

  test("モードビットを省略したミリ秒までの日時六十二進数の8文字の上限値", function () {
    expect(toDuosexagesimal(toDateTimeNumber(3177, 4, 8, 17, 47, 0, 255, null)).length).toEqual(8);
    expect(toDuosexagesimal(toDateTimeNumber(3177, 4, 8, 17, 47, 0, 256, null)).length).toEqual(9);
  });

  test("モードビットを省略した秒までの日時六十二進数の7文字の上限値", function () {
    expect(toDuosexagesimal(toDateTimeNumber(52476, 2, 11, 6, 59, 59, null)).length).toEqual(7);
    expect(toDuosexagesimal(toDateTimeNumber(52476, 2, 11, 7, 0, 0, null)).length).toEqual(8);
  });

  test("モードビットを省略した分までの日時六十二進数の6文字の上限値", function () {
    expect(toDuosexagesimal(toDateTimeNumber(54168, 12, 31, 23, 59, null)).length).toEqual(6);
    expect(toDuosexagesimal(toDateTimeNumber(54169, 1, 1, 0, 0, null)).length).toEqual(7);
  });

  test("モードビットを省略した時までの日時六十二進数の5文字の上限値", function () {
    expect(toDuosexagesimal(toDateTimeNumber(55916, 4, 30, 23, null)).length).toEqual(5);
    expect(toDuosexagesimal(toDateTimeNumber(55916, 5, 1, 0, null)).length).toEqual(6);
  });

  test("モードビットを省略した日までの日時六十二進数の4文字の上限値", function () {
    expect(toDuosexagesimal(toDateTimeNumber(28859, 12, 31, null)).length).toEqual(4);
    expect(toDuosexagesimal(toDateTimeNumber(28860, 1, 1, null)).length).toEqual(5);
  });

  test("モードビットを省略した月までの日時六十二進数の3文字の上限値", function () {
    expect(toDuosexagesimal(toDateTimeNumber(14895, 7, null)).length).toEqual(3);
    expect(toDuosexagesimal(toDateTimeNumber(14895, 8, null)).length).toEqual(4);
  });
});
