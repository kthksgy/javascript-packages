/**
 * 年からナノ秒までを一つの整数に埋め込み、日時番号を生成する。
 * それぞれを十分なビット数のみ切り出し、時が最下位ビットを含むように結合する。
 * @param year 年`[0, ]`(1bit以上)
 * @param month 月`[1, 12]`(4bit)
 * @param day 日`[1, 31]`(5bit)
 * @param hour 時`[0, 23]`(5bit)
 * @param minute 分`[0, 59]`(6bit)
 * @param second 秒`[0, 59]`(6bit)
 * @param millisecond ミリ秒`[0, 999]`(10bit)
 * @param microsecond マイクロ秒`[0, 999]`(10bit)
 * @param nanosecond ナノ秒`[0, 999]`(10bit)
 * @param linear 日時の順序が日時番号の順序と同じである場合、`true`を指定する。
 * @returns 日時番号
 *
 * @example
 * ```typescript
 * const year = 2024; // 11111101000 (11bit)
 * const month = 12; // 1100 (4bit)
 * const day = 31; // 11111 (5bit)
 * const hour = 23; // 10111 (5bit)
 * const minute = 59; // 111011 (6bit)
 * const second = 59; // 111011 (6bit)
 * const millisecond = 999; // 1111100111 (10bit)
 * const microsecond = 999; // 1111100111 (10bit)
 * const nanosecond = 999; // 1111100111 (10bit)
 * ```
 *
 * @example
 * ```typescript
 * const dateTimeNumber = toDateTimeNumber(
 *   year, month, day,
 *   hour, minute, second, millisecond, microsecond, nanosecond,
 *   true,
 * );
 * dateTimeNumber.toString(2);
 * // 11111101000 1100 11111 10111 111011 111011 1111100111 1111100111 1111100111 (67bit)
 * ```
 *
 * @example
 * ```typescript
 * const dateTimeNumber = toDateTimeNumber(
 *   year, month, day,
 *   hour, minute, second, millisecond, microsecond, nanosecond,
 *   false,
 * );
 * dateTimeNumber.toString(2);
 * // 1111100111 1111100111 1111100111 111011 111011 10111 11111 1100 11111101000 (67bit)
 * ```
 */
export function toDateTimeNumber(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  millisecond: number,
  microsecond: number,
  nanosecond: number,
  linear: boolean,
) {
  if (year < 0 || !Number.isSafeInteger(year)) {
    throw new TypeError(`'year = ${year}'は'0'以上の整数ではありません。`);
  }
  if (month < 1 || month > 12 || !Number.isSafeInteger(month)) {
    throw new TypeError(`'month = ${month}'は'1'以上'12'以下の整数ではありません。`);
  }
  if (day < 1 || day > 31 || !Number.isSafeInteger(day)) {
    throw new TypeError(`'day = ${day}'は'1'以上'31'以下の整数ではありません。`);
  }
  if (hour < 0 || hour > 23 || !Number.isSafeInteger(hour)) {
    throw new TypeError(`'hour = ${hour}'は'0'以上'23'以下の整数ではありません。`);
  }
  if (minute < 0 || minute > 59 || !Number.isSafeInteger(minute)) {
    throw new TypeError(`'minute = ${minute}'は'0'以上'59'以下の整数ではありません。`);
  }
  if (second < 0 || second > 59 || !Number.isSafeInteger(second)) {
    throw new TypeError(`'second = ${second}'は'0'以上'59'以下の整数ではありません。`);
  }
  if (millisecond < 0 || millisecond > 999 || !Number.isSafeInteger(millisecond)) {
    throw new TypeError(`'millisecond = ${millisecond}'は'0'以上'999'以下の整数ではありません。`);
  }
  if (microsecond < 0 || microsecond > 999 || !Number.isSafeInteger(microsecond)) {
    throw new TypeError(`'microsecond = ${microsecond}'は'0'以上'999'以下の整数ではありません。`);
  }
  if (nanosecond < 0 || nanosecond > 999 || !Number.isSafeInteger(nanosecond)) {
    throw new TypeError(`'nanosecond = ${nanosecond}'は'0'以上'999'以下の整数ではありません。`);
  }

  year = year + 0;
  month = month + 0;
  day = day + 0;
  hour = hour + 0;
  minute = minute + 0;
  second = second + 0;
  millisecond = millisecond + 0;
  microsecond = microsecond + 0;
  nanosecond = nanosecond + 0;

  if (linear) {
    return (
      BigInt(
        nanosecond +
          microsecond * 2 ** 10 +
          millisecond * 2 ** 20 +
          second * 2 ** 30 +
          minute * 2 ** 36 +
          hour * 2 ** 42 +
          day * 2 ** 47,
      ) |
      (BigInt(month) << 52n) |
      (BigInt(year) << 56n)
    );
  } else {
    /** 年のビット数 */
    const n = BigInt(Math.max(1, Math.ceil(Math.log2(year))));

    return (
      BigInt(year) |
      (BigInt(
        month +
          day * 2 ** 4 +
          hour * 2 ** 9 +
          minute * 2 ** 14 +
          second * 2 ** 20 +
          millisecond * 2 ** 26 +
          microsecond * 2 ** 36,
      ) <<
        n) |
      (BigInt(nanosecond) << (n + 46n))
    );
  }
}
