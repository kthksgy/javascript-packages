/**
 * 時、分、秒、ミリ秒、マイクロ秒、ナノ秒を一つの整数に埋め込み、時間番号を生成する。
 * それぞれを十分なビット数のみ切り出し、時が最下位ビットを含むように結合する。
 * @param hour 時`[0, 23]`(5bit)
 * @param minute 分`[0, 59]`(6bit)
 * @param second 秒`[0, 59]`(6bit)
 * @param millisecond ミリ秒`[0, 999]`(10bit)
 * @param microsecond マイクロ秒`[0, 999]`(10bit)
 * @param nanosecond ナノ秒`[0, 999]`(10bit)
 * @returns 時間番号
 *
 * @example
 * ```typescript
 * const hour = 23; // 10111 (5bit)
 * const minute = 59; // 111011 (6bit)
 * const second = 59; // 111011 (6bit)
 * const millisecond = 999; // 1111100111 (10bit)
 * const microsecond = 999; // 1111100111 (10bit)
 * const nanosecond = 999; // 1111100111 (10bit)
 * const timeNumber = toTimeNumber(hour, minute, second, millisecond, microsecond, nanosecond);
 * timeNumber.toString(2); // 1111100111 1111100111 1111100111 111011 111011 10111 (47bit)
 * ```
 */
export function toTimeNumber(
  hour: number,
  minute: number,
  second: number,
  millisecond: number,
  microsecond: number,
  nanosecond: number,
) {
  return (
    hour +
    minute * 2 ** 5 +
    second * 2 ** 11 +
    millisecond * 2 ** 17 +
    microsecond * 2 ** 27 +
    nanosecond * 2 ** 37
  );
}
