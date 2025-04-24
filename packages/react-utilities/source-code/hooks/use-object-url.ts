import { useEffect, useState } from "react";

/** オブジェクトURLを取得する。 */
export function useObjectUrl(object: Blob | null | undefined) {
  const [objectUrl, setObjectUrl] = useState<string>();
  useEffect(
    function () {
      if (object) {
        const objectUrl = URL.createObjectURL(object);
        setObjectUrl(objectUrl);
        return function () {
          URL.revokeObjectURL(objectUrl);
        };
      } else {
        setObjectUrl(undefined);
      }
    },
    [object],
  );
  return objectUrl;
}
