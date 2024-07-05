import { describe, expect, test } from 'vitest';

import { fromBytesToBinaryString } from './from-bytes-to-binary-string';

// `Hello World`は`48 65 6c 6c 6f 20 57 6f 72 6c 64`。

describe(`${fromBytesToBinaryString.name}()`, function () {
  test('空の配列バッファを入力できる', function () {
    expect(fromBytesToBinaryString(new ArrayBuffer(0))).toBe('');
  });

  test('配列バッファをバイナリ文字列に変換できる', function () {
    /** 配列バッファ */
    const arrayBuffer = new ArrayBuffer(11);
    /** 配列バッファのビュー(配列バッファは直接操作出来ないため) */
    const arrayBufferView = new Uint8Array(arrayBuffer);
    arrayBufferView[0] = 0x48;
    arrayBufferView[1] = 0x65;
    arrayBufferView[2] = 0x6c;
    arrayBufferView[3] = 0x6c;
    arrayBufferView[4] = 0x6f;
    arrayBufferView[5] = 0x20;
    arrayBufferView[6] = 0x57;
    arrayBufferView[7] = 0x6f;
    arrayBufferView[8] = 0x72;
    arrayBufferView[9] = 0x6c;
    arrayBufferView[10] = 0x64;
    expect(fromBytesToBinaryString(arrayBuffer)).toBe('Hello World');
  });

  test('空の8ビット符号無し整数配列を入力できる', function () {
    expect(fromBytesToBinaryString(new Uint8Array(0))).toBe('');
  });

  test('8ビット符号無し整数配列をバイナリ文字列に変換できる', function () {
    expect(
      fromBytesToBinaryString(
        new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x57, 0x6f, 0x72, 0x6c, 0x64]),
      ),
    ).toBe('Hello World');
  });
});
