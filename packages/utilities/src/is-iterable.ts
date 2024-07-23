/**
 * 値が反復可能プロトコルを実装している場合、`true`を返す。
 * @param iterable 値
 * @returns 値が反復可能プロトコルを実装している場合、`true`
 */
export function isIterable<T>(
  iterable: T,
): iterable is Extract<
  T extends IterableIterator<any> ? T : T extends Iterable<any> ? T : never,
  T
> {
  return iterable !== null && typeof iterable === 'object' && Symbol.iterator in iterable;
}
