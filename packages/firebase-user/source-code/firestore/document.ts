import {
  DocumentReference,
  DocumentSnapshot,
  SetOptions,
  Transaction,
  getDoc,
  runTransaction,
} from "firebase/firestore";

export function createDocument<T extends object>(reference: DocumentReference, data: T) {
  return runTransaction(reference.firestore, async function (transaction) {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists()) {
      transaction.set(reference, data);
    }
  });
}

export type AbstractQueue = {
  create: { (reference: DocumentReference, data: any): AbstractQueue };
  delete: { (reference: DocumentReference): AbstractQueue };
  set: { (reference: DocumentReference, data: any, options?: SetOptions): AbstractQueue };
  update: { (reference: DocumentReference, data: any): AbstractQueue };
};

export function doesDocumentExist(documentSnapshot: DocumentSnapshot) {
  return documentSnapshot.exists();
}

export async function fetchDocument(reference: DocumentReference, transaction?: Transaction) {
  if (transaction) {
    return transaction.get(reference);
  } else {
    return getDoc(reference);
  }
}

export function getDocumentData<T extends DocumentSnapshot>(documentSnapshot: T) {
  return documentSnapshot.data({ serverTimestamps: "estimate" });
}

export function queueDocumentToCreate<Queue extends Pick<AbstractQueue, "create">>(
  queue: Queue,
  reference: DocumentReference,
  data: any,
): Queue {
  return queue.create(reference, data) as unknown as Queue;
}

export function queueDocumentToDelete<Queue extends Pick<AbstractQueue, "delete">>(
  queue: Queue,
  reference: DocumentReference,
): Queue {
  return queue.delete(reference) as unknown as Queue;
}

export function queueDocumentToSet<Queue extends Pick<AbstractQueue, "set">>(
  queue: Queue,
  reference: DocumentReference,
  data: any,
  options?: SetOptions,
): Queue {
  return queue.set(reference, data, options) as unknown as Queue;
}

export function queueDocumentToUpdate<Queue extends Pick<AbstractQueue, "update">>(
  queue: Queue,
  reference: DocumentReference,
  data: any,
): Queue {
  return queue.update(reference, data) as unknown as Queue;
}
