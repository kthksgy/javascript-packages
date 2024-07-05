/**
 * バイト列をバイナリ文字列に変換する。
 * @param bytes バイト列
 * @returns バイナリ文字列
 */
export function fromBytesToBinaryString(bytes: ArrayBuffer | Uint8Array) {
  return String.fromCharCode(...(bytes instanceof ArrayBuffer ? new Uint8Array(bytes) : bytes));
}
