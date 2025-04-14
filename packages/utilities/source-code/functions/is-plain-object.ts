/**
 * オブジェクトがプレーンオブジェクトである場合、`true`を返す。
 * @param target オブジェクト
 * @returns オブジェクトがプレーンオブジェクトである場合、`true`
 */
export function isPlainObject<T>(
  target: T,
): target is Extract<T extends Partial<Record<any, any>> ? T : Partial<Record<any, any>>, T> {
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
