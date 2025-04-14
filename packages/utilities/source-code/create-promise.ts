/**
 * `Promise`を作成する。`Promise.withResolvers()`が使用出来ない場合に使用する。
 * @returns `Promise<T>`
 */
export function createPromise<T>() {
  let reject: { (reason?: any): void };
  let resolve: { (value: T | PromiseLike<T>): void };
  const promise = new Promise<T>(function (_resolve, _reject) {
    reject = _reject;
    resolve = _resolve;
  });
  return { promise, reject: reject!, resolve: resolve! };
}
