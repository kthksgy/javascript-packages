/**
 * Base64文字列をURL安全な状態に変換する。
 * @param base64String Base64文字列
 * @returns URL安全なBase64文字列
 */
export function makeBase64StringUrlSafe(base64String: string) {
  return base64String.replaceAll("=", "").replaceAll("+", "-").replaceAll("/", "_");
}
