import { expect, test } from 'vitest';

import { fromBase64ToBinary } from './from-base64-to-binary';

test('空文字列を入力できる', function () {
  expect(fromBase64ToBinary('')).toBe('');
});

test('Base64文字列をバイナリ文字列に変換できる', function () {
  expect(fromBase64ToBinary('SGVsbG8gV29ybGQ=')).toBe('Hello World');
});
