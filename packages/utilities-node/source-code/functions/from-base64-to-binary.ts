/**
 * Base64文字列をバイナリ文字列に変換する。
 * @param base64 Base64文字列
 * @returns バイナリ文字列
 */
export function fromBase64ToBinary(base64: string) {
  return Buffer.from(base64, "base64").toString("latin1");
}
