/**
 * キャメルケースをケバブケースに変換する。
 * @param camel 次に示すケースの文字列
 * - キャメルケース (`camelCase`)
 * - パスカルケース (`PascalCase`)
 * @returns ケバブケースの文字列
 * - `camel-case`
 * - `pascal-case`
 *
 * @example
 * ```typescript
 * fromCamelToKebab("userName"); // "user-name"
 * fromCamelToKebab("UserName"); // "user-name"
 * fromCamelToKebab("targetUrl"); // "target-url"
 * fromCamelToKebab("targetURL"); // "target-u-r-l"
 * ```
 */
export function fromCamelToKebab(camel: string) {
  return camel.replace(/(?!^)[A-Z]/g, "-$&").toLowerCase();
}
