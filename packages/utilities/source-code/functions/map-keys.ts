import { isPlainObject } from "./is-plain-object";

/**
 * オブジェクトのキーを再帰的にマッピングする。
 * @param input 入力
 * @param mapper キーのマッパー
 * @returns 出力
 */
export function mapKeys(input: any, mapper: { (key: string): string }): any {
  if (Array.isArray(input)) {
    return input.map(function (value) {
      return mapKeys(value, mapper);
    });
  } else if (isPlainObject(input)) {
    return Object.entries(input).reduce(function (output, [key, value]) {
      if (value !== undefined) {
        output[mapper(key)] = mapKeys(value, mapper);
      }
      return output;
    }, {} as any);
  } else {
    return input;
  }
}
