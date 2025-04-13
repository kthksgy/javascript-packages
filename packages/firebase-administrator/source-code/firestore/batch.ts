import { Firestore, Transaction } from "firebase-admin/firestore";

import { TransactionOptions } from "./instance";

/**
 * `firebase/firestore`の`runTransaction`の互換関数
 */
export async function runTransaction<T>(
  firestore: Firestore,
  updateFunction: { (transaction: Transaction): Promise<T> },
  options?: TransactionOptions,
): Promise<T> {
  return await firestore.runTransaction(updateFunction, options);
}

/**
 * `firebase/firestore`の`writeBatch`の互換関数
 */
export function createBatch(firestore: Firestore) {
  return firestore.batch();
}
