import {
  CollectionReference,
  DocumentSnapshot,
  FilterQueryParameter,
  LimitQueryParameter,
  OrderQueryParameter,
  PageQueryParameter,
  Query,
  QuerySnapshot,
  RangeQueryParameter,
  Transaction,
  buildQuery,
  createLimitQueryParameter,
  createPageQueryParameter,
  fetchDocuments,
} from "@kthksgy/firebase/firestore";
import { FetcherProperties, ListFetcher, ListFetcherResult } from "@kthksgy/utilities";

/** Firestoreクエリレトリーバー */
export class FirestoreQueryRetriever<
  TData extends NonNullable<any>,
  TAttributes extends FetcherProperties = undefined,
> extends ListFetcher<TData, TAttributes> {
  /** コンバーター */
  converter: { (documentSnapshot: DocumentSnapshot): TData };
  /** エラーハンドラー */
  errorHandler?: { (error: any): never };
  /** フィルター制約 */
  filters: Array<FilterQueryParameter>;
  /** リミット制約 */
  limits: Array<LimitQueryParameter>;
  /** ページネーション制約 */
  paginations: Array<PageQueryParameter>;
  /** 範囲制約 */
  ranges: Array<RangeQueryParameter>;
  /** クエリを実行する対象のリファレンス */
  reference: CollectionReference | Query;
  /** ソート制約 */
  sorts: Array<OrderQueryParameter>;
  /** トランザクション */
  transaction?: Transaction;

  constructor(
    parameters: {
      converter: FirestoreQueryRetriever<TData, TAttributes>["converter"];
      errorHandler?: FirestoreQueryRetriever<TData, TAttributes>["errorHandler"];
      filters?: FirestoreQueryRetriever<TData, TAttributes>["filters"];
      limits?: FirestoreQueryRetriever<TData, TAttributes>["limits"];
      paginations?: FirestoreQueryRetriever<TData, TAttributes>["paginations"];
      ranges?: FirestoreQueryRetriever<TData, TAttributes>["ranges"];
      reference: FirestoreQueryRetriever<TData, TAttributes>["reference"];
      sorts?: FirestoreQueryRetriever<TData, TAttributes>["sorts"];
      transaction?: FirestoreQueryRetriever<TData, TAttributes>["transaction"];
    } & ConstructorParameters<typeof ListFetcher<TData, TAttributes>>[0],
  ) {
    super(parameters);

    this.converter = parameters.converter;
    this.errorHandler = parameters.errorHandler;
    this.filters = parameters.filters ?? [];
    this.limits = parameters.limits ?? [];
    this.paginations = parameters.paginations ?? [];
    this.ranges = parameters.ranges ?? [];
    this.reference = parameters.reference;
    this.sorts = parameters.sorts ?? [];
    this.transaction = parameters.transaction;

    this.setTransaction = this.setTransaction.bind(this);
  }

  copy(
    parameters: Partial<
      ConstructorParameters<typeof FirestoreQueryRetriever<TData, TAttributes>>[0]
    > = {},
  ) {
    return new FirestoreQueryRetriever<TData, TAttributes>({ ...this, ...parameters });
  }

  async fetch(): Promise<FirestoreQueryRetrieverResult<TData, TAttributes>> {
    /** クエリスナップショット */
    const querySnapshot = await fetchDocuments(
      buildQuery(this.reference, {
        filters: this.filters,
        limits:
          typeof this.limit === "number" && Number.isFinite(this.limit) && this.limit >= 1
            ? [createLimitQueryParameter(Math.floor(this.limit))]
            : this.limits,
        pages: this.paginations,
        ranges: this.ranges,
        orders: this.sorts,
      }),
      this.transaction,
    ).catch(this.errorHandler);

    const data: Array<TData> = [];
    const items = new Map<number, TData>();
    const errors = new Map<number, any>();

    for (let i = 0; i < querySnapshot.size; i++) {
      /** ドキュメントスナップショット */
      const documentSnapshot = querySnapshot.docs[i];
      try {
        const element = this.converter(documentSnapshot);
        data.push(element);
        items.set(i, element);
      } catch (error) {
        if (this.errorHandler) {
          try {
            throw this.errorHandler(error);
          } catch (error) {
            errors.set(i, error);
          }
        } else {
          errors.set(i, error);
        }
      }
    }

    return {
      current: this,
      data,
      errors,
      items,
      ...(typeof this.limit === "number" &&
        Number.isFinite(this.limit) &&
        this.limit > 0 &&
        querySnapshot.size >= this.limit && {
          next: this.copy({
            paginations: [
              createPageQueryParameter(
                "exclusive",
                "after",
                querySnapshot.docs[querySnapshot.size - 1],
              ),
            ],
          }),
          // TODO: 実装する。
          previous: undefined as this | undefined,
        }),
      querySnapshot,
    };
  }

  setTransaction(transaction: FirestoreQueryRetriever<TData, TAttributes>["transaction"]) {
    return this.copy({ transaction });
  }
}

export type FirestoreQueryRetrieverResult<
  TData extends NonNullable<any>,
  TAttributes extends FetcherProperties = undefined,
> = ListFetcherResult<TData, TAttributes> & { querySnapshot: QuerySnapshot };
