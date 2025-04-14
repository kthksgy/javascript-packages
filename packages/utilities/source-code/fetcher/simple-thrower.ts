import { type FetcherProperties } from "./fetcher";
import { SimpleFetcher } from "./simple-fetcher";

/**
 * シンプルスロワー
 * コンストラクタで指定した値をスローするフェッチャー。
 */
export class SimpleThrower<
  Properties extends FetcherProperties = FetcherProperties,
> extends SimpleFetcher<never, Properties> {
  constructor(
    error: unknown,
    parameters: ConstructorParameters<typeof SimpleFetcher<never, Properties>>[1] = {},
  ) {
    super(async function () {
      throw error;
    }, parameters);
  }
}
