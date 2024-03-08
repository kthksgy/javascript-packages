/**
 * 引数を持たない関数の戻り値をメモ化する。
 * 戻り値は`null`や`undefined`である場合は使用できない。
 * @param target メモ化する関数
 * @returns メモ化された関数
 */
export function procrastinate<T extends { (): any }>(target: T) {
  /** キャッシュ */
  let cache: ReturnType<T>;
  return function () {
    cache ??= target();
    return cache;
  };
}
