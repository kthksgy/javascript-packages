import { File } from "@google-cloud/storage";

/**
 * `firebase/storage`の`uploadBytes`の互換関数
 */
export function uploadBytes(ref: File, data: Buffer) {
  return ref.save(data).then(function () {
    return { metadata: {}, ref };
  });
}
