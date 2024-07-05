import { expect, test } from 'vitest';

import { fromBinaryToBase64 } from './from-binary-to-base64';

test('空文字列を入力できる', function () {
  expect(fromBinaryToBase64('')).toBe('');
});

test('バイナリ文字列をBase64文字列に変換できる', function () {
  expect(fromBinaryToBase64('Hello World')).toBe('SGVsbG8gV29ybGQ=');
});
