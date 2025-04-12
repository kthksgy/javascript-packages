import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  SetOptions,
  Transaction,
} from "firebase-admin/firestore";

export async function addDocument<T extends object>(
  collectionReference: CollectionReference,
  data: T,
) {
  const documentReference = collectionReference.doc();
  await documentReference.create(data);
  return documentReference;
}

export function createDocument<T extends object>(reference: DocumentReference, data: T) {
  return reference.create(data);
}

export function doesDocumentExist(documentSnapshot: DocumentSnapshot) {
  return documentSnapshot.exists;
}

export async function fetchDocument(reference: DocumentReference, transaction?: Transaction) {
  if (transaction) {
    return transaction.get(reference);
  } else {
    return reference.get();
  }
}

export function getDocumentData<T extends DocumentSnapshot>(documentSnapshot: T) {
  return documentSnapshot.data();
}

export function listenDocument(
  reference: DocumentReference,
  onNext: { (snapshot: DocumentSnapshot): void },
  onError?: { (error: Error): void },
) {
  return reference.onSnapshot(onNext, onError);
}

export function setDocument<T extends object>(
  reference: DocumentReference,
  data: T,
  options?: SetOptions,
) {
  if (options) {
    return reference.set(data, options);
  } else {
    return reference.set(data);
  }
}

export function updateDocument(reference: DocumentReference, data: any) {
  return reference.update(data);
}
