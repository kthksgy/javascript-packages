/**
 * 非同期関数内で一定時間待機する。
 * @param milliseconds 待機時間(ミリ秒)
 */
export async function sleep(milliseconds: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, milliseconds);
  });
}
