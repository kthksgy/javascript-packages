/**
 * ミニファイ後のソースコードの位置特定に用いる`__POINT`関数を生成する。
 *
 * ファイル内検索をしやすくするため、`__POINTER`関数は1ファイルで1箇所だけ使用すると良い。
 * 既に使用されている場合はスコープを必要なだけ浅くするなどして共用する。
 *
 * @param label ラベル
 * @returns `__POINT`関数
 */
export function __POINTER(label: string) {
  return function (offset: string) {
    return label + ':' + offset;
  };
}
