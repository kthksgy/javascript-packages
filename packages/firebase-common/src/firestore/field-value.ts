import { Temporal } from "temporal-polyfill";

/**
 * サーバー日時
 * Firestoreに書き込む時にサーバーの日時を動的に指定する場合に使用する。
 */
export class ServerDateTimeFieldValue extends Temporal.ZonedDateTime {
  constructor() {
    super(Temporal.Now.instant().epochNanoseconds, Temporal.Now.timeZoneId());
  }
}
