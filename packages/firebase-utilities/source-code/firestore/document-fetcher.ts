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
> extends Fetcher<Data | null, Properties> {
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
    } & ConstructorParameters<typeof Fetcher<Data | null, Properties>>[0],
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
      if (!getDocumentData(documentSnapshot)) {
        return { current: this, data: null };
      } else {
        return { current: this, data: this.toData(documentSnapshot) };
      }
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
  data: Data | null;
};
