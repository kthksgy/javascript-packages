import { Fetcher, type FetcherProperties, type FetcherResult } from "./fetcher";

/**
 * シンプルフェッチャー
 */
export class SimpleFetcher<
  Data,
  Properties extends FetcherProperties = FetcherProperties,
> extends Fetcher<Data, Properties> {
  constructor(
    fetch: {
      (this: SimpleFetcher<Data, Properties>): Promise<FetcherResult<Data, Properties>>;
    },
    parameters: ConstructorParameters<typeof Fetcher<Data, Properties>>[0] = {},
  ) {
    super(parameters);
    this.fetch = fetch.bind(this);
  }
}
