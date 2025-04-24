import { useEffect, useState } from "react";

export function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(function () {
    function handler(event: UIEvent) {
      if (event.view !== null) {
        setWidth(event.view.innerWidth);
      }
    }
    window.addEventListener("resize", handler);
    return function () {
      window.removeEventListener("resize", handler);
    };
  }, []);
  return width;
}
