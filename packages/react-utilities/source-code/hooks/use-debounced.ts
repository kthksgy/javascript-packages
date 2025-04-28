import { useEffect, useRef, useState } from "react";

/**
 * 値をデバウンスする。
 * @param next 値
 * @param delay 値を更新するまでの遅延時間[ミリ秒]
 * @param isSame `previous`と`next`が等しい場合は`true`を返す比較関数
 * @returns 生成関数の値
 *
 * @example
 * ```typescript
 * const y = useDebounced(
 *   x + 1,
 *   3000,
 *   useCallback(function (previous, next) {
 *     return previous === next;
 *   }, []),
 * );
 * ```
 */
export function useDebounced<Data>(
  next: Data,
  delay: number,
  isSame: { (previous: Data, next: Data): boolean } = Object.is,
) {
  const isSameReference = useRef(isSame);
  isSameReference.current = isSame;

  const timer = useRef<ReturnType<typeof setTimeout>>();
  const [previous, setPrevious] = useState(next);

  useEffect(
    function () {
      if (timer.current !== undefined) {
        clearTimeout(timer.current);
      }
      if (!isSameReference.current(previous, next)) {
        timer.current = setTimeout(function () {
          setPrevious(next);
        }, delay);
      } else {
        timer.current = undefined;
      }
    },
    [delay, next, previous],
  );

  return previous;
}
