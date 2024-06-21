/**
 * Latin-1(ISO/IEC 8859-1)文字列をBase64文字列に変換する。
 * @param latin1String Latin-1(ISO/IEC 8859-1)文字列
 * @returns Base64文字列
 */
export function convertLatin1StringIntoBase64String(latin1String: string) {
  return window.btoa(latin1String);
}
