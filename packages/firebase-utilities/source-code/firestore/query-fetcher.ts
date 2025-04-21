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
import { FetcherProperties, ListFetcher } from "@kthksgy/utilities";

/** クエリフェッチャー */
export class QueryFetcher<
  Item extends NonNullable<any>,
  Properties extends FetcherProperties = FetcherProperties,
  E = any,
> extends ListFetcher<Item, Properties> {
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
  /** 不明なエラーを既知のエラーに変換する関数 */
  toError?: { (error: any): E };
  /** ドキュメントスナップショットをデータに変換する関数 */
  toItem: { (documentSnapshot: DocumentSnapshot): Item };
  /** トランザクション */
  transaction?: Transaction;

  constructor(
    parameters: {
      filters?: Array<FilterQueryParameter>;
      limits?: Array<LimitQueryParameter>;
      orders?: Array<OrderQueryParameter>;
      pages?: Array<PageQueryParameter>;
      ranges?: Array<RangeQueryParameter>;
      reference: CollectionReference | Query;
      toError?: { (error: any): E };
      toItem: { (documentSnapshot: DocumentSnapshot): Item };
      transaction?: Transaction;
    } & ConstructorParameters<typeof ListFetcher<Item, Properties>>[0],
  ) {
    super(parameters);

    this.filters = parameters.filters ?? [];
    this.limits = parameters.limits ?? [];
    this.orders = parameters.orders ?? [];
    this.pages = parameters.pages ?? [];
    this.ranges = parameters.ranges ?? [];
    this.reference = parameters.reference;
    this.toError = parameters.toError;
    this.toItem = parameters.toItem;
    this.transaction = parameters.transaction;

    this.setTransaction = this.setTransaction.bind(this);
  }

  copy(
    parameters: Partial<ConstructorParameters<typeof QueryFetcher<Item, Properties, E>>[0]> = {},
  ) {
    return new QueryFetcher<Item, Properties, E>({ ...this, ...parameters });
  }

  async fetch(): Promise<QueryFetcherResult<Item, Properties, E>> {
    /** クエリスナップショット */
    let querySnapshot;
    try {
      querySnapshot = await fetchDocuments(
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
      );
    } catch (error) {
      throw typeof this.toError === "function" ? this.toError(error) : error;
    }

    const data: Array<Item> = [];
    const errors = new Map<number, E>();
    const items = new Map<number, Item>();

    for (let i = 0; i < querySnapshot.size; i++) {
      /** ドキュメントスナップショット */
      const documentSnapshot = querySnapshot.docs[i];
      try {
        const item = this.toItem(documentSnapshot);
        data.push(item);
        items.set(i, item);
      } catch (error: any) {
        errors.set(i, typeof this.toError === "function" ? this.toError(error) : error);
      }
    }

    const next =
      typeof this.limit === "number" &&
      Number.isFinite(this.limit) &&
      this.limit > 0 &&
      querySnapshot.size >= this.limit
        ? this.copy({
            pages: [
              createPageQueryParameter(
                "exclusive",
                "after",
                querySnapshot.docs[querySnapshot.size - 1],
              ),
            ],
          })
        : undefined;

    const previous =
      querySnapshot.size > 0
        ? this.copy({
            pages: [createPageQueryParameter("exclusive", "before", querySnapshot.docs[0])],
          })
        : undefined;

    return {
      current: this,
      data,
      errors,
      items,
      ...(next && { next }),
      ...(previous && { previous }),
      querySnapshot,
    };
  }

  setTransaction(transaction: QueryFetcher<Item, Properties, E>["transaction"]) {
    return this.copy({ transaction });
  }
}

export type QueryFetcherResult<
  Item extends NonNullable<any>,
  Properties extends FetcherProperties = FetcherProperties,
  E = any,
> = {
  /** 現在のフェッチャー */
  current: QueryFetcher<Item, Properties, E>;
  /** データ */
  data: Array<Item>;
  /** エラー */
  errors: Map<number, E>;
  /** アイテム */
  items: Map<number, Item>;
  /** 次のフェッチャー */
  next?: QueryFetcher<Item, Properties, E>;
  /** 前のフェッチャー */
  previous?: QueryFetcher<Item, Properties, E>;
  /** クエリスナップショット */
  querySnapshot: QuerySnapshot;
};
