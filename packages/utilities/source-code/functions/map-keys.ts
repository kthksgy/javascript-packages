import { isPlainObject } from "./is-plain-object";

/**
 * オブジェクトのキーを再帰的にマッピングする。
 * @param input 入力
 * @param mapper キーのマッパー
 * @returns 出力
 */
export function mapKeys(
  input: any,
  mapper: { (key: string, value: any, depth: number): string },
): any {
  return mapKeysInternally(input, mapper);
}

function mapKeysInternally(
  input: any,
  mapper: { (key: string, value: any, depth: number): string },
  depth: number = 0,
): any {
  if (Array.isArray(input)) {
    return input.map(function (value) {
      return mapKeysInternally(value, mapper, depth + 1);
    });
  } else if (isPlainObject(input)) {
    return Object.entries(input).reduce(function (output, [key, value]) {
      if (value !== undefined) {
        output[mapper(key, value, depth)] = mapKeysInternally(value, mapper, depth + 1);
      }
      return output;
    }, {} as any);
  } else {
    return input;
  }
}
