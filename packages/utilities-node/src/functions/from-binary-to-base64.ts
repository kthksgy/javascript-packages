/**
 * バイナリ文字列をBase64文字列に変換する。
 * @param binary バイナリ文字列
 * @returns Base64文字列
 */
export function fromBinaryToBase64(binary: string) {
  return Buffer.from(binary).toString('base64');
}
