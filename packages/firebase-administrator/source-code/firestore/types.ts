import type {
  GetCollectionGroupPath,
  GetCollectionPath,
  PropertyPathDotNotation,
  PropertyPathSegmentTuple,
} from "@kthksgy/firebase-common/firestore";
import type {
  DocumentData,
  DocumentReference,
  ReadOnlyTransactionOptions,
  ReadWriteTransactionOptions,
  Transaction,
  UpdateData,
  WriteBatch,
} from "firebase-admin/firestore";

export type {
  GetCollectionGroupPath,
  GetCollectionPath,
  PropertyPathDotNotation,
  PropertyPathSegmentTuple,
};

export type GenericTransaction = Omit<Transaction, "create" | "getAll"> &
  Partial<Pick<Transaction, "create" | "getAll">>;

export type GenericWriteBatch = Omit<WriteBatch, "create"> & Partial<Pick<WriteBatch, "create">>;

/**
 * TransactionやWriteBatchなどの`update()`メソッドを持つオブジェクト
 */
export type UpdateFunctionContainer = {
  update: {
    <T1, T2 extends DocumentData>(
      reference: DocumentReference<T1, T2>,
      data: UpdateData<T2>,
    ): unknown;
  };
};

/**
 * TransactionやWriteBatchなどの`set()`メソッドを持つオブジェクト
 */
export type SetFunctionContainer = {
  set: {
    <T1, T2 extends DocumentData>(
      reference: DocumentReference<T1, T2>,
      data: UpdateData<T2>,
      options?: { merge?: boolean },
    ): unknown;
  };
};

export type TransactionOptions = ReadOnlyTransactionOptions | ReadWriteTransactionOptions;
