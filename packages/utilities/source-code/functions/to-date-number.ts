/**
 * 時、分、秒、ミリ秒、マイクロ秒、ナノ秒を一つの整数に埋め込み、日付番号を生成する。
 * それぞれを十分なビット数のみ切り出し、年が最下位ビットを含むように結合する。
 * 処理は`number`型で行うため、年の上限は`8,796,093,022,207`年(43bit)までとなる。
 * 年が可変長であるため、5ビット未満の日を識別可能なように最上位ビットに`1`を追加している。
 * @param year 年`[0, 8796093022207]`(1~43bit)
 * @param month 月`[1, 12]`(4bit)
 * @param day 日`[1, 31]`(5bit)
 * @returns 日付番号
 *
 * @example
 * ```typescript
 * const year = 2024; // 11111101000 (11bit)
 * const month = 12; // 1100 (4bit)
 * const day = 31; // 11111 (5bit)
 * const dateNumber = toDateNumber(year, month, day);
 * dateNumber.toString(2); // 1 11111 1100 11111101000 (21bit)
 * ```
 */
export function toDateNumber(year: number, month: number, day: number) {
  /** 年のビット数 */
  const n = Math.max(1, Math.ceil(Math.log2(year)));
  return year + month * 2 ** n + day * 2 ** (n + 4) + 1 * 2 ** (n + 9);
}
