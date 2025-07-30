/**
 * @deprecated 代わりに`type-fest`の`KeysOfUnion`を使用する。
 * ユニオン型のキーを取得する。
 *
 * @example
 * ```typescript
 * type T = { a: string } | { b: number };
 * type Example1 = keyof T; // never
 * type Example2 = KeyOfUnion<T>; // "a" | "b"
 * ```
 */
export type KeyOfUnion<T> = T extends T ? keyof T : never;
