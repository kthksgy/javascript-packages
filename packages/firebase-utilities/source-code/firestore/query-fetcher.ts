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

/** ドキュメント群フェッチャー */
export class QueryFetcher<
  Data extends NonNullable<any>,
  Properties extends FetcherProperties = FetcherProperties,
> extends ListFetcher<Data, Properties> {
  /** コンバーター */
  converter: { (documentSnapshot: DocumentSnapshot): Data };
  /** エラーハンドラー */
  errorHandler?: { (error: any): never };
  /** フィルター制約 */
  filters: Array<FilterQueryParameter>;
  /** リミット制約 */
  limits: Array<LimitQueryParameter>;
  /** 順序制約 */
  orders: Array<OrderQueryParameter>;
  /** ページネーション制約 */
  pages: Array<PageQueryParameter>;
  /** 範囲制約 */
  ranges: Array<RangeQueryParameter>;
  /** クエリを実行する対象のリファレンス */
  reference: CollectionReference | Query;
  /** トランザクション */
  transaction?: Transaction;

  constructor(
    parameters: {
      converter: { (documentSnapshot: DocumentSnapshot): Data };
      errorHandler?: { (error: any): never };
      filters?: Array<FilterQueryParameter>;
      limits?: Array<LimitQueryParameter>;
      orders?: Array<OrderQueryParameter>;
      pages?: Array<PageQueryParameter>;
      ranges?: Array<RangeQueryParameter>;
      reference: CollectionReference | Query;
      transaction?: Transaction;
    } & ConstructorParameters<typeof ListFetcher<Data, Properties>>[0],
  ) {
    super(parameters);

    this.converter = parameters.converter;
    this.errorHandler = parameters.errorHandler;
    this.filters = parameters.filters ?? [];
    this.limits = parameters.limits ?? [];
    this.orders = parameters.orders ?? [];
    this.pages = parameters.pages ?? [];
    this.ranges = parameters.ranges ?? [];
    this.reference = parameters.reference;
    this.transaction = parameters.transaction;

    this.setTransaction = this.setTransaction.bind(this);
  }

  copy(parameters: Partial<ConstructorParameters<typeof QueryFetcher<Data, Properties>>[0]> = {}) {
    return new QueryFetcher<Data, Properties>({ ...this, ...parameters });
  }

  async fetch(): Promise<QueryFetcherResult<Data, Properties>> {
    /** クエリスナップショット */
    const querySnapshot = await fetchDocuments(
      buildQuery(this.reference, {
        filters: this.filters,
        limits:
          typeof this.limit === "number" && Number.isFinite(this.limit) && this.limit >= 1
            ? [createLimitQueryParameter(Math.floor(this.limit))]
            : this.limits,
        pages: this.pages,
        ranges: this.ranges,
        orders: this.orders,
      }),
      this.transaction,
    ).catch(this.errorHandler);

    const data: Array<Data> = [];
    const items = new Map<number, Data>();
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
      previous: this.copy({
        orders:
          this.orders.length > 0
            ? this.orders.map(function (order) {
                return new OrderQueryParameter(
                  order.path,
                  order.direction === "descending" ? "ascending" : "descending",
                );
              })
            : [new OrderQueryParameter("__name__", "descending")],
        pages: [createPageQueryParameter("exclusive", "before", querySnapshot.docs[0])],
      }),
      ...(typeof this.limit === "number" &&
        Number.isFinite(this.limit) &&
        this.limit > 0 &&
        querySnapshot.size >= this.limit && {
          next: this.copy({
            pages: [
              createPageQueryParameter(
                "exclusive",
                "after",
                querySnapshot.docs[querySnapshot.size - 1],
              ),
            ],
          }),
        }),
      querySnapshot,
    };
  }

  setTransaction(transaction: QueryFetcher<Data, Properties>["transaction"]) {
    return this.copy({ transaction });
  }
}

export type QueryFetcherResult<
  Data extends NonNullable<any>,
  Properties extends FetcherProperties = FetcherProperties,
> = ListFetcherResult<Data, Properties> & { querySnapshot: QuerySnapshot };
