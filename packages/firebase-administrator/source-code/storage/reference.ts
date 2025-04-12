import { Storage } from 'firebase-admin/storage';

export function createFileReference(storage: Storage, url: string) {
  return storage.bucket().file(url);
}
