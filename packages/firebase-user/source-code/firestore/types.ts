import type {
  GetCollectionGroupPath,
  GetCollectionPath,
  PropertyPathDotNotation,
  PropertyPathSegmentTuple,
} from '../shared-files';
import type {
  DocumentData,
  DocumentReference,
  Transaction,
  TransactionOptions,
  UpdateData,
  WriteBatch,
} from 'firebase/firestore';

export type {
  GetCollectionGroupPath,
  GetCollectionPath,
  PropertyPathDotNotation,
  PropertyPathSegmentTuple,
  TransactionOptions,
};

export type GenericTransaction = Transaction & {
  create?: { (reference: DocumentReference, data: any): Transaction };
  getAll?: unknown;
};

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

export type GenericWriteBatch = WriteBatch & {
  create?: { (reference: DocumentReference, data: any): WriteBatch };
};
