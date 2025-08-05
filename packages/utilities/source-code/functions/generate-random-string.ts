import { ALPHANUMERIC_CHARACTERS } from "../constants";

/**
 * 英字(大文字／小文字)と数字のみを含むランダム文字列を生成する。
 * 厳密なセキュリティを要する場面では使用を避ける。
 * @param length 文字数
 * @returns ランダム文字列
 */
export function generateRandomString(length: number) {
  let s = "";
  for (let i = 0; i < length; i++) {
    s += ALPHANUMERIC_CHARACTERS[Math.floor(Math.random() * ALPHANUMERIC_CHARACTERS.length)];
  }
  return s;
}
