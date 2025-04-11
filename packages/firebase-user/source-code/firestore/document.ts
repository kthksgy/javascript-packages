import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  SetOptions,
  Transaction,
  addDoc,
  getDoc,
  onSnapshot,
  runTransaction,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export function addDocument<T extends object>(reference: CollectionReference, data: T) {
  return addDoc(reference, data);
}

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

export function listenDocument(
  reference: DocumentReference,
  onNext: { (snapshot: DocumentSnapshot): void },
  onError?: { (error: Error): void },
) {
  return onSnapshot(reference, onNext, onError);
}

export function setDocument(reference: DocumentReference, data: any, options?: SetOptions) {
  if (options) {
    return setDoc(reference, data, options);
  } else {
    return setDoc(reference, data);
  }
}

export function updateDocument(reference: DocumentReference, data: any) {
  return updateDoc(reference, data);
}
