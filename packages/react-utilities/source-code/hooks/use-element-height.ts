import { useEffect, useState } from "react";

/**
 * 要素の高さを監視する。
 * @param reference 要素の参照
 * @returns 要素の高さ
 */
export function useElementHeight<T extends HTMLElement>(reference: React.RefObject<T | null>) {
  const [height, setheight] = useState(0);
  useEffect(
    function () {
      const observer = new ResizeObserver(function (entries) {
        const entry = entries.at(0);
        if (entry) {
          const { height } = entry.contentRect;
          setheight(height);
        }
      });
      const { current: element } = reference;
      if (element) {
        observer.observe(element);
      }
      return function () {
        observer.disconnect();
      };
    },
    [reference],
  );
  return height;
}
