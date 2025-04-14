import { Temporal } from "temporal-polyfill";

import { Timestamp } from "../reexports";

export function fromDateTimeToTimestamp(dateTime: Temporal.ZonedDateTime) {
  return new Timestamp(
    dateTime.epochMilliseconds / 1_000,
    dateTime.millisecond * 1_000_000 + dateTime.microsecond * 1_000 + dateTime.nanosecond,
  );
}
