import { useEffect, useRef, useState } from "react";

/**
 * 値をスロットルする。
 * @param next 値
 * @param delay 値が更新可能になるまでの遅延時間[ミリ秒]
 * @param isSame `previous`と`next`が等しい場合は`true`を返す比較関数
 * @returns 生成関数の値
 *
 * @example
 * ```typescript
 * const y = useThrottled(
 *   x + 1,
 *   3000,
 *   function (previous, next) {
 *     return previous === next;
 *   },
 * );
 * ```
 */
export function useThrottled<Data>(
  next: Data,
  delay: number,
  isSame: { (previous: Data, next: Data): boolean } = Object.is,
) {
  const isSameReference = useRef(isSame);
  isSameReference.current = isSame;

  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [previous, setPrevious] = useState(next);
  const [throttling, setThrottling] = useState(false);

  useEffect(
    function () {
      if (!throttling && !isSameReference.current(previous, next)) {
        setPrevious(next);
        setThrottling(true);
        timer.current = setTimeout(function () {
          setThrottling(false);
        }, delay);
      }
    },
    [delay, next, previous, throttling],
  );

  return previous;
}
