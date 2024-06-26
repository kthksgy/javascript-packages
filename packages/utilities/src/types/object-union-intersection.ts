import { KeyOfUnion } from './key-of-union';

/**
 * オブジェクトのユニオンのインターセクションを作成する。
 * @template T オブジェクトのユニオン
 *
 * @example
 * ```typescript
 * type Input1 = { a: boolean; } & ({ b: string; d: number } | { c: number; d: 'abc' });
 * type Output1 = ObjectUnionIntersection<Input1>;
 * // { a: boolean; b: string | undefined; c: number | undefined; d: number | 'abc'; }
 * ```
 */
export type ObjectUnionIntersection<T extends object> = {
  [K in KeyOfUnion<T>]: T extends infer U ? (K extends keyof U ? T[K] : undefined) : never;
};
