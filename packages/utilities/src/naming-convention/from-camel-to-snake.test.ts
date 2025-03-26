import { describe, expect, test } from "vitest";

import { fromCamelToSnake } from "./from-camel-to-snake";

describe(`${fromCamelToSnake.name}()`, function () {
  test.each([
    ["", ""],
    ["a", "a"],
    ["abc", "abc"],
    ["abCd", "ab_cd"],
    ["aBCd", "a_b_cd"],
    ["aBCdEf", "a_b_cd_ef"],
    ["abcD", "abc_d"],
    ["ABC", "a_b_c"],
    ["lowerCamel", "lower_camel"],
    ["StackOverflow", "stack_overflow"],
    ["alllowercase", "alllowercase"],
    ["ALLCAPITALLETTERS", "a_l_l_c_a_p_i_t_a_l_l_e_t_t_e_r_s"],
    ["CustomXMLParser", "custom_x_m_l_parser"],
    ["APIFinder", "a_p_i_finder"],
    ["JSONResponseData", "j_s_o_n_response_data"],
    ["Person20Address", "person20_address"],
    ["UserAPI20Endpoint", "user_a_p_i20_endpoint"],
  ])(`[%#] %s => %s `, function (camel, snake) {
    expect(fromCamelToSnake(camel)).toStrictEqual(snake);
  });
});
