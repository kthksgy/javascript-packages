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
  keyMapper: { (key: string, value: any, depth: number): string },
  valueMapper: { (value: any, key: string | number | null, depth: number): any },
): any {
  return mapEntriesInternally(input, keyMapper, valueMapper);
}

function mapEntriesInternally(
  input: any,
  keyMapper: { (key: string, value: any, depth: number): string },
  valueMapper: { (value: any, key: string | number | null, depth: number): any },
  key: string | number | null = null,
  depth: number = 0,
): any {
  if (Array.isArray(input)) {
    return input.map(function (value, index) {
      return mapEntriesInternally(value, keyMapper, valueMapper, index, depth + 1);
    });
  } else if (isPlainObject(input)) {
    return Object.entries(input).reduce(function (output, [key, value]) {
      if (value !== undefined) {
        output[keyMapper(key, value, depth)] = mapEntriesInternally(
          value,
          keyMapper,
          valueMapper,
          key,
          depth + 1,
        );
      }
      return output;
    }, {} as any);
  } else {
    return valueMapper(input, key, depth);
  }
}
