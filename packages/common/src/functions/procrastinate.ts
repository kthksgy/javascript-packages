/**
 * 引数を持たない関数の戻り値をメモ化する。
 * @param target メモ化する関数
 * @returns メモ化された関数
 */
export function procrastinate<T extends { (): any }>(target: T) {
  /** キャッシュ */
  let cache: ReturnType<T> | null = null;
  return function () {
    cache ??= target();
    return cache;
  };
}
