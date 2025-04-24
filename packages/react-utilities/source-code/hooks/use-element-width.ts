import { useEffect, useState } from "react";

/**
 * 要素の高さを監視する。
 * @param reference 要素の参照
 * @returns 要素の高さ
 */
export function useElementWidth<T extends HTMLElement>(reference: React.RefObject<T | null>) {
  const [width, setWidth] = useState(0);
  useEffect(
    function () {
      const observer = new ResizeObserver(function (entries) {
        const entry = entries.at(0);
        if (entry) {
          const { width } = entry.contentRect;
          setWidth(width);
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
  return width;
}
