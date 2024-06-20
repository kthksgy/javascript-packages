/**
 * 関数の戻り値をメモ化する。
 * @param target メモ化する関数
 * @param identifier 引数をメモ化のキーに変換する関数
 * @returns メモ化された関数
 */
export function memoize<Inputs extends Array<any>, Output, Key>(
  target: { (...inputs: Inputs): Output },
  identifier: { (...inputs: Inputs): Key },
) {
  const caches = new Map<Key, Output>();

  function memoized(...inputs: Inputs): Output {
    const key = identifier(...inputs);
    if (caches.has(key)) {
      return caches.get(key)!;
    } else {
      const value = target(...inputs);
      caches.set(key, value);
      return value;
    }
  }
  memoized.clear = function () {
    caches.clear();
  };

  return memoized;
}
