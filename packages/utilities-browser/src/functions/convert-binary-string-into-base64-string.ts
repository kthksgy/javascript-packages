/**
 * `window.btoa()`と同等の処理を行う。バイナリ文字列をBase64文字列に変換する。
 * @param binaryString バイナリ文字列(Latin-1(ISO/IEC 8859-1)文字列)
 * @returns Base64文字列
 */
export function convertBinaryStringIntoBase64String(binaryString: string) {
  return window.btoa(binaryString);
}
