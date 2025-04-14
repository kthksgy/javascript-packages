/**
 * `toTimeNumber`関数で生成された時間番号を時間に変換する。
 * @param timeNumber 時間番号
 * @returns `[hour, minute, second, millisecond, microsecond, nanosecond]`
 *
 * @example
 * ```typescript
 * const timeNumber = 0b1111100111_1111100111_1111100111_111011_111011_10111; // 47bit
 * const [hour, minute, second, millisecond, microsecond, nanosecond] = fromTimeNumber(timeNumber);
 * hour.toString(2); // 10111 = 23 (5bit)
 * minute.toString(2); // 111011 = 59 (6bit)
 * second.toString(2); // 111011 = 59 (6bit)
 * millisecond.toString(2); // 1111100111 = 999 (10bit)
 * microsecond.toString(2); // 1111100111 = 999 (10bit)
 * nanosecond.toString(2); // 1111100111 = 999 (10bit)
 * ```
 */
export function fromTimeNumber(
  timeNumber: number | bigint,
): [
  hour: number,
  minute: number,
  second: number,
  millisecond: number,
  microsecond: number,
  nanosecond: number,
] {
  timeNumber = BigInt(timeNumber);
  const hour = Number(timeNumber & 0b11111n);
  const minute = Number((timeNumber >> 5n) & 0b111111n);
  const second = Number((timeNumber >> 11n) & 0b111111n);
  const millisecond = Number((timeNumber >> 17n) & 0b1111111111n);
  const microsecond = Number((timeNumber >> 27n) & 0b1111111111n);
  const nanosecond = Number((timeNumber >> 37n) & 0b1111111111n);
  return [hour, minute, second, millisecond, microsecond, nanosecond];
}
