/**
 * @deprecated 代わりに`type-fest`の`IsAny`を使用する。
 * `T`が`any`の場合にのみ、`true`を返す。
 */
export type IsAny<T> = 0 extends 1 & T ? true : false;
