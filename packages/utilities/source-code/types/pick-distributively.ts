import { KeyOfUnion } from "./key-of-union";

/**
 * オブジェクトのユニオン型から指定したキー以外を除外する。
 * 通常の`Pick`では意図した結果にならない。
 *
 * @example
 * ```typescript
 * type T = { a: string } | { b: number };
 * type Example1 = Pick<T, 'b'>; // {}
 * type Example2 = PickDistributively<T, 'b'>; // { b: number }
 * ```
 */
export type PickDistributively<T, K extends KeyOfUnion<T>> = T extends T ? Pick<T, K> : never;
