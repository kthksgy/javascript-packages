/**
 * セットから指定したエントリを削除し、同じエントリをもう一度追加する。
 * エントリの順序を末尾に移動したい場合に使用する。
 * @param set セット
 * @param value 値
 * @returns `set`
 */
export function pullFromAndPushToSet<T>(set: Set<T>, value: T) {
  set.delete(value);
  return set.add(value);
}
