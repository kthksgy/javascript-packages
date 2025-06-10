/**
 * 年からクエクト秒までを一つの整数に埋め込み、日時番号を生成する。
 * それぞれを十分なビット数のみ切り出し、分解能が高い部分を下位ビットに割り当てるように結合する。
 * 可変長となるため、最下位ビットを含む4ビットに日時の分解能を埋め込む。
 * @param year 年`[0, ]`(1bit以上)
 * @param month 月`[1, 12]`(4bit)
 * @param day 日`[1, 31]`(5bit)
 * @param hour 時`[0, 23]`(5bit)
 * @param minute 分`[0, 59]`(6bit)
 * @param second 秒`[0, 59]`(6bit)
 * @param millisecond ミリ秒`[0, 999]`(10bit)
 * @param microsecond マイクロ秒`[0, 999]`(10bit)
 * @param nanosecond ナノ秒`[0, 999]`(10bit)
 * @param picosecond ピコ秒`[0, 999]`(10bit)
 * @param femtosecond フェムト秒`[0, 999]`(10bit)
 * @param attosecond アト秒`[0, 999]`(10bit)
 * @param zeptosecond ゼプト秒`[0, 999]`(10bit)
 * @param yoctosecond ヨクト秒`[0, 999]`(10bit)
 * @param rontosecond ロント秒`[0, 999]`(10bit)
 * @param quectosecond クエクト秒`[0, 999]`(10bit)
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
 * );
 * dateTimeNumber.toString(2);
 * // 11111101000 1100 11111 10111 111011 111011 1111100111 1111100111 1111100111 (67bit)
 * ```
 */
