import { type FetcherProperties } from "./fetcher";
import { SimpleFetcher } from "./simple-fetcher";

/**
 * シンプルスロワー
 * コンストラクタで指定した値をスローするフェッチャー。
 */
export class SimpleThrower<
  E,
  Properties extends FetcherProperties = FetcherProperties,
> extends SimpleFetcher<any, Properties> {
  constructor(
    error: E,
    parameters: ConstructorParameters<typeof SimpleFetcher<any, Properties>>[1] = {},
  ) {
    super(async function () {
      throw error;
    }, parameters);
  }
}
