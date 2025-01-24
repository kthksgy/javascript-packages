import { isIterable } from "./is-iterable";

/**
 * イテレーターをフィルターする。
 * @param iterableOrIterator イテラブルまたはイテレーター
 * @param filter マップ関数
 * @returns 新しいイテラブル
 *
 * `Iterator.prototype.filter()`が標準化された場合はそれを使う。
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator/filter
 */
export function filterIterator<T>(
  iterableOrIterator: Iterable<T> | Iterator<T>,
  filter: { (value: T): boolean },
) {
  const iterator = isIterable(iterableOrIterator)
    ? iterableOrIterator[Symbol.iterator]()
    : iterableOrIterator;

  function next() {
    for (;;) {
      const { done, value } = iterator.next();
      if (!done || value !== undefined) {
        if (filter(value)) {
          return { done, value };
        }
        if (done) {
          break;
        }
      } else {
        break;
      }
    }
    return { done: true };
  }

  return {
    next,
    [Symbol.iterator]() {
      return { next };
    },
  };
}
