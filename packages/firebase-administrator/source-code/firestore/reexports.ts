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
  WriteBatch,
  getFirestore,
} from "firebase-admin/firestore";
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
  WriteBatch as Batch,
  getFirestore,
};

declare module "@kthksgy/firebase-common/firestore" {
  export interface FirestoreModuleAugmentation {
    DateTime: Temporal.ZonedDateTime;
    Timestamp: Timestamp;
  }
}
