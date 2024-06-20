import * as crypto from 'crypto';

/**
 * 暗号強度の強い乱数値を生成する。
 * @param length 生成する乱数値の配列の長さ
 * @returns 乱数値の配列
 */
export function generateRandomValues(length: number) {
  return crypto.getRandomValues(new Uint32Array(length));
}
