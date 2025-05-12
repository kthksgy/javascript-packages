import { useRef } from "react";

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
  const reference = useRef<readonly [Data | undefined, Data]>([undefined, next]);

  const current = reference.current[1];
  if (!isSame(current, next)) {
    reference.current = [current, next];
  }

  return reference.current[0];
}
