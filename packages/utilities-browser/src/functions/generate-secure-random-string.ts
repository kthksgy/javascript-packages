import { ALPHANUMERIC_CHARACTERS } from '@kthksgy/utilities';

/** 乱数の最大有効値 */
const MAX_RANDOM_VALUE =
  ALPHANUMERIC_CHARACTERS.length *
    Math.floor(/** 1バイトの最大値 */ 255 / ALPHANUMERIC_CHARACTERS.length) -
  1;

/**
 * 暗号強度の強い乱数生成器を使用して、英字(大文字／小文字)と数字のみを含む乱文字列を生成する。
 * @param length 文字数
 * @returns {string} 乱文字列
 */
export function generateSecureRandomString(length: number): string {
  /** 文字列 */
  let s = '';
  while (s.length < length) {
    /** 乱数値 */
    const randomValues = window.crypto.getRandomValues(new Uint8Array(length * 2));
    for (const randomValue of randomValues) {
      if (randomValue > MAX_RANDOM_VALUE) {
        continue;
      }
      s += ALPHANUMERIC_CHARACTERS.charAt(randomValue % ALPHANUMERIC_CHARACTERS.length);
      if (s.length >= length) {
        break;
      }
    }
  }
  return s;
}
