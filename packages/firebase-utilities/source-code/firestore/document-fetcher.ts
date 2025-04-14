import {
  DocumentReference,
  DocumentSnapshot,
  Transaction,
  fetchDocument,
  getDocumentData,
} from "@kthksgy/firebase/firestore";
import { Fetcher, FetcherProperties, FetcherResult } from "@kthksgy/utilities";

/** Firestoreシングルレトリーバー */
export class FirestoreSingleRetriever<
  TData extends NonNullable<any>,
  TAttributes extends FetcherProperties = undefined,
> extends Fetcher<TData, TAttributes> {
  /** コンバーター */
  converter: { (documentSnapshot: DocumentSnapshot): TData };
  /** エラーハンドラー */
  errorHandler?: { (error: any): never };
  /** ドキュメントインスタンス */
  reference: DocumentReference;
  /** トランザクション */
  transaction?: Transaction;

  constructor(
    parameters: {
      converter: FirestoreSingleRetriever<TData, TAttributes>["converter"];
      errorHandler?: FirestoreSingleRetriever<TData, TAttributes>["errorHandler"];
      reference: FirestoreSingleRetriever<TData, TAttributes>["reference"];
      transaction?: FirestoreSingleRetriever<TData, TAttributes>["transaction"];
    } & ConstructorParameters<typeof Fetcher<TData, TAttributes>>[0],
  ) {
    super(parameters);

    this.converter = parameters.converter;
    this.errorHandler = parameters.errorHandler;
    this.reference = parameters.reference;
    this.transaction = parameters.transaction;

    this.setTransaction = this.setTransaction.bind(this);
  }

  copy(
    parameters: Partial<
      ConstructorParameters<typeof FirestoreSingleRetriever<TData, TAttributes>>[0]
    > = {},
  ) {
    return new FirestoreSingleRetriever<TData, TAttributes>({ ...this, ...parameters });
  }

  async retrieve(): Promise<FirestoreSingleRetrieverResult<TData, TAttributes>> {
    try {
      /** ドキュメントスナップショット */
      const documentSnapshot = await fetchDocument(this.reference, this.transaction);

      if (getDocumentData(documentSnapshot) === undefined) {
        throw new DocumentFetcherError(
          "not-found",
          `There is no document corresponding to path "${documentSnapshot.ref.path}".`,
        );
      }

      /** データ */
      const data = this.converter(documentSnapshot);

      return { current: this, data };
    } catch (error) {
      if (this.errorHandler) {
        throw this.errorHandler(error);
      } else {
        throw error;
      }
    }
  }

  setTransaction(transaction: FirestoreSingleRetriever<TData, TAttributes>["transaction"]) {
    return this.copy({ transaction });
  }
}

export type FirestoreSingleRetrieverResult<
  TData extends NonNullable<any>,
  TAttributes extends FetcherProperties = undefined,
> = FetcherResult<TData, TAttributes>;

/**
 * Firestoreレトリーバーエラー
 * `FirestoreError`が`firebase`と`firebase-admin`の両方に存在しないため、用意している。
 * @see https://github.com/firebase/firebase-js-sdk/blob/master/packages/firestore/src/util/error.ts#L213
 */
export class DocumentFetcherError extends Error {
  code: "not-found";

  constructor(code: DocumentFetcherError["code"], message: string) {
    super(message);
    this.code = code;

    // バインドする。
    this.toJSON = this.toJSON.bind(this);
  }

  toJSON() {
    return JSON.parse(JSON.stringify(this));
  }
}