export function toDateTimeNumber(
  year: number,
  month?: number,
  day?: number,
  hour?: number,
  minute?: number,
  second?: number,
  millisecond?: number,
  microsecond?: number,
  nanosecond?: number,
  picosecond?: number,
  femtosecond?: number,
  attosecond?: number,
  zeptosecond?: number,
  yoctosecond?: number,
  rontosecond?: number,
  quectosecond?: number,
) {
  if (year < 0 || !Number.isSafeInteger(year)) {
    throw new TypeError(`'year = ${year}'は'0'以上の整数ではありません。`);
  }

  let n = BigInt(year);

  if (month === undefined) {
    return (n << 4n) | 0n; // 年モード(`0`)の値を返す。
  }

  if (month < 1 || month > 12 || !Number.isSafeInteger(month)) {
    throw new TypeError(`'month = ${month}'は'1'以上'12'以下の整数ではありません。`);
  }

  n = (n << 4n) | BigInt(month);

  if (day === undefined) {
    return (n << 4n) | 1n; // 月モード(`1`)の値を返す。
  }

  if (day < 1 || day > 31 || !Number.isSafeInteger(day)) {
    throw new TypeError(`'day = ${day}'は'1'以上'31'以下の整数ではありません。`);
  }

  n = (n << 5n) | BigInt(day);

  if (hour === undefined) {
    return (n << 4n) | 2n; // 日モード(`2`)の値を返す。
  }

  if (hour < 0 || hour > 23 || !Number.isSafeInteger(hour)) {
    throw new TypeError(`'hour = ${hour}'は'0'以上'23'以下の整数ではありません。`);
  }

  n = (n << 5n) | BigInt(hour);

  if (minute === undefined) {
    return (n << 4n) | 3n; // 時モード(`3`)の値を返す。
  }

  if (minute < 0 || minute > 59 || !Number.isSafeInteger(minute)) {
    throw new TypeError(`'minute = ${minute}'は'0'以上'59'以下の整数ではありません。`);
  }

  n = (n << 6n) | BigInt(minute);

  if (second === undefined) {
    return (n << 4n) | 4n; // 分モード(`4`)の値を返す。
  }

  if (second < 0 || second > 59 || !Number.isSafeInteger(second)) {
    throw new TypeError(`'second = ${second}'は'0'以上'59'以下の整数ではありません。`);
  }

  n = (n << 6n) | BigInt(second);

  if (millisecond === undefined) {
    return (n << 4n) | 5n; // 秒モード(`5`)の値を返す。
  }

  if (millisecond < 0 || millisecond > 999 || !Number.isSafeInteger(millisecond)) {
    throw new TypeError(`'millisecond = ${millisecond}'は'0'以上'999'以下の整数ではありません。`);
  }

  n = (n << 10n) | BigInt(millisecond);

  if (microsecond === undefined) {
    return (n << 4n) | 6n; // ミリ秒モード(`6`)の値を返す。
  }

  if (microsecond < 0 || microsecond > 999 || !Number.isSafeInteger(microsecond)) {
    throw new TypeError(`'microsecond = ${microsecond}'は'0'以上'999'以下の整数ではありません。`);
  }

  n = (n << 10n) | BigInt(microsecond);

  if (nanosecond === undefined) {
    return (n << 4n) | 7n; // マイクロ秒モード(`7`)の値を返す。
  }

  if (nanosecond < 0 || nanosecond > 999 || !Number.isSafeInteger(nanosecond)) {
    throw new TypeError(`'nanosecond = ${nanosecond}'は'0'以上'999'以下の整数ではありません。`);
  }

  n = (n << 10n) | BigInt(nanosecond);

  if (picosecond === undefined) {
    return (n << 4n) | 8n; // ナノ秒モード(`8`)の値を返す。
  }

  if (picosecond < 0 || picosecond > 999 || !Number.isSafeInteger(picosecond)) {
    throw new TypeError(`'picosecond = ${picosecond}'は'0'以上'999'以下の整数ではありません。`);
  }

  n = (n << 10n) | BigInt(picosecond);

  if (femtosecond === undefined) {
    return (n << 4n) | 9n; // ピコ秒モード(`9`)の値を返す。
  }

  if (femtosecond < 0 || femtosecond > 999 || !Number.isSafeInteger(femtosecond)) {
    throw new TypeError(`'femtosecond = ${femtosecond}'は'0'以上'999'以下の整数ではありません。`);
  }

  n = (n << 10n) | BigInt(femtosecond);

  if (attosecond === undefined) {
    return (n << 4n) | 10n; // フェムト秒モード(`10`)の値を返す。
  }

  if (attosecond < 0 || attosecond > 999 || !Number.isSafeInteger(attosecond)) {
    throw new TypeError(`'attosecond = ${attosecond}'は'0'以上'999'以下の整数ではありません。`);
  }

  n = (n << 10n) | BigInt(attosecond);

  if (zeptosecond === undefined) {
    return (n << 4n) | 11n; // アト秒モード(`11`)の値を返す。
  }

  if (zeptosecond < 0 || zeptosecond > 999 || !Number.isSafeInteger(zeptosecond)) {
    throw new TypeError(`'zeptosecond = ${zeptosecond}'は'0'以上'999'以下の整数ではありません。`);
  }

  n = (n << 10n) | BigInt(zeptosecond);

  if (yoctosecond === undefined) {
    return (n << 4n) | 12n; // ゼプト秒モード(`12`)の値を返す。
  }

  if (yoctosecond < 0 || yoctosecond > 999 || !Number.isSafeInteger(yoctosecond)) {
    throw new TypeError(`'yoctosecond = ${yoctosecond}'は'0'以上'999'以下の整数ではありません。`);
  }

  n = (n << 10n) | BigInt(yoctosecond);

  if (rontosecond === undefined) {
    return (n << 4n) | 13n; // ヨクト秒モード(`13`)の値を返す。
  }

  if (rontosecond < 0 || rontosecond > 999 || !Number.isSafeInteger(rontosecond)) {
    throw new TypeError(`'rontosecond = ${rontosecond}'は'0'以上'999'以下の整数ではありません。`);
  }

  n = (n << 10n) | BigInt(rontosecond);

  if (quectosecond === undefined) {
    return (n << 4n) | 14n; // ロント秒モード(`14`)の値を返す。
  }

  if (quectosecond < 0 || quectosecond > 999 || !Number.isSafeInteger(quectosecond)) {
    throw new TypeError(`'quectosecond = ${quectosecond}'は'0'以上'999'以下の整数ではありません。`);
  }

  n = (n << 10n) | BigInt(quectosecond);

  return (n << 4n) | 15n; // クエクト秒モード(`15`)の値を返す。

  // 分解能ビットが足りないため、これ以上の実装は不可能。
}
