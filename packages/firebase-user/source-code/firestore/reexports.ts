import {
  CollectionReference,
  type DocumentData,
  DocumentReference,
  DocumentSnapshot,
  FieldPath,
  FieldValue,
  Firestore,
  Query,
  QuerySnapshot,
  type SetOptions,
  Timestamp,
  Transaction,
  type TransactionOptions,
  type Unsubscribe,
  WriteBatch,
  addDoc,
  collection,
  collectionGroup,
  deleteField,
  doc,
  getFirestore,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { Temporal } from "temporal-polyfill";

export {
  CollectionReference,
  type DocumentData,
  DocumentReference,
  DocumentSnapshot,
  FieldPath,
  FieldValue,
  Firestore,
  Query,
  QuerySnapshot,
  type SetOptions,
  Timestamp,
  Transaction,
  type TransactionOptions,
  type Unsubscribe,
  WriteBatch as Batch,
  addDoc as addDocument,
  collection as createCollectionReference,
  collectionGroup as createCollectionGroupReference,
  deleteField as createDeleteMarkFieldValue,
  doc as createDocumentReference,
  getFirestore,
  onSnapshot as watchDocument,
  onSnapshot as watchDocuments,
  runTransaction,
  serverTimestamp as createServerTimestampFieldValue,
  setDoc as setDocument,
  updateDoc as updateDocument,
  writeBatch as createBatch,
};

declare module "@kthksgy/firebase-common/firestore" {
  export interface FirestoreModuleAugmentation {
    DateTime: Temporal.ZonedDateTime;
    Timestamp: Timestamp;
  }
}
