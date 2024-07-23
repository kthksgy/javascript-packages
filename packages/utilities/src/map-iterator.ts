import { isIterable } from './is-iterable';

/**
 * イテレーターをマップする。
 * @param iterableOrIterator イテラブルまたはイテレーター
 * @param map マップ関数
 * @returns 新しいイテラブル
 *
 * `Iterator.prototype.map()`が標準化された場合はそれを使う。
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator/map
 */
export function mapIterator<TInput, TOutput>(
  iterableOrIterator: Iterable<TInput> | Iterator<TInput>,
  map: { (value: TInput): TOutput },
) {
  const iterator = isIterable(iterableOrIterator)
    ? iterableOrIterator[Symbol.iterator]()
    : iterableOrIterator;

  function next() {
    const { done, value } = iterator.next();
    if (!done || value !== undefined) {
      return { done, value: map(value) };
    } else {
      return { done, value };
    }
  }

  return {
    next,
    [Symbol.iterator]() {
      return { next };
    },
  };
}
