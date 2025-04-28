import { useEffect, useRef, useState } from "react";

/**
 * 一つ前の値を取得する。
 * @param next 現在の値
 * @param isSame `authoritative`と`temporary`が等しい場合は`true`を返す比較関数
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
  const initializedReference = useRef(false);
  useEffect(function () {
    initializedReference.current = true;
  }, []);
  const initialized = initializedReference.current;

  const isSameReference = useRef(isSame);
  isSameReference.current = isSame;
  const [[previous], setPrevious] = useState<readonly [Data | undefined, Data]>([undefined, next]);

  useEffect(
    function () {
      if (initialized) {
        return;
      }

      setPrevious(function ([previous, current]) {
        return isSameReference.current(current, next) ? [previous, current] : [current, next];
      });
    },
    [next, initialized, previous],
  );

  return previous;
}
