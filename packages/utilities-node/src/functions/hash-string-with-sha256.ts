import * as crypto from 'node:crypto';

import { fromBytesToBinaryString } from '@kthksgy/utilities';

import { fromBinaryToBase64 } from './from-binary-to-base64';

/**
 * 文字列をSecure Hash Algorithm 256(SHA-256)でハッシュ化する。
 * @returns Base64文字列
 */
export async function hashStringWithSha256(s: string) {
  return crypto.webcrypto.subtle
    .digest('SHA-256', new TextEncoder().encode(s))
    .then(function (arrayBuffer) {
      return fromBinaryToBase64(fromBytesToBinaryString(arrayBuffer));
    });
}
