import { describe, expect, test } from "vitest";

import { fromBinaryToBase64 } from "./from-binary-to-base64";

describe(fromBinaryToBase64.name, function () {
  test("空文字列を入力できる", function () {
    expect(fromBinaryToBase64("")).toBe("");
  });

  test("`Hello World`を処理できる", function () {
    expect(fromBinaryToBase64("Hello World")).toBe("SGVsbG8gV29ybGQ=");
  });

  test("0から255までの数値が順に並んだバイナリ文字列を処理できる", function () {
    expect(fromBinaryToBase64(String.fromCharCode(...[...Array(256).keys()]))).toBe(
      "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w==",
    );
  });
});
