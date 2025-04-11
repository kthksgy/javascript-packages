/** ドキュメントパスからコレクショングループパスを取得する。 */
export type GetCollectionGroupPath<T extends string> = T extends `${infer L}/${infer R}`
  ? R extends `${string}/${string}`
    ? GetCollectionGroupPath<R>
    : L
  : T;
/** ドキュメントパスからコレクションパスを取得する。 */
export type GetCollectionPath<T extends string> = T extends `${infer L}/${infer R}`
  ? R extends `${string}/${string}`
    ? `${L}/${GetCollectionPath<R>}`
    : L
  : T;

/**
 * ドキュメントパスからコレクショングループパスを取得する。
 * @param documentPath ドキュメントパス
 * @returns コレクショングループパス
 */
export function getCollectionGroupPath<T extends string>(
  documentPath: T,
): GetCollectionGroupPath<T> {
  return (documentPath.match(/([^/]+)\/[^/]*$/)?.at(1) ??
    documentPath) as GetCollectionGroupPath<T>;
}

/**
 * ドキュメントパスからコレクションパスを取得する。
 * @param documentPath ドキュメントパス
 * @returns コレクションパス
 */
export function getCollectionPath<T extends string>(documentPath: T): GetCollectionPath<T> {
  return documentPath.replace(/\/[^/]*$/, '') as GetCollectionPath<T>;
}
