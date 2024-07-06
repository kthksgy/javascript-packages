import { ALPHANUMERIC_CHARACTERS } from '../constants/alphanumeric-characters';

/**
 * 10進数を62進数に変換する。
 * @param decimal 10進数
 * @returns 62進数
 */
export function toDuosexagesimal(decimal: number) {
  if (decimal === 0) {
    return '0';
  } else if (Number.isSafeInteger(decimal) && decimal > 0) {
    /** 62進数 */
    const duosexagesimal = new Array(
      Math.floor(1 + Math.log(decimal) / Math.log(ALPHANUMERIC_CHARACTERS.length)),
    );

    for (let n = decimal; n > 0; n = Math.floor(n / ALPHANUMERIC_CHARACTERS.length)) {
      duosexagesimal.push(ALPHANUMERIC_CHARACTERS.at(n % ALPHANUMERIC_CHARACTERS.length));
    }

    return duosexagesimal.reverse().join('');
  } else {
    throw new TypeError('0以上の整数を指定してください。');
  }
}
