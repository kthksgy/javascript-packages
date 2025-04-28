import { useEffect, useMemo, useRef, useState } from "react";

/**
 * 楽観的な更新を行うために一時的な値を取得する。
 * @param authoritative 値
 * @param isSame `authoritative`と`temporary`が等しい場合は`true`を返す比較関数
 * @returns `[temporary, setTemporary, transitioning]`
 *
 * @example
 * ```typescript
 * const [temporaryData, setTemporaryData, transitioning] = useTemporary(
 *   authoritativeData,
 *   function (previous, next) {
 *     return previous === next;
 *   },
 * );
 * ```
 */
export function useTemporary<Data>(
  authoritative: Data,
  isSame: { (previous: Data, next: Data): boolean } = Object.is,
) {
  const isSameReference = useRef(isSame);
  isSameReference.current = isSame;

  const [temporary, setTemporary] = useState(authoritative);

  useEffect(
    function () {
      setTemporary(function (temporary) {
        return isSameReference.current(temporary, authoritative) ? temporary : authoritative;
      });
    },
    [authoritative],
  );

  return useMemo(
    function () {
      return [temporary, setTemporary, !isSameReference.current(temporary, authoritative)] as const;
    },
    [authoritative, temporary],
  );
}
