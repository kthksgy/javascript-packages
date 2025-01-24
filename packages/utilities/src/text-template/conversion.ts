/**
 * `convertPathTemplateIntoStringTemplate`関数のアウトプット
 */
export type FromPathPatternToStringTemplateOutput<
  T extends string,
  KeyPrefix extends string,
  KeySuffix extends string = "",
> = T extends `${infer Former}/${infer Latter}`
  ? `${FromPathPatternToStringTemplateOutput<Former, KeyPrefix, KeySuffix>}/${FromPathPatternToStringTemplateOutput<Latter, KeyPrefix, KeySuffix>}`
  : T extends `${KeyPrefix}${infer Key}${KeySuffix}`
    ? `%${Key}%`
    : T;

/**
 * @deprecated `FromPathPatternToStringTemplateOutput`に置き換えられました。
 */
export type ConvertPathTemplateIntoStringTemplateOutput<
  T extends string,
  KeyPrefix extends string,
  KeySuffix extends string = "",
> = FromPathPatternToStringTemplateOutput<T, KeyPrefix, KeySuffix>;

/** 正規表現の特殊文字の正規表現 */
const specialCharacterRegularExpression = /[$()*+.?[\\\]^{|}]/g;

/** パステンプレートキーの正規表現 */
const pathTemplateKeyRegularExpressions = new Map<`${string} ${string}`, RegExp>();

/**
 * パスパターンキーの正規表現を作成する。
 * @param keyPrefix キーのプレフィックス
 * @param keySuffix キーのサフィックス
 * @returns 正規表現
 */
export function createPathPatternKeyRegularExpression<
  KeyPrefix extends string,
  KeySuffix extends string = "",
>(keyPrefix: KeyPrefix, keySuffix: KeySuffix = <KeySuffix>"") {
  const key: `${string} ${string}` = `${keyPrefix} ${keySuffix}`;
  let pathTemplateKeyRegularExpression = pathTemplateKeyRegularExpressions.get(key);
  if (!pathTemplateKeyRegularExpression) {
    pathTemplateKeyRegularExpression = new RegExp(
      "(?<=^|/)" +
        keyPrefix.replace(specialCharacterRegularExpression, "\\$&") +
        "([^/]*)" +
        keySuffix.replace(specialCharacterRegularExpression, "\\$&"),
      "g",
    );
    pathTemplateKeyRegularExpressions.set(key, pathTemplateKeyRegularExpression);
  }
  return pathTemplateKeyRegularExpression;
}

/**
 * @deprecated `createPathPatternKeyRegularExpression`に置き換えられました。
 */
export const createPathTemplateKeyRegularExpression = createPathPatternKeyRegularExpression;

/**
 * パスパターンをテキストテンプレートに変換する。
 * @param pathPattern パスパターン(例: `/a/$b/c/$d`, `/a/:b:/c/:d:`)
 * @param keyPrefix キーのプレフィックス(例: `$`, `:`)
 * @param keySuffix キーのサフィックス(例: 空文字, `:`)
 * @returns テキストテンプレート(例: `/a/%b%/c/%d%`, `/a/%b%/c/%d%`)
 *
 * @example
 * ```typescript
 * // `"/users/%userId%/articles/%articleId%""`
 * convertPathTemplateIntoStringTemplate(
 *   '/users/$userId/articles/$articleId', '$',
 * );
 * ```
 *
 * @example
 * ```typescript
 * // `"/users/%userId%/articles/%articleId%""`
 * convertPathTemplateIntoStringTemplate(
 *   '/users/:userId:/articles/:articleId:', ':', ':',
 * );
 * ```
 */
export function fromPathPatternToTextTemplate<
  T extends string,
  KeyPrefix extends string,
  KeySuffix extends string = "",
>(pathPattern: T, keyPrefix: KeyPrefix, keySuffix = <KeySuffix>"") {
  return pathPattern.replace(
    createPathPatternKeyRegularExpression(keyPrefix, keySuffix),
    replacer,
  ) as FromPathPatternToStringTemplateOutput<T, KeyPrefix, KeySuffix>;
}

/**
 * @deprecated `fromPathPatternToTextTemplate`に置き換えられました。
 */
export const convertPathTemplateIntoStringTemplate = fromPathPatternToTextTemplate;

function replacer(_: any, key: string) {
  return "%" + key + "%";
}
