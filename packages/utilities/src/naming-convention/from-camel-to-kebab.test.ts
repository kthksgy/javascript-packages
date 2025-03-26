import { describe, expect, test } from "vitest";

import { fromCamelToKebab } from "./from-camel-to-kebab";

describe(`${fromCamelToKebab.name}()`, function () {
  test.each([
    ["", ""],
    ["a", "a"],
    ["abc", "abc"],
    ["abCd", "ab-cd"],
    ["aBCd", "a-b-cd"],
    ["aBCdEf", "a-b-cd-ef"],
    ["abcD", "abc-d"],
    ["ABC", "a-b-c"],
    ["lowerCamel", "lower-camel"],
    ["StackOverflow", "stack-overflow"],
    ["alllowercase", "alllowercase"],
    ["ALLCAPITALLETTERS", "a-l-l-c-a-p-i-t-a-l-l-e-t-t-e-r-s"],
    ["CustomXMLParser", "custom-x-m-l-parser"],
    ["APIFinder", "a-p-i-finder"],
    ["JSONResponseData", "j-s-o-n-response-data"],
    ["Person20Address", "person20-address"],
    ["UserAPI20Endpoint", "user-a-p-i20-endpoint"],
  ])(`[%#] %s => %s `, function (camel, kebab) {
    expect(fromCamelToKebab(camel)).toStrictEqual(kebab);
  });
});
