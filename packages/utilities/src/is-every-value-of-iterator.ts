import { isIterable } from './is-iterable';

/**
 * イテレーターの全ての値が条件を満たすか検証する。
 * @param iterableOrIterator イテラブルまたはイテレーター
 * @param validate 検証関数
 * @returns `true`または`false`
 *
 * `Iterator.prototype.every()`が標準化された場合はそれを使う。
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator/filter
 */
export function isEveryValueOfIterator<T>(
  iterableOrIterator: Iterable<T> | Iterator<T>,
  validate: { (value: T): boolean },
) {
  const iterator = isIterable(iterableOrIterator)
    ? iterableOrIterator[Symbol.iterator]()
    : iterableOrIterator;

  for (;;) {
    const { done, value } = iterator.next();
    if (!done || value !== undefined) {
      if (!validate(value)) {
        return false;
      }
      if (done) {
        break;
      }
    } else {
      break;
    }
  }

  return true;
}
