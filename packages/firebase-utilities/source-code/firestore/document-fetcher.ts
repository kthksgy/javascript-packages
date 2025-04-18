import {
  DocumentReference,
  DocumentSnapshot,
  Transaction,
  fetchDocument,
  getDocumentData,
} from "@kthksgy/firebase/firestore";
import { Fetcher, FetcherProperties, FetcherResult } from "@kthksgy/utilities";

/** ドキュメントフェッチャー */
export class DocumentFetcher<
  Data extends NonNullable<any>,
  Properties extends FetcherProperties = FetcherProperties,
> extends Fetcher<Data, Properties> {
  /** コンバーター */
  converter: { (documentSnapshot: DocumentSnapshot): Data };
  /** エラーハンドラー */
  errorHandler?: { (error: any): never };
  /** ドキュメントインスタンス */
  reference: DocumentReference;
  /** トランザクション */
  transaction?: Transaction;

  constructor(
    parameters: {
      converter: { (documentSnapshot: DocumentSnapshot): Data };
      errorHandler?: { (error: any): never };
      reference: DocumentReference;
      transaction?: Transaction;
    } & ConstructorParameters<typeof Fetcher<Data, Properties>>[0],
  ) {
    super(parameters);

    this.converter = parameters.converter;
    this.errorHandler = parameters.errorHandler;
    this.reference = parameters.reference;
    this.transaction = parameters.transaction;

    this.setTransaction = this.setTransaction.bind(this);
  }

  copy(
    parameters: Partial<ConstructorParameters<typeof DocumentFetcher<Data, Properties>>[0]> = {},
  ) {
    return new DocumentFetcher<Data, Properties>({ ...this, ...parameters });
  }

  async fetch(): Promise<DocumentFetcherResult<Data, Properties>> {
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

  setTransaction(transaction: DocumentFetcher<Data, Properties>["transaction"]) {
    return this.copy({ transaction });
  }
}

export type DocumentFetcherResult<
  Data extends NonNullable<any>,
  Properties extends FetcherProperties = FetcherProperties,
> = FetcherResult<Data, Properties>;

/**
 * ドキュメントフェッチャーエラー
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
