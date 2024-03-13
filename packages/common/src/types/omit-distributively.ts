import { KeyOfUnion } from './key-of-union';

/**
 * オブジェクトのユニオン型から指定したキーを除外する。
 * 通常の`Omit`では意図した結果にならない。
 *
 * @example
 * ```typescript
 * type T = { a: string } | { b: number };
 * type Example1 = Omit<T, 'a'>; // {}
 * type Example2 = OmitDistributively<T, 'a'>; // { b: number }
 * ```
 */
export type OmitDistributively<T, K extends KeyOfUnion<T>> = T extends T ? Omit<T, K> : never;
