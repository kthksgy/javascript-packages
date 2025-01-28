import { expect, test } from "vitest";

import { parseString, parseStringStrictly } from "./main";

test.each([
  // 空文字列を入力すると空オブジェクトが出力される。
  ["", "", {}],
  // キーの長さがゼロの場合はそのまま出力される。
  ["{}", "", {}],
  ["{}{}", "", {}],
  // 閉じられていない括弧はそのまま出力される。
  ["{", "{", {}],
  ["{{", "{{", {}],
  ["{abc", "{abc", {}],
  // 閉じられていない括弧はそのまま出力される。
  ["}", "}", {}],
  ["}}", "}}", {}],
  ["abc}", "abc}", {}],
  // 記号`{`を明示的にエスケープする場合は`{{}`とする。
  ["{{}", "", {}],
  // 記号`}`を明示的にエスケープする場合は`{}}`とする。
  ["{}}", "", {}],
  // 変換が出来る。
  ["{a}", "あ", { a: "あ" }],
  ["{abc}", "あ", { abc: "あ" }],
  ["{林檎}", "Apple", { 林檎: "Apple" }],
  ["{a}{aa}{aaa}", "あいう", { a: "あいう", aa: "", aaa: "" }],
  ["{{abc}", "{あ", { abc: "あ" }],
  ["{abc{abc}", "{abcあ", { abc: "あ" }],
  ["{abc}}", "あ}", { abc: "あ" }],
  ["{abc}abc}", "あabc}", { abc: "あ" }],
  // 存在しないキーはそのまま出力される。
  ["{a}", "", { a: "" }],
  ["{abc}", "", { abc: "" }],
  ["{林檎}", "", { 林檎: "" }],
  // `{`の後に`}`が文字として出現する場合、間に`{}`を挿入してエスケープする。
  ["{abcdef}", "あ", { abcdef: "あ" }],
  ["{abc{}def}", "{abcdef}", {}],
])(`[%#] ${parseString.name}("%s", "%s"); // %o`, function (textTemplate, target, expected) {
  expect(parseString(textTemplate, target)).toEqual(expected);
});

test.each([
  // 同じキーが複数回出現する場合はエラーとなる。
  ["{abc}{abc}", "ああ", { abc: "あ" }],
])(`[%#] ${parseString.name}("%s", "%s"); // エラー`, function (textTemplate, target) {
  expect(function () {
    parseString(textTemplate, target);
  }).toThrow();
});

test.each([
  ["", "", {}],
  ["{}", "", {}],
  ["{a}", "", { a: "" }],
  ["{abc}", "", { abc: "" }],
  ["{林檎}", "", { 林檎: "" }],
  ["{a}", "あ", { a: "あ" }],
  ["{a}{b}", "あい", { a: "あい", b: "" }],
  ["{a}{b}{c}", "あいう", { a: "あいう", b: "", c: "" }],
])(
  `[%#] ${parseStringStrictly.name}("%s", "%s"); // %o`,
  function (textTemplate, target, expected) {
    expect(parseStringStrictly(textTemplate, target)).toEqual(expected);
  },
);

test.each([
  ["a{a}b{b}c", "aあb"],
  ["a{a}b{b}c{c}d", "aあbいc"],
])(`[%#] ${parseStringStrictly.name}("%s", "%s"); // エラー`, function (textTemplate, target) {
  expect(function () {
    parseStringStrictly(textTemplate, target);
  }).toThrow();
});
