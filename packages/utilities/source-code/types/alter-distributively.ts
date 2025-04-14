import { Alter } from "./alter";
import { KeyOfUnion } from "./key-of-union";

/**
 * オブジェクトのユニオン型から指定したキーの値を変更する。
 * 通常の`Alter`では意図した結果にならない。
 *
 * @example
 * ```typescript
 * type T = { a: string } | { b: number };
 * type Example1 = Alter<T, 'a', boolean>; // {}
 * type Example2 = AlterDistributively<T, 'a', boolean>; // { a: boolean } | { b: number }
 * ```
 */
export type AlterDistributively<T, K extends KeyOfUnion<T>, V> = T extends T
  ? Alter<T, K, V>
  : never;
