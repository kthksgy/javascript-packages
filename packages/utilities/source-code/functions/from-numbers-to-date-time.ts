import { Temporal } from "temporal-polyfill";

/**
 * 数値の配列を日時に変換する。
 * @param numbers 数値の配列
 * @param strict `true`の場合は完全な変換が不可能な時にエラーを投げる。
 * @returns 日時
 */
export function fromNumbersToDateTime(
  numbers:
    | readonly [year: number]
    | readonly [year: number, month: number]
    | readonly [year: number, month: number, day: number]
    | readonly [year: number, month: number, day: number, hour: number]
    | readonly [year: number, month: number, day: number, hour: number, minute: number]
    | readonly [
        year: number,
        month: number,
        day: number,
        hour: number,
        minute: number,
        second: number,
      ]
    | readonly [
        year: number,
        month: number,
        day: number,
        hour: number,
        minute: number,
        second: number,
        millisecond: number,
      ]
    | readonly [
        year: number,
        month: number,
        day: number,
        hour: number,
        minute: number,
        second: number,
        millisecond: number,
        microsecond: number,
      ]
    | readonly [
        year: number,
        month: number,
        day: number,
        hour: number,
        minute: number,
        second: number,
        millisecond: number,
        microsecond: number,
        nanosecond: number,
      ]
    | readonly [
        year: number,
        month: number,
        day: number,
        hour: number,
        minute: number,
        second: number,
        millisecond: number,
        microsecond: number,
        nanosecond: number,
        picosecond: number,
      ]
    | readonly [
        year: number,
        month: number,
        day: number,
        hour: number,
        minute: number,
        second: number,
        millisecond: number,
        microsecond: number,
        nanosecond: number,
        picosecond: number,
        femtosecond: number,
      ]
    | readonly [
        year: number,
        month: number,
        day: number,
        hour: number,
        minute: number,
        second: number,
        millisecond: number,
        microsecond: number,
        nanosecond: number,
        picosecond: number,
        femtosecond: number,
        attosecond: number,
      ]
    | readonly [
        year: number,
        month: number,
        day: number,
        hour: number,
        minute: number,
        second: number,
        millisecond: number,
        microsecond: number,
        nanosecond: number,
        picosecond: number,
        femtosecond: number,
        attosecond: number,
        zeptosecond: number,
      ]
    | readonly [
        year: number,
        month: number,
        day: number,
        hour: number,
        minute: number,
        second: number,
        millisecond: number,
        microsecond: number,
        nanosecond: number,
        picosecond: number,
        femtosecond: number,
        attosecond: number,
        zeptosecond: number,
        yoctosecond: number,
      ]
    | readonly [
        year: number,
        month: number,
        day: number,
        hour: number,
        minute: number,
        second: number,
        millisecond: number,
        microsecond: number,
        nanosecond: number,
        picosecond: number,
        femtosecond: number,
        attosecond: number,
        zeptosecond: number,
        yoctosecond: number,
        rontosecond: number,
      ]
    | readonly [
        year: number,
        month: number,
        day: number,
        hour: number,
        minute: number,
        second: number,
        millisecond: number,
        microsecond: number,
        nanosecond: number,
        picosecond: number,
        femtosecond: number,
        attosecond: number,
        zeptosecond: number,
        yoctosecond: number,
        rontosecond: number,
        quectosecond: number,
      ],
  strict = true,
) {
  const [
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond,
    ...parameters
  ] = numbers;

  if (strict && parameters.length > 0) {
    throw new TypeError(`『${JSON.stringify(numbers)}』を日時に損失無く変換出来ません。`);
  } else {
    return new Temporal.PlainDateTime(
      year,
      month ?? 1,
      day ?? 1,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
    );
  }
}
