/**
 * オブジェクトのキーの値を変更する。
 *
 * @example
 * ```typescript
 * type T = { a: string, b: number };
 * type Example = Alter<T, 'a', number>; // { a: number, b: number }
 * ```
 */
export type Alter<T, K extends keyof T, V> = K extends keyof T ? Omit<T, K> & Record<K, V> : T;
