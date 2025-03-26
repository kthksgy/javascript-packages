/**
 * キャメルケースをスネークケースに変換する。
 * @param camel 次に示すケースの文字列
 * - キャメルケース (`camelCase`)
 * - パスカルケース (`PascalCase`)
 * @returns スネークケースの文字列
 * - `camel_case`
 * - `pascal_case`
 *
 * @example
 * ```typescript
 * fromCamelToSnake("userName"); // "user_name"
 * fromCamelToSnake("UserName"); // "user_name"
 * fromCamelToSnake("targetUrl"); // "target_url"
 * fromCamelToSnake("targetURL"); // "target_u_r_l"
 * ```
 */
export function fromCamelToSnake(camel: string) {
  return camel.replace(/(?!^)[A-Z]/g, "_$&").toLowerCase();
}
