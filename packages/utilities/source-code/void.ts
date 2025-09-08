/**
 * **`false | null | undefined`のエイリアス**
 * 配列の要素や関数の引数に無効な値を許容する時に使用する。
 * @example
 * ```typescript
 * function doSomething(...values: ReadonlyArray<string | Void>) {
 *   for (const value of values.filter(function (value) { return !isVoid(value); })) {
 *     // 何かを処理する。
 *   }
 * }
 * ```
 */
export type Void = false | null | undefined;

/**
 * 値が`false`、`null`、`undefined`のいずれかであるかを判定する。
 * @param value 値
 * @returns 判定結果
 */
export function isVoid<T>(value: T): value is Extract<T, Void> {
  return value === false || value === null || value === undefined;
}
