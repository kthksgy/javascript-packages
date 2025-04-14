import { Temporal } from "temporal-polyfill";

export const JAPAN_TIME_ZONE = "Asia/Tokyo";

export function formatDateTime(
  dateTime:
    | Temporal.Instant
    | Temporal.PlainDate
    | Temporal.PlainMonthDay
    | Temporal.PlainTime
    | Temporal.PlainYearMonth
    | Temporal.ZonedDateTime,
  format: string,
) {
  if (dateTime instanceof Temporal.Instant) {
    dateTime = dateTime.toZonedDateTimeISO(Temporal.Now.timeZoneId());
  } else if (dateTime instanceof Temporal.PlainMonthDay) {
    dateTime = dateTime.toPlainDate(Temporal.Now.plainDateISO());
  } else if (dateTime instanceof Temporal.PlainYearMonth) {
    dateTime = dateTime.toPlainDate(Temporal.Now.plainDateISO());
  }
  let result = format;
  if (dateTime instanceof Temporal.PlainDate || dateTime instanceof Temporal.ZonedDateTime) {
    const year = dateTime.year;
    result = result.replaceAll(/(?<!\\)y/g, year.toString());

    const month = dateTime.month;
    result = result.replaceAll(/(?<!\\)M(?<!\\)M/g, month.toString().padStart(2, "0"));
    result = result.replaceAll(/(?<!\\)M/g, month.toString());

    const day = dateTime.day;
    result = result.replaceAll(/(?<!\\)d(?<!\\)d/g, day.toString().padStart(2, "0"));
    result = result.replaceAll(/(?<!\\)d/g, day.toString());
  }
  if (dateTime instanceof Temporal.PlainTime || dateTime instanceof Temporal.ZonedDateTime) {
    const hour = dateTime.hour;
    result = result.replaceAll(/(?<!\\)H(?<!\\)H/g, hour.toString().padStart(2, "0"));

    const minute = dateTime.minute;
    result = result.replaceAll(/(?<!\\)m(?<!\\)m/g, minute.toString().padStart(2, "0"));

    const second = dateTime.second;
    result = result.replaceAll(/(?<!\\)s(?<!\\)s/g, second.toString().padStart(2, "0"));
  }

  return result;
}

export function getCurrentLocalDate() {
  return Temporal.Now.plainDateISO();
}

export function getCurrentLocalDateTime() {
  return Temporal.Now.zonedDateTimeISO();
}

export function getCurrentLocalMonthDay() {
  return Temporal.Now.plainDateISO().toPlainMonthDay();
}

export function getCurrentLocalTime() {
  return Temporal.Now.plainTimeISO();
}

export function getCurrentLocalYearMonth() {
  return Temporal.Now.plainDateISO().toPlainYearMonth();
}

export function getCurrentJapanDate() {
  return Temporal.Now.plainDateISO(JAPAN_TIME_ZONE);
}

/**
 * 日本の日時
 * 日時のタイムゾーンが'Asia/Tokyo'である事を保証する。
 */
export class JapanDateTime extends Temporal.ZonedDateTime {
  constructor(dateTime: bigint | Date | Temporal.Instant | Temporal.ZonedDateTime) {
    super(
      typeof dateTime === "bigint"
        ? dateTime
        : dateTime instanceof Date
          ? BigInt(dateTime.getTime()) * 1_000_000n
          : dateTime.epochNanoseconds,
      JAPAN_TIME_ZONE,
    );
  }
}

export function getCurrentJapanDateTime() {
  return new JapanDateTime(Temporal.Now.instant());
}

export function getCurrentJapanMonthDay() {
  return Temporal.Now.plainDateISO(JAPAN_TIME_ZONE).toPlainMonthDay();
}

export function getCurrentJapanTime() {
  return Temporal.Now.plainTimeISO(JAPAN_TIME_ZONE);
}

export function getCurrentJapanYearMonth() {
  return Temporal.Now.plainDateISO(JAPAN_TIME_ZONE).toPlainYearMonth();
}

export function isSameYearMonth(a: Temporal.PlainYearMonth, b: Temporal.PlainYearMonth) {
  return a.year === b.year && a.month === b.month;
}
