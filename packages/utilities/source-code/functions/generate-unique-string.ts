import { Temporal } from "temporal-polyfill";

import { generateRandomString } from "./generate-random-string";
import { toDateNumber } from "./to-date-number";
import { toDuosexagesimal } from "./to-duosexagesimal";
import { toTimeNumber } from "./to-time-number";

/**
 * 確率的にユニークな全ての文字が英数字からなる文字列を生成する。
 * 衝突を極力避けるため、ランダム文字列と現在の日時(協定世界時)の62進数を組み合わせて生成している。
 *
 * ```
 * {ランダム文字列(`randomStringLength`文字)}{時間(8文字)}{日付(2文字以上)}
 * ```
 *
 * 日付部分は年の値によって長さが変わる。
 * 例として、3年未満は2文字、129年未満は3文字、8193年未満は4文字、
 * 524289年未満は5文字、33554433年未満は6文字となる。
 *
 * 先頭はランダム文字列であるため、シャーディングするデータベースのキーとしても使用出来る。
 * @param randomStringLength ランダム文字列の長さ
 * @returns ユニーク文字列(`randomStringLength` + `8` + `2~`文字)
 */
export function generateUniqueString(randomStringLength = 14) {
  /** 現在の日時(協定世界時) */
  const now = Temporal.Now.zonedDateTimeISO("UTC");
  return (
    generateRandomString(randomStringLength) +
    toDuosexagesimal(
      toTimeNumber(
        now.hour,
        now.minute,
        now.second,
        now.millisecond,
        now.microsecond,
        now.nanosecond,
      ),
    ).padStart(8, "0") +
    toDuosexagesimal(toDateNumber(now.year, now.month, now.day))
  );
}
