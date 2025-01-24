import { ALPHANUMERIC_CHARACTERS } from "../constants/alphanumeric-characters";

/**
 * 10進数を62進数に変換する。
 * `number`型の場合は`[0, Number.MAX_SAFE_INTEGER]`の範囲の整数を入力できる。
 * `bigint`型の場合は`0`以上の整数を入力できる。
 * @param decimal 10進数
 * @returns 62進数
 */
export function toDuosexagesimal(decimal: number | bigint) {
  if (typeof decimal === "number") {
    if (!Number.isSafeInteger(decimal) || decimal < 0) {
      throw new TypeError(
        `'decimal = ${decimal}'は'0'以上'${Number.MAX_SAFE_INTEGER}'以下の整数ではありません。`,
      );
    }
    if (decimal === 0) return "0";

    /** 62進数 */
    const duosexagesimal = new Array(
      Math.floor(1 + Math.log(decimal) / Math.log(ALPHANUMERIC_CHARACTERS.length)),
    );

    for (let n = decimal; n > 0; n = Math.floor(n / ALPHANUMERIC_CHARACTERS.length)) {
      duosexagesimal.push(ALPHANUMERIC_CHARACTERS.at(n % ALPHANUMERIC_CHARACTERS.length));
    }

    return duosexagesimal.reverse().join("");
  } else {
    if (decimal < 0n) {
      throw new TypeError(`'decimal = ${decimal}'は'0'以上の整数ではありません。`);
    }
    if (decimal === 0n) return "0";

    /** 英数字の長さ(長整数) */
    const ALPHANUMERIC_CHARACTERS_LENGTH = BigInt(ALPHANUMERIC_CHARACTERS.length);

    /** 62進数 */
    const duosexagesimal = [];

    for (let n = decimal; n > 0; n = n / ALPHANUMERIC_CHARACTERS_LENGTH) {
      duosexagesimal.push(ALPHANUMERIC_CHARACTERS.at(Number(n % ALPHANUMERIC_CHARACTERS_LENGTH)));
    }

    return duosexagesimal.reverse().join("");
  }
}
