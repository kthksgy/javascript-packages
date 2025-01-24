import { isIterable } from "./is-iterable";

/**
 * イテレーターの少なくとも1つの値が条件を満たすか検証する。
 * @param iterableOrIterator イテラブルまたはイテレーター
 * @param validate 検証関数
 * @returns `true`または`false`
 *
 * `Iterator.prototype.some()`が標準化された場合はそれを使う。
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator/filter
 */
export function isSomeValueOfIterator<T>(
  iterableOrIterator: Iterable<T> | Iterator<T>,
  validate: { (value: T): boolean },
) {
  const iterator = isIterable(iterableOrIterator)
    ? iterableOrIterator[Symbol.iterator]()
    : iterableOrIterator;

  for (;;) {
    const { done, value } = iterator.next();
    if (!done || value !== undefined) {
      if (validate(value)) {
        return true;
      }
      if (done) {
        break;
      }
    } else {
      break;
    }
  }

  return false;
}
