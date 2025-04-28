import { useEffect, useState } from "react";

/**
 * 最初の値を取得する。
 * @param current 現在の値
 * @returns 最初の値
 */
export function useInitial<Data>(current: Data | undefined) {
  const [initial, setInitial] = useState(current);

  useEffect(
    function () {
      setInitial(function (initial) {
        return initial === undefined ? current : initial;
      });
    },
    [current],
  );

  return initial;
}
