/**
 * 最後のテキストテンプレートキー
 * テキストテンプレートの最後のキーを抽出する。
 * キーが存在しない場合は`null`を返す。
 */
export type LastTextTemplateKey<T extends string> =
  TextTemplateKeys<T> extends [infer Key]
    ? Key extends string
      ? Key
      : null
    : TextTemplateKeys<T> extends [...Array<string>, infer Key]
      ? Key extends string
        ? Key
        : null
      : null;

/**
 * @deprecated `LastTextTemplateKey`に置き換えられました。
 */
export type LastStringTemplateKey<T extends string> = LastTextTemplateKey<T>;

/**
 * テキストテンプレートキー
 * テキストに含まれる`{key}`の`key`を抽出する。
 * `key`は正規表現`[^{}]+`にマッチする必要がある。
 */
export type TextTemplateKey<S extends string> = TextTemplateKeys<S>[number];

/**
 * @deprecated `TextTemplateKey`に置き換えられました。
 */
export type StringTemplateKey<S extends string> = TextTemplateKey<S>;

/**
 * テキストテンプレートキータプル
 * テキストに含まれる`{key}`の`key`を抽出し、先頭から末尾への出現順でタプルにする。
 * `key`は正規表現`[^{}]+`にマッチする必要がある。
 */
export type TextTemplateKeys<T extends string> = T extends `${string}{${infer Key}}${infer Suffix}`
  ? Key extends ""
    ? TextTemplateKeys<Suffix>
    : Key extends `${string}{${infer Key}`
      ? [Key, ...TextTemplateKeys<Suffix>]
      : [Key, ...TextTemplateKeys<Suffix>]
  : [];

/**
 * @deprecated `TextTemplateKeyTuple`に置き換えられました。
 */
export type TextTemplateKeyTuple<T extends string> = TextTemplateKeys<T>;

/**
 * @deprecated `TextTemplateKeyTuple`に置き換えられました。
 */
export type StringTemplateKeyTuple<T extends string> = TextTemplateKeys<T>;

/**
 * テキストテンプレートパラメーター
 */
export type TextTemplateParameters<T extends string, Value = any> = Record<
  TextTemplateKey<T>,
  Value
>;

/**
 * @deprecated `TextTemplateParameters`に置き換えられました。
 */
export type StringTemplateParameters<T extends string, Value = any> = TextTemplateParameters<
  T,
  Value
>;

/**
 * テキストテンプレートタイプ
 * テキストテンプレートと等価なテンプレートリテラルを作成する。
 */
export type TextTemplateType<T extends string> =
  T extends `${infer Former}{${infer Key}}${infer Latter}`
    ? Key extends ""
      ? `${Former}${TextTemplateType<Latter>}`
      : Key extends `${infer Prefix}{${string}`
        ? `${Former}{${Prefix}${string}${TextTemplateType<Latter>}`
        : `${Former}${string}${TextTemplateType<Latter>}`
    : T;

/**
 * @deprecated `TextTemplateType`に置き換えられました。
 */
export type StringTemplateType<T extends string> = TextTemplateType<T>;

/** キー(`{key}`)の正規表現 */
const keyRegularExpression = /\{([^{}]*)\}/g;
/** テキストテンプレートに対応するマッチャー */
const matchers = new Map<string, RegExp>();

/**
 * テキストテンプレートに対応する正規表現を作成する。
 * @param textTemplate テキストテンプレート(例: `"/users/{userId}/articles/{articleId}"`)
 * @returns 正規表現
 */
export function createTextTemplateRegularExpression(textTemplate: string) {
  let matcher = matchers.get(textTemplate);
  if (!matcher) {
    matcher = new RegExp(
      `^${textTemplate
        .replace(/[$()*+.?[\\\]^|]/g, "\\$&")
        .replace(keyRegularExpression, parseStringReplacer)}$`,
    );
    matchers.set(textTemplate, matcher);
  }
  return matcher;
}

/**
 * @deprecated `createTextTemplateRegularExpression`に置き換えられました。
 */
export const createMatcher = createTextTemplateRegularExpression;

/**
 * テキストテンプレートを用いて文字列を作成する。
 * @param textTemplate テキストテンプレート(例: `"/users/{userId}/articles/{articleId}"`)
 * @param parameters パラメーター(例: `{ articleId: "1234", userId: "abcd" }`)
 * @param strict `parameters`に存在しないキーがある場合に例外を発生させる場合、`true`
 * @returns 文字列(例: `"/users/abcd/articles/1234"`)
 */
