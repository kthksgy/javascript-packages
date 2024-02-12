export type ConvertStringTemplatePatternA<T extends string> = ConvertStringTemplatePatternPath<
  T,
  '$'
>;

export type ConvertStringTemplatePatternB<T extends string> = ConvertStringTemplatePatternPath<
  T,
  ':'
>;

export type ConvertStringTemplatePatternPath<
  T extends string,
  KeyPrefix extends string,
> = T extends `${KeyPrefix}${infer Key}/${infer Suffix}`
  ? `%${Key}%/${ConvertStringTemplatePatternPath<Suffix, KeyPrefix>}`
  : T extends `${infer Prefix}/${KeyPrefix}${infer Key}/${infer Suffix}`
    ? `${Prefix}/%${Key}%/${ConvertStringTemplatePatternPath<Suffix, KeyPrefix>}`
    : T extends `${infer Prefix}/${KeyPrefix}${infer Key}`
      ? `${Prefix}/%${Key}%`
      : T;

/**
 * 文字列テンプレートを変換する。
 *
 * @example
 * ```typescript
 * // `/users/%userId%/articles/%articleId%`
 * convertStringTemplate('a', '/users/$userId/articles/$articleId');
 * ```
 */
export function convertStringTemplate<T extends string>(
  template: T,
  pattern: 'A',
): ConvertStringTemplatePatternA<T>;

/**
 * 文字列テンプレートを変換する。
 *
 * @example
 * ```typescript
 * // `/users/%userId%/articles/%articleId%`
 * convertStringTemplate('a', '/users/$userId/articles/$articleId');
 * ```
 */
export function convertStringTemplate<T extends string>(
  template: T,
  pattern: 'B',
): ConvertStringTemplatePatternB<T>;

/**
 * 文字列テンプレートを
 * @param pattern 元の文字列テンプレートのパターン
 * @param template 文字列テンプレート
 * @returns 文字列テンプレート
 */
export function convertStringTemplate<T extends string>(template: T, pattern: 'A' | 'B') {
  switch (pattern) {
    case 'A':
      return template.replace(
        /\$([^/]*)/g,
        convertStringTemplateReplacer,
      ) as ConvertStringTemplatePatternA<T>;
    case 'B':
      return template.replace(
        /:([^/]*)/g,
        convertStringTemplateReplacer,
      ) as ConvertStringTemplatePatternA<T>;
    default:
      throw new Error(`Unknown string template pattern: "${pattern}"`);
  }
}

function convertStringTemplateReplacer(_: any, key: string) {
  return '%' + key + '%';
}
