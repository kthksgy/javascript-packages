/**
 * 最後の文字列テンプレートキー
 * 文字列テンプレートの最後のキーを抽出する。
 * キーが存在しない場合は`null`を返す。
 */
export type LastStringTemplateKey<T extends string> =
  StringTemplateKeyTuple<T> extends [infer Key]
    ? Key extends string
      ? Key
      : null
    : StringTemplateKeyTuple<T> extends [...Array<string>, infer Key]
      ? Key extends string
        ? Key
        : null
      : null;

/**
 * 文字列テンプレートキー
 * 文字列に含まれる`%key%`の`key`を抽出する。
 * `%%`は半角パーセント記号(`U+25`, `%`)を表す。
 * `key`は正規表現`[^%]+`にマッチする必要がある。
 */
export type StringTemplateKey<S extends string> = StringTemplateKeyTuple<S>[number];

/**
 * 文字列テンプレートキータプル
 * 文字列に含まれる`%key%`の`key`を抽出し、先頭から末尾への出現順でタプルにする。
 * `key`は正規表現`[^%]+`にマッチする必要がある。
 */
export type StringTemplateKeyTuple<T extends string> =
  T extends `${string}%${infer Key}%${infer Suffix}`
    ? Key extends ''
      ? StringTemplateKeyTuple<Suffix>
      : [Key, ...StringTemplateKeyTuple<Suffix>]
    : [];

/**
 * 文字列テンプレートパラメーター
 */
export type StringTemplateParameters<T extends string, Value = any> = Record<
  StringTemplateKey<T>,
  Value
>;

/**
 * 文字列テンプレートタイプ
 * 文字列テンプレートの文字列リテラルをTypeScriptの型に変換する。
 */
export type StringTemplateType<T extends string> =
  T extends `${infer Former}%${infer Key}%${infer Latter}`
    ? Key extends ''
      ? `${Former}%%${StringTemplateType<Latter>}`
      : `${Former}${string}${StringTemplateType<Latter>}`
    : T;

/** キー(`%key%`)の正規表現 */
const keyRegularExpression = /%([^%]*)%/g;
/** 文字列テンプレートに対応するマッチャー */
const matchers = new Map<string, RegExp>();

/**
 * 文字列テンプレートに対応するマッチャーを作成する。
 * @param template 文字列テンプレート(例: `/users/%userId%/articles/%articleId%`)
 * @returns マッチャー
 */
export function createMatcher<T extends string>(template: T) {
  let matcher = matchers.get(template);
  if (!matcher) {
    matcher = new RegExp(
      `^${template
        .replace(/[$()*+.?[\\\]^{|}]/g, '\\$&')
        .replace(keyRegularExpression, parseStringReplacer)}$`,
    );
    matchers.set(template, matcher);
  }
  return matcher;
}

/**
 * 文字列テンプレートを用いて文字列を作成する。
 * @param template 文字列テンプレート(例: `/users/%userId%/articles/%articleId%`)
 * @param parameters パラメーター(例: `{ articleId: '1234', userId: 'abcd' }`)
 * @param strict `parameters`に存在しないキーがある場合に例外を発生させる場合、`true`
 * @returns 文字列(例: `/users/abcd/articles/1234`)
 */
export function createString<T extends string>(
  template: T,
  parameters: StringTemplateParameters<T>,
  strict = false,
) {
  return template.replace(keyRegularExpression, function (_, g1: string) {
    if (g1.length > 0) {
      let parameter = parameters[g1 as StringTemplateKey<T>];
      parameter ??= g1.split('.').reduce<any>(createStringReducer, parameters);
      if (parameter !== undefined) {
        return String(parameter);
      } else {
        if (strict) {
          throw new Error(`"${g1}" is not defined in parameters.`);
        } else {
          return '{' + g1 + '}';
        }
      }
    } else {
      return '%';
    }
  }) as StringTemplateType<T>;
}

function createStringReducer(parameters: any, key: string) {
  return parameters?.[key];
}

/**
 * 文字列テンプレートを用いて文字列を厳密に作成する。
 * @param template 文字列テンプレート(例: `/users/%userId%/articles/%articleId%`)
 * @param parameters パラメーター(例: `{ articleId: '1234', userId: 'abcd' }`)
 * @returns 文字列(例: `/users/abcd/articles/1234`)
 */
export function createStringStrictly<T extends string>(
  template: T,
  parameters: StringTemplateParameters<T>,
) {
  return createString(template, parameters, true);
}

/**
 * 最後の文字列テンプレートキーを抽出する。
 * @param template テンプレート
 * @returns 最後のキー(キーが存在しない場合は`null`)
 */
export function getLastStringTemplateKey<T extends string>(template: T): LastStringTemplateKey<T> {
  const keys = getStringTemplateKeys(template);
  return (keys.length > 0 ? keys[keys.length - 1] : null) as LastStringTemplateKey<T>;
}

/**
 * 文字列テンプレートからキーを抽出する。
 * @param template 文字列テンプレート
 * @returns キー配列(先頭から末尾への出現順)
 */
export function getStringTemplateKeys<T extends string>(template: T): StringTemplateKeyTuple<T> {
  // TODO: 処理速度を改善する。
  return Array.from(template.matchAll(keyRegularExpression), function ([, key]) {
    return key;
  }).filter(function (key) {
    return key !== '';
  }) as StringTemplateKeyTuple<T>;
}

/**
 * 文字列テンプレートを用いて文字列を解析する。
 * @param template 文字列テンプレート(例: `/users/%userId%/articles/%articleId%`)
 * @param s 文字列(例: `/users/abcd/articles/1234`)
 * @returns パラメーター(例: `{ articleId: '1234', userId: 'abcd' }`)
 */
export function parseString<T extends string>(template: T, s: string) {
  /** 照合配列 */
  const array = s.match(createMatcher(template));
  /** 解析結果 */
  const result = Object.fromEntries(
    Array.from(template.matchAll(keyRegularExpression), function ([, key]) {
      return [key, array?.groups?.[key] ?? null] as const;
    }),
  );
  // `%%`パターンを削除する。
  delete result[''];
  return result as StringTemplateParameters<T, string | null>;
}

function parseStringReplacer(_: string, g1: string) {
  return g1.length > 0 ? `(?<${g1}>.*)` : '%';
}

/**
 * 文字列テンプレートを用いて文字列を厳密に解析する。
 * @param template 文字列テンプレート(例: `/users/%userId%/articles/%articleId%`)
 * @param s 文字列(例: `/users/abcd/articles/1234`)
 * @returns パラメーター(例: `{ articleId: '1234', userId: 'abcd' }`)
 *
 * @throws {Error} テンプレートに文字列が合致しない場合
 */
export function parseStringStrictly<T extends string>(template: T, s: string) {
  const result = parseString(template, s);
  for (const [key, value] of Object.entries(result)) {
    if (value === null) {
      throw new Error(`"${s}" does not match '${template}', because "${key}" is not found.`);
    }
  }
  return result as StringTemplateParameters<T, string>;
}
