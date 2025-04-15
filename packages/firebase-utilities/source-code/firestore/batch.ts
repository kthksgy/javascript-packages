import { DocumentReference, SetOptions } from "@kthksgy/firebase/firestore";

export type Batch = {
  create: { (reference: DocumentReference, data: any): Batch };
  delete: { (reference: DocumentReference): Batch };
  set: { (reference: DocumentReference, data: any, options?: SetOptions): Batch };
  update: { (reference: DocumentReference, data: any): Batch };
};

export function queueDocumentToCreate<B extends Pick<Batch, "create">>(
  batch: B,
  reference: DocumentReference,
  data: any,
): B {
  return batch.create(reference, data) as unknown as B;
}

export function queueDocumentToDelete<B extends Pick<Batch, "delete">>(
  batch: B,
  reference: DocumentReference,
): B {
  return batch.delete(reference) as unknown as B;
}

export function queueDocumentToSet<B extends Pick<Batch, "set">>(
  batch: B,
  reference: DocumentReference,
  data: any,
  options?: SetOptions,
): B {
  return batch.set(reference, data, options) as unknown as B;
}

export function queueDocumentToUpdate<B extends Pick<Batch, "update">>(
  batch: B,
  reference: DocumentReference,
  data: any,
): B {
  return batch.update(reference, data) as unknown as B;
}
