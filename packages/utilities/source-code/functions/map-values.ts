import { isPlainObject } from "./is-plain-object";

/**
 * オブジェクトの値を再帰的にマッピングする。
 * @param input 入力
 * @param mapper 値のマッパー
 * @returns 出力
 */
export function mapValues<T extends Readonly<Record<string, any>> | ReadonlyArray<any>>(
  input: T,
  mapper: { (value: any, key: string | number | null, depth: number): any },
): any {
  return mapValuesInternally(input, mapper);
}

function mapValuesInternally(
  input: any,
  mapper: { (value: any, key: string | number | null, depth: number): any },
  key: string | number | null = null,
  depth: number = 0,
): any {
  if (Array.isArray(input)) {
    return input.map(function (value, index) {
      return mapValuesInternally(value, mapper, index, depth + 1);
    });
  } else if (isPlainObject(input)) {
    return Object.entries(input).reduce(function (output, [key, value]) {
      if (value !== undefined) {
        output[key] = mapValuesInternally(value, mapper, key, depth + 1);
      }
      return output;
    }, {} as any);
  } else {
    return mapper(input, key, depth);
  }
}
