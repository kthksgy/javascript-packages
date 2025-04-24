import { useEffect, useRef, useState } from "react";

export function useDataUrl(
  data: Blob | HTMLCanvasElement | null | undefined,
  options?: { mediaType?: string; quality?: number },
) {
  const generation = useRef(0);
  const [dataUrl, setDataUrl] = useState<string>();
  useEffect(
    function () {
      const currentGeneration = ++generation.current;
      if (data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = function () {
          if (currentGeneration === generation.current) {
            setDataUrl(reader.result as string);
          }
        };
        reader.readAsDataURL(data);
      } else if (data instanceof HTMLCanvasElement) {
        setDataUrl(data.toDataURL(options?.mediaType, options?.quality));
      }
    },
    [options?.mediaType, options?.quality, data],
  );
  return dataUrl;
}
