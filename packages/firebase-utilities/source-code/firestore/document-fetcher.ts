import {
  DocumentReference,
  DocumentSnapshot,
  Transaction,
  fetchDocument,
  getDocumentData,
} from "@kthksgy/firebase/firestore";
import { Fetcher, FetcherProperties } from "@kthksgy/utilities";

/** ドキュメントフェッチャー */
export class DocumentFetcher<
  Data extends NonNullable<any>,
  Properties extends FetcherProperties = FetcherProperties,
  E = any,
> extends Fetcher<Data, Properties> {
  /** ドキュメントインスタンス */
  reference: DocumentReference;
  /** ドキュメントスナップショットをデータに変換する関数 */
  toData: { (documentSnapshot: DocumentSnapshot): Data };
  /** 不明なエラーを既知のエラーに変換する関数 */
  toError?: { (error: any): E };
  /** トランザクション */
  transaction?: Transaction;

  constructor(
    parameters: {
      reference: DocumentReference;
      toData: { (documentSnapshot: DocumentSnapshot): Data };
      toError?: { (error: any): E };
      transaction?: Transaction;
    } & ConstructorParameters<typeof Fetcher<Data, Properties>>[0],
  ) {
    super(parameters);

    this.reference = parameters.reference;
    this.toData = parameters.toData;
    this.toError = parameters.toError;
    this.transaction = parameters.transaction;

    this.setTransaction = this.setTransaction.bind(this);
  }

  copy(
    parameters: Partial<ConstructorParameters<typeof DocumentFetcher<Data, Properties, E>>[0]> = {},
  ) {
    return new DocumentFetcher<Data, Properties, E>({ ...this, ...parameters });
  }

  async fetch(): Promise<DocumentFetcherResult<Data, Properties, E>> {
    try {
      const documentSnapshot = await fetchDocument(this.reference, this.transaction);
      if (getDocumentData(documentSnapshot) === undefined) {
        throw new DocumentFetcherError(
          "not-found",
          `There is no document corresponding to path "${documentSnapshot.ref.path}".`,
        );
      }
      const data = this.toData(documentSnapshot);
      return { current: this, data };
    } catch (error) {
      throw typeof this.toError === "function" ? this.toError(error) : error;
    }
  }

  setTransaction(transaction: DocumentFetcher<Data, Properties, E>["transaction"]) {
    return this.copy({ transaction });
  }
}

export type DocumentFetcherResult<
  Data extends NonNullable<any>,
  Properties extends FetcherProperties = FetcherProperties,
  E = any,
> = {
  /** 現在のフェッチャー */
  current: DocumentFetcher<Data, Properties, E>;
  /** データ */
  data: Data;
};

export type DocumentFetcherErrorCode = "not-found";
/**
 * ドキュメントフェッチャーエラー
 * `FirestoreError`が`firebase`と`firebase-admin`の両方に存在しないため、用意している。
 * @see https://github.com/firebase/firebase-js-sdk/blob/master/packages/firestore/src/util/error.ts#L213
 */
export class DocumentFetcherError extends Error {
  code: DocumentFetcherErrorCode;

  constructor(code: DocumentFetcherErrorCode, message: string) {
    super(message);
    this.code = code;

    // バインドする。
    this.toJSON = this.toJSON.bind(this);
  }

  toJSON() {
    return JSON.parse(JSON.stringify(this));
  }
}
