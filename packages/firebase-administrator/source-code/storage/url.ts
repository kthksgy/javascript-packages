import { File } from "@google-cloud/storage";
import { getDownloadURL } from "firebase-admin/storage";

/**
 * 認証トークン付きダウンロードURLを生成する。
 *
 * エミュレーターでは`getDownloadURL`関数が正常に動作しないため、内部で処理を分岐している。
 */
export async function generateDownloadUrl(ref: File) {
  if (process.env.FUNCTIONS_EMULATOR === "true") {
    const downloadUrl =
      "http://" +
      process.env.FIREBASE_STORAGE_EMULATOR_HOST +
      "/v0/b/" +
      ref.bucket.name +
      "/o/" +
      encodeURIComponent(ref.name);
    const response = await fetch(downloadUrl + "?create_token=true", {
      headers: { Authorization: "Bearer owner" },
      method: "POST",
    });
    const responseData: { downloadTokens: string } = await response.json();
    const downloadToken = responseData.downloadTokens.split(",")[0];

    return downloadUrl + "?alt=media&token=" + downloadToken;
  } else {
    return getDownloadURL(ref);
  }
}
