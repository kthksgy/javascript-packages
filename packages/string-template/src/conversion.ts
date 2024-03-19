/**
 * `convertPathTemplateIntoStringTemplate`関数のアウトプット
 */
export type ConvertPathTemplateIntoStringTemplateOutput<
  T extends string,
  KeyPrefix extends string,
  KeySuffix extends string = '',
> = T extends `${infer Former}/${infer Latter}`
  ? `${ConvertPathTemplateIntoStringTemplateOutput<Former, KeyPrefix, KeySuffix>}/${ConvertPathTemplateIntoStringTemplateOutput<Latter, KeyPrefix, KeySuffix>}`
  : T extends `${KeyPrefix}${infer Key}${KeySuffix}`
    ? `%${Key}%`
    : T;

/** 正規表現の特殊文字の正規表現 */
const specialCharacterRegularExpression = /[$()*+.?[\\\]^{|}]/g;

/** パステンプレートキーの正規表現 */
const pathTemplateKeyRegularExpressions = new Map<`${string} ${string}`, RegExp>();

/**
 * パステンプレートキーの正規表現を作成する。
 * @param keyPrefix キーのプレフィックス
 * @param keySuffix キーのサフィックス
 * @returns 正規表現
 */
export function createPathTemplateKeyRegularExpression<
  KeyPrefix extends string,
  KeySuffix extends string = '',
>(keyPrefix: KeyPrefix, keySuffix: KeySuffix = <KeySuffix>'') {
  const key: `${string} ${string}` = `${keyPrefix} ${keySuffix}`;
  let pathTemplateKeyRegularExpression = pathTemplateKeyRegularExpressions.get(key);
  if (!pathTemplateKeyRegularExpression) {
    pathTemplateKeyRegularExpression = new RegExp(
      '(?<=^|/)' +
        keyPrefix.replace(specialCharacterRegularExpression, '\\$&') +
        '([^/]*)' +
        keySuffix.replace(specialCharacterRegularExpression, '\\$&'),
      'g',
    );
    pathTemplateKeyRegularExpressions.set(key, pathTemplateKeyRegularExpression);
  }
  return pathTemplateKeyRegularExpression;
}

/**
 * パステンプレートを文字列テンプレートに変換する。
 * @param template パステンプレート(例: `/a/$b/c/$d`, `/a/:b:/c/:d:`)
 * @param keyPrefix キーのプレフィックス(例: `$`, `:`)
 * @param keySuffix キーのサフィックス(例: 空文字, `:`)
 * @returns 文字列テンプレート(例: `/a/%b%/c/%d%`, `/a/%b%/c/%d%`)
 *
 * @example
 * ```typescript
 * // `/users/%userId%/articles/%articleId%`
 * convertPathTemplateIntoStringTemplate(
 *   '/users/$userId/articles/$articleId', '$',
 * );
 * ```
 *
 * @example
 * ```typescript
 * // `/users/%userId%/articles/%articleId%`
 * convertPathTemplateIntoStringTemplate(
 *   '/users/:userId:/articles/:articleId:', ':', ':',
 * );
 * ```
 */
export function convertPathTemplateIntoStringTemplate<
  T extends string,
  KeyPrefix extends string,
  KeySuffix extends string = '',
>(template: T, keyPrefix: KeyPrefix, keySuffix = <KeySuffix>'') {
  return template.replace(
    createPathTemplateKeyRegularExpression(keyPrefix, keySuffix),
    replacer,
  ) as ConvertPathTemplateIntoStringTemplateOutput<T, KeyPrefix, KeySuffix>;
}

function replacer(_: any, key: string) {
  return '%' + key + '%';
}
