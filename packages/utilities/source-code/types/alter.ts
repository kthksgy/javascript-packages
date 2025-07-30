/**
 * @deprecated 代わりに`type-fest`の`SetFieldType`を使用する。
 * オブジェクトのキーの値を変更する。
 *
 * @example
 * ```typescript
 * type T = { a: string, b: number };
 * type Example = Alter<T, 'a', number>; // { a: number, b: number }
 * ```
 */
export type Alter<T, K extends keyof T, V> = Omit<T, K> & Record<K, V>;
