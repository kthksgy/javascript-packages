import {
  DocumentReference,
  DocumentSnapshot,
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
