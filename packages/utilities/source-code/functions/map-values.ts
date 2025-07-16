import { isPlainObject } from "./is-plain-object";

/**
 * オブジェクトの値を再帰的にマッピングする。
 * @param input 入力
 * @param mapper 値のマッパー
 * @returns 出力
 */
export function mapValues(input: any, mapper: { (value: any): any }): any {
  if (Array.isArray(input)) {
    return input.map(function (value) {
      return mapValues(value, mapper);
    });
  } else if (isPlainObject(input)) {
    return Object.entries(input).reduce(function (output, [key, value]) {
      if (value !== undefined) {
        output[key] = mapValues(value, mapper);
      }
      return output;
    }, {} as any);
  } else {
    return mapper(input);
  }
}
