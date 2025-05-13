import { useEffect, useState } from "react";

function getFocus() {
  return typeof document !== "undefined" && document.hasFocus();
}

/**
 * ウィンドウがフォーカスされているかどうかを取得する。
 * @returns ウィンドウがフォーカスされている場合、`true`
 */
export function useWindowFocus() {
  const [focus, setFocus] = useState(getFocus);

  useEffect(function () {
    function blur() {
      setFocus(false);
    }
    function focus() {
      setFocus(true);
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
