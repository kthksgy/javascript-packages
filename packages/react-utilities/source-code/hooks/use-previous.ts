import { useEffect, useRef, useState } from "react";

/**
 * 一つ前の値を取得する。
 * @param next 現在の値
 * @param isSame `current`と`next`が等しい場合は`true`を返す比較関数
 * @returns `[temporary, setTemporary, transitioning]`
 *
 * @example
 * ```typescript
 * const previous = usePrevious(
 *   current,
 *   function (current, next) {
 *     return current === next;
 *   },
 * );
 * ```
 */
export function usePrevious<Data>(
  next: Data,
  isSame: { (current: Data, next: Data): boolean } = Object.is,
) {
  const isSameReference = useRef(isSame);
  isSameReference.current = isSame;
  const [[previous], setData] = useState<readonly [Data | undefined, Data]>([undefined, next]);

  useEffect(
    function () {
      setData(function (data) {
        const [, current] = data;
        return isSameReference.current(current, next) ? data : [current, next];
      });
    },
    [next],
  );

  return previous;
}
