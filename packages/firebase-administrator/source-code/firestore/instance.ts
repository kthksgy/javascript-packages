import {
  FieldValue,
  type ReadOnlyTransactionOptions,
  type ReadWriteTransactionOptions,
} from "firebase-admin/firestore";

export type TransactionOptions = ReadOnlyTransactionOptions | ReadWriteTransactionOptions;

/** @returns フィールドを削除する`FieldValue`センチネル。 */
export const createDeleteMarkFieldValue = FieldValue.delete;
/** @returns フィールドにサーバー生成時間を設定する`FieldValue`センチネル。 */
export const createServerTimestampFieldValue = FieldValue.serverTimestamp;
