import { expect, test } from "vitest";

import { createString, createStringStrictly } from "./main";

test.each([
  // 空文字列を入力すると空文字列が出力される。
  ["", {}, ""],
  // キーの長さがゼロの場合はそのまま出力される。
  ["{}", {}, ""],
  ["{}{}", {}, ""],
  // 閉じられていない括弧はそのまま出力される。
  ["{", {}, "{"],
  ["{{", {}, "{{"],
  ["{abc", { abc: "あ" }, "{abc"],
  ["{{abc}", { abc: "あ" }, "{あ"],
  ["{abc{abc}", { abc: "あ" }, "{abcあ"],
  // 閉じられていない括弧はそのまま出力される。
  ["}", {}, "}"],
  ["}}", {}, "}}"],
  ["abc}", { abc: "あ" }, "abc}"],
  ["{abc}}", { abc: "あ" }, "あ}"],
  ["{abc}abc}", { abc: "あ" }, "あabc}"],
  // 記号`{`を明示的にエスケープする場合は`{{}`とする。
  ["{{}", {}, "{"],
  // 記号`}`を明示的にエスケープする場合は`{}}`とする。
  ["{}}", {}, "}"],
  // 変換が出来る。
  ["{a}", { a: "あ" }, "あ"],
  ["{abc}", { abc: "あ" }, "あ"],
  ["{林檎}", { 林檎: "Apple" }, "Apple"],
  ["{abc}{abc}", { abc: "あ" }, "ああ"],
  ["{a}{aa}{aaa}", { a: "あ", aa: "い", aaa: "う" }, "あいう"],
  // 存在しないキーはそのまま出力される。
  ["{a}", {}, "{a}"],
  ["{abc}", {}, "{abc}"],
  ["{林檎}", {}, "{林檎}"],
  // `{`の後に`}`が文字として出現する場合、間に`{}`を挿入してエスケープする。
  ["{abcdef}", { abcdef: "あ" }, "あ"],
  ["{abc{}def}", { abcdef: "あ" }, "{abcdef}"],
  // `{}`が入れ子になっている場合、最も内側の`{}`のみ変換される。
  ["{a{b}c}", { a: "あ", b: "い", c: "う" }, "{aいc}"],
  ["{a{b{c}d}e}", { a: "あ", b: "い", c: "う", d: "え" }, "{a{bうd}e}"],
])(`[%#] ${createString.name}("%s", %o); // "%s"`, function (textTemplate, parameters, expected) {
  expect(createString(textTemplate, parameters)).toEqual(expected);
});

test.each([
  ["", {}, ""],
  ["{}", {}, ""],
  ["{a}", { a: "あ" }, "あ"],
  ["{a}{b}", { a: "あ", b: "い" }, "あい"],
  ["{a}{b}{c}", { a: "あ", b: "い", c: "う" }, "あいう"],
])(
  `[%#] ${createStringStrictly.name}("%s", %o); // "%s"`,
  function (textTemplate, parameters, expected) {
    expect(createStringStrictly(textTemplate, parameters)).toEqual(expected);
  },
);

test.each([
  ["{a}", {}],
  ["{a}{b}", { a: "あ" }],
])(`[%#] ${createStringStrictly.name}("%s", %o); // エラー`, function (textTemplate, parameters) {
  expect(function () {
    createStringStrictly(textTemplate, parameters);
  }).toThrow();
});
