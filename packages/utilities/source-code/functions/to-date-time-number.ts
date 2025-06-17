/** 日時番号のモードのビット数 */
export const DATE_TIME_NUMBER_MODE_BIT_COUNT = 4n;
/** 日時番号のモードのビットマスク */
export const DATE_TIME_NUMBER_MODE_BIT_MASK = 0b1111n;

/** 日時番号の年モードのビット */
export const DATE_TIME_NUMBER_YEAR_MODE = 0;
/** 日時番号の月モードのビット */
export const DATE_TIME_NUMBER_MONTH_MODE = 1;
/** 日時番号の日モードのビット */
export const DATE_TIME_NUMBER_DAY_MODE = 2;
/** 日時番号の時モードのビット */
export const DATE_TIME_NUMBER_HOUR_MODE = 3;
/** 日時番号の分モードのビット */
export const DATE_TIME_NUMBER_MINUTE_MODE = 4;
/** 日時番号の秒モードのビット */
export const DATE_TIME_NUMBER_SECOND_MODE = 5;
/** 日時番号のミリ秒モードのビット */
export const DATE_TIME_NUMBER_MILLISECOND_MODE = 6;
/** 日時番号のマイクロ秒モードのビット */
export const DATE_TIME_NUMBER_MICROSECOND_MODE = 7;
/** 日時番号のナノ秒モードのビット */
export const DATE_TIME_NUMBER_NANOSECOND_MODE = 8;
/** 日時番号のピコ秒モードのビット */
export const DATE_TIME_NUMBER_PICOSECOND_MODE = 9;
/** 日時番号のフェムト秒モードのビット */
export const DATE_TIME_NUMBER_FEMTOSECOND_MODE = 10;
/** 日時番号のアト秒モードのビット */
export const DATE_TIME_NUMBER_ATTOSECOND_MODE = 11;
/** 日時番号のゼプト秒モードのビット */
export const DATE_TIME_NUMBER_ZEPTOSECOND_MODE = 12;
/** 日時番号のヨクト秒モードのビット */
export const DATE_TIME_NUMBER_YOCTOSECOND_MODE = 13;
/** 日時番号のロント秒モードのビット */
export const DATE_TIME_NUMBER_RONTOSECOND_MODE = 14;
/** 日時番号のクエクト秒モードのビット */
export const DATE_TIME_NUMBER_QUECTOSECOND_MODE = 15;

