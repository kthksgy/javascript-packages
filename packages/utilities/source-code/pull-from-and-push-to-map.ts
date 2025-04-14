/**
 * マップから指定したエントリを削除し、エントリをもう一度追加する。
 * エントリの順序を末尾に移動しつつエントリを更新したい場合に使用する。
 * @param map マップ
 * @param key キー
 * @param value 値
 * @returns `map`
 */
export function pullFromAndPushToMap<K, V>(map: Map<K, V>, key: K, value: V) {
  map.delete(key);
  return map.set(key, value);
}
