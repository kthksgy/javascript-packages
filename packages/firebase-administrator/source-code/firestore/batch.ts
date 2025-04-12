import { Firestore, Transaction } from "firebase-admin/firestore";

import { TransactionOptions } from "./types";

/**
 * `firebase/firestore`の`runTransaction`の互換関数
 */
export function runTransaction<T>(
  firestore: Firestore,
  updateFunction: { (transaction: Transaction): Promise<T> },
  options?: TransactionOptions,
): Promise<T> {
  return firestore.runTransaction(updateFunction, options);
}

/**
 * `firebase/firestore`の`writeBatch`の互換関数
 */
export function createWriteBatch(firestore: Firestore) {
  return firestore.batch();
}
