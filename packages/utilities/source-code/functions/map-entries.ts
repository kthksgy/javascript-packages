import { isPlainObject } from "./is-plain-object";

/**
 * オブジェクトのエントリを再帰的にマッピングする。
 * 配列はバリューのみマッピングされる。
 * @param input 入力
 * @param keyMapper キーのマッパー
 * @param valueMapper 値のマッパー
 * @returns 出力
 */
export function mapEntries(
  input: any,
  keyMapper: { (key: string): string },
  valueMapper: { (value: any): any },
): any {
  if (Array.isArray(input)) {
    return input.map(function (value) {
      return mapEntries(value, keyMapper, valueMapper);
    });
  } else if (isPlainObject(input)) {
    return Object.entries(input).reduce(function (output, [key, value]) {
      if (value !== undefined) {
        output[keyMapper(key)] = mapEntries(value, keyMapper, valueMapper);
      }
      return output;
    }, {} as any);
  } else {
    return valueMapper(input);
  }
}
