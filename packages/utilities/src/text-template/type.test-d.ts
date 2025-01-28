import { expectTypeOf, test } from "vitest";

import type {
  LastTextTemplateKey,
  TextTemplateKey,
  TextTemplateKeyTuple,
  TextTemplateParameters,
  TextTemplateType,
} from "./main";

test(`タイプテスト`, function () {
  type T0 = "";
  type T1 = TextTemplateKeyTuple<T0>;
  type T2 = TextTemplateKey<T0>;
  type T3 = LastTextTemplateKey<T0>;
  type T4 = TextTemplateParameters<T0>;
  type T5 = TextTemplateType<T0>;
  expectTypeOf([] satisfies T1).toMatchTypeOf<T1>();
  0 as never satisfies T2;
  0 as never satisfies T3;
  expectTypeOf({} satisfies T4).toMatchTypeOf<T4>();
  "" satisfies T5;
});

test("タイプテスト", function () {
  type T0 = "{}";
  type T1 = TextTemplateKeyTuple<T0>;
  type T2 = TextTemplateKey<T0>;
  type T3 = LastTextTemplateKey<T0>;
  type T4 = TextTemplateParameters<T0>;
  type T5 = TextTemplateType<T0>;
  expectTypeOf([] satisfies T1).toMatchTypeOf<T1>();
  0 as never satisfies T2;
  0 as never satisfies T3;
  expectTypeOf({} satisfies T4).toMatchTypeOf<T4>();
  "" satisfies T5;
});

test("タイプテスト", function () {
  type T0 = "{}{}";
  type T1 = TextTemplateKeyTuple<T0>;
  type T2 = TextTemplateKey<T0>;
  type T3 = LastTextTemplateKey<T0>;
  type T4 = TextTemplateParameters<T0>;
  type T5 = TextTemplateType<T0>;
  expectTypeOf([] satisfies T1).toMatchTypeOf<T1>();
  0 as never satisfies T2;
  0 as never satisfies T3;
  expectTypeOf({} satisfies T4).toMatchTypeOf<T4>();
  "" satisfies T5;
});

test("タイプテスト", function () {
  type T0 = "{a}";
  type T1 = TextTemplateKeyTuple<T0>;
  type T2 = TextTemplateKey<T0>;
  type T3 = LastTextTemplateKey<T0>;
  type T4 = TextTemplateParameters<T0>;
  type T5 = TextTemplateType<T0>;
  expectTypeOf(["a"] satisfies T1).toMatchTypeOf<T1>();
  "a" satisfies T2;
  "a" satisfies T3;
  expectTypeOf({ a: "" } satisfies T4).toMatchTypeOf<T4>();
  "a" satisfies T5;
});

test("タイプテスト", function () {
  type T0 = "{a}{a}";
  type T1 = TextTemplateKeyTuple<T0>;
  type T2 = TextTemplateKey<T0>;
  type T3 = LastTextTemplateKey<T0>;
  type T4 = TextTemplateParameters<T0>;
  type T5 = TextTemplateType<T0>;
  expectTypeOf(["a", "a"] satisfies T1).toMatchTypeOf<T1>();
  "a" satisfies T2;
  "a" satisfies T3;
  expectTypeOf({ a: "" } satisfies T4).toMatchTypeOf<T4>();
  "aa" satisfies T5;
});

test("タイプテスト", function () {
  type T0 = "{a}{b}{c}";
  type T1 = TextTemplateKeyTuple<T0>;
  type T2 = TextTemplateKey<T0>;
  type T3 = LastTextTemplateKey<T0>;
  type T4 = TextTemplateParameters<T0>;
  type T5 = TextTemplateType<T0>;
  expectTypeOf(["a", "b", "c"] satisfies T1).toMatchTypeOf<T1>();
  "a" satisfies T2;
  "b" satisfies T2;
  "c" satisfies T2;
  "c" satisfies T3;
  expectTypeOf({ a: "", b: "", c: "" } satisfies T4).toMatchTypeOf<T4>();
  "abc" satisfies T5;
});

test("タイプテスト", function () {
  type T0 = "a{a}b{b}c{c}d";
  type T1 = TextTemplateKeyTuple<T0>;
  type T2 = TextTemplateKey<T0>;
  type T3 = LastTextTemplateKey<T0>;
  type T4 = TextTemplateParameters<T0>;
  type T5 = TextTemplateType<T0>;
  expectTypeOf(["a", "b", "c"] satisfies T1).toMatchTypeOf<T1>();
  "a" satisfies T2;
  "b" satisfies T2;
  "c" satisfies T2;
  "c" satisfies T3;
  expectTypeOf({ a: "", b: "", c: "" } satisfies T4).toMatchTypeOf<T4>();
  "aあbいcうd" satisfies T5;
});

test("タイプテスト", function () {
  type T0 = "a{あ}b{い}c{う}d";
  type T1 = TextTemplateKeyTuple<T0>;
  type T2 = TextTemplateKey<T0>;
  type T3 = LastTextTemplateKey<T0>;
  type T4 = TextTemplateParameters<T0>;
  type T5 = TextTemplateType<T0>;
  expectTypeOf(["あ", "い", "う"] satisfies T1).toMatchTypeOf<T1>();
  "あ" satisfies T2;
  "い" satisfies T2;
  "う" satisfies T2;
  "う" satisfies T3;
  expectTypeOf({ あ: "", い: "", う: "" } satisfies T4).toMatchTypeOf<T4>();
  "aあbいcうd" satisfies T5;
});

test("タイプテスト", function () {
  type T0 = "{abc{abc}";
  type T1 = TextTemplateKeyTuple<T0>;
  type T2 = TextTemplateKey<T0>;
  type T3 = LastTextTemplateKey<T0>;
  type T4 = TextTemplateParameters<T0>;
  type T5 = TextTemplateType<T0>;
  expectTypeOf(["abc"] satisfies T1).toMatchTypeOf<T1>();
  "abc" satisfies T2;
  "abc" satisfies T3;
  expectTypeOf({ abc: "" } satisfies T4).toMatchTypeOf<T4>();
  "{abcabc" satisfies T5;
});

test("タイプテスト", function () {
  type T0 = "{abc}abc}";
  type T1 = TextTemplateKeyTuple<T0>;
  type T2 = TextTemplateKey<T0>;
  type T3 = LastTextTemplateKey<T0>;
  type T4 = TextTemplateParameters<T0>;
  type T5 = TextTemplateType<T0>;
  expectTypeOf(["abc"] satisfies T1).toMatchTypeOf<T1>();
  "abc" satisfies T2;
  "abc" satisfies T3;
  expectTypeOf({ abc: "" } satisfies T4).toMatchTypeOf<T4>();
  "abcabc}" satisfies T5;
});
