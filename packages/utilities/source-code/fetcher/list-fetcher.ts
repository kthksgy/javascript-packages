import { Fetcher, FetcherProperties, FetcherResult } from "./fetcher";

/**
 * リストレトリーバー
 */
export class ListFetcher<
  Item,
  Properties extends FetcherProperties = FetcherProperties,
> extends Fetcher<Array<Item>, Properties> {
  /** リミット */
  limit?: number;

  constructor(
    parameters: { limit?: number } & ConstructorParameters<
      typeof Fetcher<Array<Item>, Properties>
    >[0],
  ) {
    super(parameters);

    this.limit = parameters.limit;
  }

  async fetch(): Promise<ListFetcherResult<Item, Properties>> {
    throw new Error("実装されていません。");
  }
}

export type ListFetcherResult<
  Item,
  Properties extends FetcherProperties = FetcherProperties,
> = FetcherResult<Array<Item>, Properties> & {
  /** エラー */
  errors: Map<number, any>;
  /** アイテム */
  items: Map<number, Item>;
};
