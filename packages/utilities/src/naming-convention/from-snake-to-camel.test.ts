import { describe, expect, test } from "vitest";

import { fromSnakeToCamel } from "./from-snake-to-camel";

describe(`${fromSnakeToCamel.name}()`, function () {
  test.each([
    ["", ""],
    ["a", "a"],
    ["A", "a"],
    ["abc", "abc"],
    ["ABC", "abc"],
    ["ab_cd", "abCd"],
    ["AB_CD", "abCd"],
    ["Ab_Cd", "abCd"],
    ["a_b_c", "aBC"],
    ["A_B_C", "aBC"],
    ["a_b_c_de", "aBCDe"],
    ["A_B_C_DE", "aBCDe"],
    ["A_B_C_De", "aBCDe"],
    ["ab_cd_ef", "abCdEf"],
    ["AB_CD_EF", "abCdEf"],
    ["Ab_Cd_Ef", "abCdEf"],
    ["abc123_def456", "abc123Def456"],
    ["ABC123_DEF456", "abc123Def456"],
    ["Abc123_Def456", "abc123Def456"],
    ["snake_case", "snakeCase"],
    ["SCREAMING_SNAKE_CASE", "screamingSnakeCase"],
    ["Camel_Snake_Case", "camelSnakeCase"],
    ["a_1", "a1"], // 逆変換は想定していない。
    ["A_1", "a1"], // 逆変換は想定していない。
  ])(`[%#] %s => %s `, function (snake, camel) {
    expect(fromSnakeToCamel(snake)).toStrictEqual(camel);
  });
});
