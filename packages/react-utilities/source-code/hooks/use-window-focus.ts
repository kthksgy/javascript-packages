import { useEffect, useState } from "react";

function getInitialFocus() {
  return [typeof document !== "undefined" && document.hasFocus(), Date.now()] as const;
}

/**
 * ウィンドウがフォーカスされているかどうかを取得する。
 * @returns ウィンドウがフォーカスされている場合、`true`
 */
export function useWindowFocus() {
  const [[focus], setFocus] = useState(getInitialFocus);

  useEffect(function () {
    function blur(event: UIEvent) {
      setFocus(function (data) {
        return event.timeStamp >= data[1] ? [false, event.timeStamp] : data;
      });
    }
    function focus(event: UIEvent) {
      setFocus(function (data) {
        return event.timeStamp >= data[1] ? [true, event.timeStamp] : data;
      });
    }

    window.addEventListener("blur", blur);
    window.addEventListener("focus", focus);

    return function () {
      window.removeEventListener("blur", blur);
      window.removeEventListener("focus", focus);
    };
  }, []);

  return focus;
}