export function createString<T extends string>(
  textTemplate: T,
  parameters: TextTemplateParameters<T>,
  strict = false,
) {
  return textTemplate.replace(keyRegularExpression, function (_, key: string) {
    if (key.length > 0) {
      let parameter = parameters[key as TextTemplateKey<T>];
      parameter ??= key.split(".").reduce<any>(createStringReducer, parameters);
      if (parameter !== undefined) {
        return String(parameter);
      } else {
        if (strict) {
          throw new Error(`"${key}" is not defined in parameters.`);
        } else {
          return "{" + key + "}";
        }
      }
    } else {
      return "";
    }
  }) as TextTemplateType<T>;
}

function createStringReducer(parameters: any, key: string) {
  return parameters?.[key];
}

/**
 * テキストテンプレートを用いて文字列を厳密に作成する。
 * @param textTemplate テキストテンプレート(例: `"/users/%userId%/articles/%articleId%"`)
 * @param parameters パラメーター(例: `{ articleId: "1234", userId: "abcd" }`)
 * @returns 文字列(例: `"/users/abcd/articles/1234"`)
 */
export function createStringStrictly<T extends string>(
  textTemplate: T,
  parameters: TextTemplateParameters<T>,
) {
  return createString(textTemplate, parameters, true);
}

/**
 * 最後のテキストテンプレートキーを抽出する。
 * @param textTemplate テキストテンプレート
 * @returns 最後のキー(キーが存在しない場合は`null`)
 */
export function getLastTextTemplateKey<T extends string>(textTemplate: T): LastTextTemplateKey<T> {
  const keys = getTextTemplateKeys(textTemplate);
  return (keys.length > 0 ? keys[keys.length - 1] : null) as LastTextTemplateKey<T>;
}

/**
 * @deprecated `getLastTextTemplateKey`に置き換えられました。
 */
export const getLastStringTemplateKey = getLastTextTemplateKey;

/**
 * テキストテンプレートからキーを抽出する。
 * @param textTemplate テキストテンプレート
 * @returns キー配列(先頭から末尾への出現順)
 */
export function getTextTemplateKeys<T extends string>(textTemplate: T): TextTemplateKeys<T> {
  // TODO: 処理速度を改善する。
  return Array.from(textTemplate.matchAll(keyRegularExpression), function ([, key]) {
    return key;
  }).filter(function (key) {
    return key !== "";
  }) as TextTemplateKeys<T>;
}

/**
 * @deprecated `getTextTemplateKeys`に置き換えられました。
 */
export const getStringTemplateKeys = getTextTemplateKeys;

/**
 * テキストテンプレートを用いて文字列を解析する。
 * @param textTemplate テキストテンプレート(例: `"/users/%userId%/articles/%articleId%"`)
 * @param target 対象の文字列(例: `"/users/abcd/articles/1234"`)
 * @returns パラメーター(例: `{ articleId: "1234", userId: "abcd" }`)
 */
export function parseString<T extends string>(textTemplate: T, target: string) {
  /** 照合配列 */
  const array = target.match(createTextTemplateRegularExpression(textTemplate));
  /** 解析結果 */
  const result = Object.fromEntries(
    Array.from(textTemplate.matchAll(keyRegularExpression), function ([, key]) {
      return [key, array?.groups?.[key] ?? null] as const;
    }),
  );
  // `%%`パターンを削除する。
  delete result[""];
  return result as TextTemplateParameters<T, string | null>;
}

function parseStringReplacer(_: string, key: string) {
  return key.length > 0 ? `(?<${key}>.*)` : "";
}

/**
 * テキストテンプレートを用いて文字列を厳密に解析する。
 * @param textTemplate テキストテンプレート(例: `"/users/{userId}/articles/%articleId%"`)
 * @param target 対象の文字列(例: `"/users/abcd/articles/1234"`)
 * @returns パラメーター(例: `{ articleId: "1234", userId: "abcd" }`)
 *
 * @throws {Error} テキストテンプレートに文字列が合致しない場合
 */
export function parseStringStrictly<T extends string>(textTemplate: T, target: string) {
  const result = parseString(textTemplate, target);
  for (const [key, value] of Object.entries(result)) {
    if (value === null) {
      throw new Error(
        `"${target}" does not match '${textTemplate}', because "${key}" is not found.`,
      );
    }
  }
  return result as TextTemplateParameters<T, string>;
}
