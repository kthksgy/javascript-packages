/**
 * 文字列をSecure Hash Algorithm 256でハッシュ化する。
 * @returns 8ビット符号なし整数配列
 */
export async function hashStringWithSha256(s: string) {
  return window.crypto.subtle
    .digest('SHA-256', new TextEncoder().encode(s))
    .then(function (arrayBuffer) {
      return new Uint8Array(arrayBuffer);
    });
}
