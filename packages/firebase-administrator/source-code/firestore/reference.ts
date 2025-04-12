import { CollectionReference, DocumentReference, Firestore } from 'firebase-admin/firestore';

/**
 * コレクショングループリファレンスを生成する。
 * @param firestore Firestoreインスタンス
 * @param path コレクショングループパス
 * @returns コレクショングループリファレンス
 */
export function createCollectionGroupReference(firestore: Firestore, path: string) {
  return firestore.collectionGroup(path);
}

/**
 * コレクションリファレンスを生成する。
 * @param firestore Firestoreインスタンス
 * @param path コレクションパス
 * @returns コレクションリファレンス
 */
export function createCollectionReference(firestore: Firestore, path: string) {
  return firestore.collection(path);
}

/**
 * ドキュメントリファレンスを生成する。
 * @param firestore Firestoreインスタンス
 * @param path ドキュメントパス
 * @returns ドキュメントリファレンス
 */
export function createDocumentReference(firestore: Firestore, path: string): DocumentReference;
/**
 * ドキュメントリファレンスを生成する。
 * @param reference コレクションリファレンス
 * @returns ドキュメントリファレンス
 */
export function createDocumentReference(reference: CollectionReference): DocumentReference;

/**
 * ドキュメントリファレンスを生成する。
 * @param parameters パラメーター
 * @returns ドキュメントリファレンス
 */
export function createDocumentReference(
  ...parameters: [Firestore, string] | [CollectionReference]
) {
  if (parameters.length === 2) {
    return parameters[0].doc(parameters[1]);
  } else {
    return parameters[0].doc();
  }
}
