/**
 * キャメルケースをケバブケースに変換する。
 * ロウワーキャメルケースでもアッパーキャメルケースでも変換できる。
 * @param camel キャメルケースの文字列(`lowerCamel`や`UpperCamel`など)
 * @returns ケバブケースの文字列(`lower-camel`や`upper-camel`など)
 *
 * @example
 * ```typescript
 * fromCamelToKebab("lowerCamel"); // "lower-camel"
 * fromCamelToKebab("UpperCamel"); // "upper-camel"
 * fromCamelToKebab("targetUrl"); // "target-url"
 * fromCamelToKebab("targetURL"); // "target-u-r-l"
 * ```
 */
export function fromCamelToKebab(camel: string) {
  return camel.replace(/(?!^)[A-Z]/g, "-$&").toLowerCase();
}
