/**
 * バイト列をバイナリ文字列に変換する。
 * @param bytes バイト列
 * @returns バイナリ文字列
 */
export function fromBytesToBinaryString(bytes: ArrayBuffer | Uint8Array) {
  /** 8ビット符号無し整数配列 */
  const array = bytes instanceof ArrayBuffer ? new Uint8Array(bytes) : bytes;
  /** チャンクサイズ */
  const chunkSize = 8192;

  /** バイナリ文字列 */
  let binaryString = '';
  for (let i = 0; i < array.length; i += chunkSize) {
    binaryString += String.fromCharCode(...array.slice(i, i + chunkSize));
  }

  return binaryString;
}
