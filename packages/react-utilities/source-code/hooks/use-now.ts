import { useEffect, useState } from "react";
import { Temporal } from "temporal-polyfill";

/**
 * 現在の日時を取得する。
 * @param interval 現在の日時を更新する間隔[秒]
 * @returns 現在の日時
 */
export function useNow<TSeconds extends number>(interval?: TSeconds) {
  const [now, setNow] = useState(function () {
    return Temporal.Now.zonedDateTimeISO();
  });

  useEffect(
    function () {
      if (typeof interval === "number" && interval > 0) {
        const loop = setInterval(function () {
          setNow(Temporal.Now.zonedDateTimeISO());
        }, interval * 1000);
        return function () {
          clearInterval(loop);
        };
      }
    },
    [interval],
  );

  return now;
}
