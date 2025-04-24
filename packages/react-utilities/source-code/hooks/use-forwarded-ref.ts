import { type ForwardedRef, useImperativeHandle, useRef } from "react";

/**
 * フォワードされた参照を自コンポーネントでも使用可能にする。
 * @param forwardedRef フォワードされた参照
 * @returns 参照
 */
export function useForwardedRef<T>(forwardedRef: ForwardedRef<T>) {
  const ref = useRef<T>(null);
  useImperativeHandle(forwardedRef, () => ref.current!, []);
  return ref;
}
