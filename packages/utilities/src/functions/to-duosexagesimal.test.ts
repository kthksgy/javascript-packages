import { describe, expect, test } from 'vitest';

import { toDuosexagesimal } from './to-duosexagesimal';

describe(`${toDuosexagesimal.name}()`, function () {
  test.each([
    [0, '0'],
    [1, '1'],
    [61, 'z'],
    [62, '10'],
    [3843, 'zz'],
    [3844, '100'],
    [238327, 'zzz'],
    [238328, '1000'],
    [14776335, 'zzzz'],
    [14776336, '10000'],
    [916132831, 'zzzzz'],
    [916132832, '100000'],
    [56800235583, 'zzzzzz'],
    [56800235584, '1000000'],
    [3521614606207, 'zzzzzzz'],
    [3521614606208, '10000000'],
    [218340105584895, 'zzzzzzzz'],
    [218340105584896, '100000000'],
  ])('[%#] `%d`を`%s`に変換できる', function (decimal, duosexagesimal) {
    const actual1 = toDuosexagesimal(decimal);
    const actual2 = toDuosexagesimal(BigInt(decimal));
    expect(actual1).toBe(duosexagesimal);
    expect(actual2).toBe(duosexagesimal);
    expect(actual1).toBe(actual2);
  });

  test('`Number.MAX_SAFE_INTEGER(9007199254740991)`を入力できる', function () {
    expect(Number.MAX_SAFE_INTEGER).toBe(9007199254740991);
    expect(toDuosexagesimal(Number.MAX_SAFE_INTEGER)).toBe('fFgnDxSe7');
    expect(toDuosexagesimal(BigInt(Number.MAX_SAFE_INTEGER))).toBe('fFgnDxSe7');
  });

  test('`BigInt(Number.MAX_SAFE_INTEGER) + 1n`を入力できる', function () {
    expect(toDuosexagesimal(BigInt(Number.MAX_SAFE_INTEGER) + 1n)).toBe('fFgnDxSe8');
  });

  test('0未満の整数を入力できない', function () {
    expect(function () {
      toDuosexagesimal(-1);
    }).toThrowError(TypeError);
  });

  test('0未満の長整数を入力できない', function () {
    expect(function () {
      toDuosexagesimal(-1);
    }).toThrowError(TypeError);
  });

  test('非整数を入力できない', function () {
    expect(function () {
      toDuosexagesimal(0.1);
    }).toThrowError(TypeError);
  });

  test('`Infinity`と`-Infinity`を入力できない', function () {
    expect(function () {
      toDuosexagesimal(Infinity);
    }).toThrowError(TypeError);
    expect(function () {
      toDuosexagesimal(-Infinity);
    }).toThrowError(TypeError);
  });

  test('`NaN`を入力できない', function () {
    expect(function () {
      toDuosexagesimal(NaN);
    }).toThrowError(TypeError);
  });
});
