import { fromBytesToBinaryString } from '@kthksgy/utilities';

import { fromBinaryToBase64 } from './from-binary-to-base64';

/**
 * Secure Hash Algorithm 256(SHA-256)ハッシュ値を計算する。
 * @param value ハッシュ値を計算する値
 * @returns ハッシュ値(Base64文字列)
 */
export async function computeSha256Hash(value: string | Uint8Array) {
  if (typeof value === 'string') {
    value = new TextEncoder().encode(value);
  }

  return window.crypto.subtle.digest('SHA-256', value).then(function (arrayBuffer) {
    return fromBinaryToBase64(fromBytesToBinaryString(arrayBuffer));
  });
}
