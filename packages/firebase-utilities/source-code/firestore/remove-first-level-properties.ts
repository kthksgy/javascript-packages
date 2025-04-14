import { isPlainObject } from "@kthksgy/utilities";

/**
 * 第一階層のプロパティを削除する。
 * @param input 対象のオブジェクト
 * @param keys キー
 * @returns 新しいオブジェクト
 */
export function removeFirstLevelProperties(input: any, ...keys: ReadonlyArray<string>) {
  if (!isPlainObject(input)) {
    throw new Error("削除不可能なデータが入力されました。"); // TODO: 適切なエラーに変更する。
  }
  const output = { ...input };
  for (const property of keys) {
    delete output[property];
  }
  return output;
}
