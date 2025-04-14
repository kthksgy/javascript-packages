import { isArray, isPlainObject } from "@kthksgy/utilities";
import { Temporal } from "temporal-polyfill";

import {
  ServerDateTimeFieldValue,
  createDeleteMarkFieldValue,
  createServerTimestampFieldValue,
} from "../reexports";

import { fromDateTimeToTimestamp } from "./from-date-time-to-timestamp";

/**
 * 対応している型のみについて、Firestoreに書き込み可能な形式にデータを変換する。
 * @param input 入力
 * @returns 出力
 */
export function serializeDocumentData(input: any): any {
  if (createDeleteMarkFieldValue().isEqual(input)) {
    return input;
  } else if (input instanceof ServerDateTimeFieldValue) {
    return createServerTimestampFieldValue();
  } else if (input instanceof Temporal.ZonedDateTime) {
    return fromDateTimeToTimestamp(input);
  } else if (isArray(input)) {
    return input.map(function (value) {
      return serializeDocumentData(value);
    });
  } else if (isPlainObject(input)) {
    return Object.entries(input).reduce(function (output, [key, value]) {
      output[key] = serializeDocumentData(value);
      return output;
    }, {} as any);
  } else {
    return input;
  }
}