/**
 * 年からクエクト秒までを一つの整数に埋め込み、日時番号を生成する。
 * それぞれを十分なビット数のみ切り出し、分解能が高い部分を下位ビットに割り当てるように結合する。
 * 可変長となるため、最下位ビットを含む4ビットに日時の分解能を埋め込む。
 * 最後の引数として`null`を指定すると、分解能の埋め込みを省略する。
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
 * @param _ 予約パラメーター
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
  month?: number | null,
  day?: number | null,
  hour?: number | null,
  minute?: number | null,
  second?: number | null,
  millisecond?: number | null,
  microsecond?: number | null,
  nanosecond?: number | null,
  picosecond?: number | null,
  femtosecond?: number | null,
  attosecond?: number | null,
  zeptosecond?: number | null,
  yoctosecond?: number | null,
  rontosecond?: number | null,
  quectosecond?: number | null,
  _?: null,
) {
  if (year < 0 || !Number.isSafeInteger(year)) {
    throw new TypeError(`'year = ${year}'は'0'以上の整数ではありません。`);
  }

  let n = BigInt(year);

  if (month === undefined) {
    return (n << DATE_TIME_NUMBER_MODE_BIT_COUNT) | BigInt(DATE_TIME_NUMBER_YEAR_MODE);
  } else if (month === null) {
    return n;
  } else if (month < 1 || month > 12 || !Number.isSafeInteger(month)) {
    throw new TypeError(`'month = ${month}'は'1'以上'12'以下の整数ではありません。`);
  }

  n = (n << 4n) | BigInt(month);

  if (day === undefined) {
    return (n << DATE_TIME_NUMBER_MODE_BIT_COUNT) | BigInt(DATE_TIME_NUMBER_MONTH_MODE);
  } else if (day === null) {
    return n;
  } else if (day < 1 || day > 31 || !Number.isSafeInteger(day)) {
    throw new TypeError(`'day = ${day}'は'1'以上'31'以下の整数ではありません。`);
  }

  n = (n << 5n) | BigInt(day);

  if (hour === undefined) {
    return (n << DATE_TIME_NUMBER_MODE_BIT_COUNT) | BigInt(DATE_TIME_NUMBER_DAY_MODE);
  } else if (hour === null) {
    return n;
  } else if (hour < 0 || hour > 23 || !Number.isSafeInteger(hour)) {
    throw new TypeError(`'hour = ${hour}'は'0'以上'23'以下の整数ではありません。`);
  }

  n = (n << 5n) | BigInt(hour);

  if (minute === undefined) {
    return (n << DATE_TIME_NUMBER_MODE_BIT_COUNT) | BigInt(DATE_TIME_NUMBER_HOUR_MODE);
  } else if (minute === null) {
    return n;
  } else if (minute < 0 || minute > 59 || !Number.isSafeInteger(minute)) {
    throw new TypeError(`'minute = ${minute}'は'0'以上'59'以下の整数ではありません。`);
  }

  n = (n << 6n) | BigInt(minute);

  if (second === undefined) {
    return (n << DATE_TIME_NUMBER_MODE_BIT_COUNT) | BigInt(DATE_TIME_NUMBER_MINUTE_MODE);
  } else if (second === null) {
    return n;
  } else if (second < 0 || second > 59 || !Number.isSafeInteger(second)) {
    throw new TypeError(`'second = ${second}'は'0'以上'59'以下の整数ではありません。`);
  }

  n = (n << 6n) | BigInt(second);

  if (millisecond === undefined) {
    return (n << DATE_TIME_NUMBER_MODE_BIT_COUNT) | BigInt(DATE_TIME_NUMBER_SECOND_MODE);
  } else if (millisecond === null) {
    return n;
  } else if (millisecond < 0 || millisecond > 999 || !Number.isSafeInteger(millisecond)) {
    throw new TypeError(`'millisecond = ${millisecond}'は'0'以上'999'以下の整数ではありません。`);
  }

  n = (n << 10n) | BigInt(millisecond);

  if (microsecond === undefined) {
    return (n << DATE_TIME_NUMBER_MODE_BIT_COUNT) | BigInt(DATE_TIME_NUMBER_MILLISECOND_MODE);
  } else if (microsecond === null) {
    return n;
  } else if (microsecond < 0 || microsecond > 999 || !Number.isSafeInteger(microsecond)) {
    throw new TypeError(`'microsecond = ${microsecond}'は'0'以上'999'以下の整数ではありません。`);
  }

  n = (n << 10n) | BigInt(microsecond);

  if (nanosecond === undefined) {
    return (n << DATE_TIME_NUMBER_MODE_BIT_COUNT) | BigInt(DATE_TIME_NUMBER_MICROSECOND_MODE);
  } else if (nanosecond === null) {
    return n;
  } else if (nanosecond < 0 || nanosecond > 999 || !Number.isSafeInteger(nanosecond)) {
    throw new TypeError(`'nanosecond = ${nanosecond}'は'0'以上'999'以下の整数ではありません。`);
  }

  n = (n << 10n) | BigInt(nanosecond);

  if (picosecond === undefined) {
    return (n << DATE_TIME_NUMBER_MODE_BIT_COUNT) | BigInt(DATE_TIME_NUMBER_NANOSECOND_MODE);
  } else if (picosecond === null) {
    return n;
  } else if (picosecond < 0 || picosecond > 999 || !Number.isSafeInteger(picosecond)) {
    throw new TypeError(`'picosecond = ${picosecond}'は'0'以上'999'以下の整数ではありません。`);
  }

  n = (n << 10n) | BigInt(picosecond);

  if (femtosecond === undefined) {
    return (n << DATE_TIME_NUMBER_MODE_BIT_COUNT) | BigInt(DATE_TIME_NUMBER_PICOSECOND_MODE);
  } else if (femtosecond === null) {
    return n;
  } else if (femtosecond < 0 || femtosecond > 999 || !Number.isSafeInteger(femtosecond)) {
    throw new TypeError(`'femtosecond = ${femtosecond}'は'0'以上'999'以下の整数ではありません。`);
  }

  n = (n << 10n) | BigInt(femtosecond);

  if (attosecond === undefined) {
    return (n << DATE_TIME_NUMBER_MODE_BIT_COUNT) | BigInt(DATE_TIME_NUMBER_FEMTOSECOND_MODE);
  } else if (attosecond === null) {
    return n;
  } else if (attosecond < 0 || attosecond > 999 || !Number.isSafeInteger(attosecond)) {
    throw new TypeError(`'attosecond = ${attosecond}'は'0'以上'999'以下の整数ではありません。`);
  }

  n = (n << 10n) | BigInt(attosecond);

  if (zeptosecond === undefined) {
    return (n << DATE_TIME_NUMBER_MODE_BIT_COUNT) | BigInt(DATE_TIME_NUMBER_ATTOSECOND_MODE);
  } else if (zeptosecond === null) {
    return n;
  } else if (zeptosecond < 0 || zeptosecond > 999 || !Number.isSafeInteger(zeptosecond)) {
    throw new TypeError(`'zeptosecond = ${zeptosecond}'は'0'以上'999'以下の整数ではありません。`);
  }

  n = (n << 10n) | BigInt(zeptosecond);

  if (yoctosecond === undefined) {
    return (n << DATE_TIME_NUMBER_MODE_BIT_COUNT) | BigInt(DATE_TIME_NUMBER_ZEPTOSECOND_MODE);
  } else if (yoctosecond === null) {
    return n;
  } else if (yoctosecond < 0 || yoctosecond > 999 || !Number.isSafeInteger(yoctosecond)) {
    throw new TypeError(`'yoctosecond = ${yoctosecond}'は'0'以上'999'以下の整数ではありません。`);
  }

  n = (n << 10n) | BigInt(yoctosecond);

  if (rontosecond === undefined) {
    return (n << DATE_TIME_NUMBER_MODE_BIT_COUNT) | BigInt(DATE_TIME_NUMBER_YOCTOSECOND_MODE);
  } else if (rontosecond === null) {
    return n;
  } else if (rontosecond < 0 || rontosecond > 999 || !Number.isSafeInteger(rontosecond)) {
    throw new TypeError(`'rontosecond = ${rontosecond}'は'0'以上'999'以下の整数ではありません。`);
  }

  n = (n << 10n) | BigInt(rontosecond);

  if (quectosecond === undefined) {
    return (n << DATE_TIME_NUMBER_MODE_BIT_COUNT) | BigInt(DATE_TIME_NUMBER_RONTOSECOND_MODE);
  } else if (quectosecond === null) {
    return n;
  } else if (quectosecond < 0 || quectosecond > 999 || !Number.isSafeInteger(quectosecond)) {
    throw new TypeError(`'quectosecond = ${quectosecond}'は'0'以上'999'以下の整数ではありません。`);
  }

  n = (n << 10n) | BigInt(quectosecond);

  if (_ === null) {
    return n;
  } else {
    return (n << DATE_TIME_NUMBER_MODE_BIT_COUNT) | BigInt(DATE_TIME_NUMBER_QUECTOSECOND_MODE);
  }

  // 分解能ビットが足りないため、これ以上の実装は不可能。
}
