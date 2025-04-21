let key = 0;

/**
 * フェッチャー
 * データの取得を共通化する。
 */
export class Fetcher<Data, Properties extends FetcherProperties = FetcherProperties> {
  /** インデックス */
  index?: number;
  /** キー */
  key?: number;
  /** プロパティ */
  properties?: Properties;

  constructor(parameters: { index?: number; key?: number; properties?: Properties }) {
    this.index = parameters.index;
    this.key = parameters.key ?? key++;
    this.properties = parameters.properties;

    this.copy = this.copy.bind(this);
    this.doesHaveSameKey = this.doesHaveSameKey.bind(this);
    this.fetch = this.fetch.bind(this);
  }

  /** このフェッチャーを複製する。 */
  copy(
    parameters: {
      /** キー */
      key?: number;
      /** インデックス */
      index?: number;
      /** プロパティ */
      properties?: Properties;
    } = {},
  ) {
    throw new Error(`実装されていません。${parameters}`);
  }

  /** このフェッチャーが指定したフェッチャーから連続している場合、`true`を返す。 */
  doesHaveSameKey(other?: Fetcher<Data, Properties> | null) {
    return other !== null && other !== undefined && other?.key === this.key;
  }

  async fetch(): Promise<FetcherResult<Data, Properties>> {
    throw new Error("実装されていません。");
  }
}

/** フェッチャーのプロパティ */
export type FetcherProperties = Partial<Record<string, any>> | undefined;

/** フェッチャーのリザルト */
export type FetcherResult<Data, Properties extends FetcherProperties = FetcherProperties> = {
  /** 現在のフェッチャー */
  current: Fetcher<Data, Properties>;
  /** データ */
  data: Data;
  /** 次のフェッチャー */
  next?: Fetcher<Data, Properties>;
  /** 前のフェッチャー */
  previous?: Fetcher<Data, Properties>;
};

/**
 * フェッチャーのデータを取得する。
 * @param fetcher フェッチャー
 * @returns フェッチャーのデータ
 */
export async function fetchData<Data>(fetcher: Fetcher<Data>) {
  return await fetcher.fetch().then(function ({ data }) {
    return data;
  });
}
