import { useEffect, useState } from "react";

export function useWindowHeight() {
  const [height, setHeight] = useState(window.innerHeight);
  useEffect(function () {
    function handler(event: UIEvent) {
      if (event.view !== null) {
        setHeight(event.view.innerHeight);
      }
    }
    window.addEventListener("resize", handler);
    return function () {
      window.removeEventListener("resize", handler);
    };
  }, []);
  return height;
}
