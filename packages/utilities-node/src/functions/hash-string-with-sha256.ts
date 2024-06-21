import * as crypto from 'node:crypto';

import { convertLatin1StringIntoBase64String } from './convert-latin1-string-into-base64-string';

/**
 * 文字列をSecure Hash Algorithm 256(SHA-256)でハッシュ化する。
 * @returns Base64文字列
 */
export async function hashStringWithSha256(s: string) {
  return crypto.webcrypto.subtle
    .digest('SHA-256', new TextEncoder().encode(s))
    .then(function (arrayBuffer) {
      return convertLatin1StringIntoBase64String(
        String.fromCharCode(...new Uint8Array(arrayBuffer)),
      );
    });
}
