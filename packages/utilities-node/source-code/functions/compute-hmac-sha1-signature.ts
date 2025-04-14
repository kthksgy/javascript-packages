import * as crypto from "node:crypto";

import { fromBytesToBinaryString } from "@kthksgy/utilities";

import { fromBinaryToBase64 } from "./from-binary-to-base64";

/**
 * HMAC-SHA1署名を計算する。
 * @param key 署名に用いるキー(`format = 'raw'`として入力される)
 * @param value 署名する値
 * @returns 署名
 */
export async function computeHmacSha1Signature(
  key: string | Uint8Array,
  value: string | Uint8Array,
) {
  const textEncoder = new TextEncoder();

  if (typeof key === "string") {
    key = textEncoder.encode(key);
  }

  if (typeof value === "string") {
    value = textEncoder.encode(value);
  }

  return crypto.webcrypto.subtle
    .importKey("raw", key, { name: "HMAC", hash: "SHA-1" }, false, ["sign", "verify"])
    .then((key) => crypto.webcrypto.subtle.sign("HMAC", key, value))
    .then((signature) => fromBinaryToBase64(fromBytesToBinaryString(signature)));
}
