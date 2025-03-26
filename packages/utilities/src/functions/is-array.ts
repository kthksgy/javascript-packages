/**
 * 値が配列である場合、`true`を返す。
 * @param target 値
 * @returns 値が配列である場合、`true`
 *
 * `Array.isArray()`はランタイムでは`ReadonlyArray<T>`に対し`true`を返すが、
 * `ReadonlyArray<T>`をTypeScript上では保証しないため、この関数を実装している。
 * @see https://github.com/microsoft/TypeScript/issues/17002
 * ```typescript
 * let numbers: number | Array<number> | ReadonlyArray<number>;
 *
 * if (Array.isArray(numbers)) {
 *   // Array<number>
 * } else {
 *   // number | ReadonlyArray<number>
 * }
 *
 * if (isArray(numbers)) {
 *  // Array<number> | ReadonlyArray<number>
 * } else {
 *  // number
 * }
 * ```
 */
export function isArray<T>(
  target: T,
): target is Extract<T extends Array<any> ? T : T extends ReadonlyArray<any> ? T : never, T> {
  return Array.isArray(target);
}
