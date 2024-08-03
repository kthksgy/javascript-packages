/**
 * `toDateNumber`関数で生成された日付番号を日付に変換する。
 * @param dateNumber 日付番号
 * @returns `[year, month, day]`
 *
 * @example
 * ```typescript
 * const dateNumber = 0b1_11111_1100_11111101000; // 21bit
 * const [year, month, day] = fromDateNumber(dateNumber);
 * year.toString(2); // 11111101000 = 2024 (11bit)
 * month.toString(2); // 1100 = 12 (4bit)
 * day.toString(2); // 11111 = 31 (5bit)
 * ```
 */
export function fromDateNumber(
  dateNumber: number | bigint,
): [year: number, month: number, day: number] {
  const bits = dateNumber.toString(2);
  const day = Number.parseInt(bits.slice(1, 6), 2);
  const month = Number.parseInt(bits.slice(6, 10), 2);
  const year = Number.parseInt(bits.slice(10), 2);
  return [year, month, day];
}
