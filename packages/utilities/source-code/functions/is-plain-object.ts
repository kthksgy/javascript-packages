/**
 * オブジェクトがプレーンオブジェクトである場合、`true`を返す。
 * @param target オブジェクト
 * @returns オブジェクトがプレーンオブジェクトである場合、`true`
 */
export function isPlainObject(target: unknown) {
  if (target === null || typeof target !== "object") {
    return false;
  }

  const constructor = target.constructor;
  if (constructor === undefined) {
    return true;
  }

  const prototype = constructor.prototype;
  if (
    prototype === null ||
    typeof prototype !== "object" ||
    !Object.hasOwn(prototype, "isPrototypeOf")
  ) {
    return false;
  }

  return true;
}
