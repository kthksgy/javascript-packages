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
 * 文字列テンプレートを用いて文字列を作成する。
 * @param template 文字列テンプレート(例: `/users/%userId%/articles/%articleId%`)
 * @param parameters パラメーター(例: `{ articleId: '1234', userId: 'abcd' }`)
 * @param replacer `parameters`に存在しないパラメーターの置換関数
 * @returns 文字列(例: `/users/abcd/articles/1234`)
 */
export function createString<T extends string>(
  template: T,
  parameters: Record<StringTemplateKey<T>, any>,
  replacer: {
    (parameterName: string, parameters: Record<StringTemplateKey<T>, any>): any;
  } = createStringDefaultReplacer,
) {
  return template.replace(/%([^%]*)%/g, function (_, g1: string) {
    return g1.length > 0
      ? String(parameters[g1 as StringTemplateKey<T>] ?? replacer(g1, parameters) ?? `{${g1}}`)
      : '%';
  });
}

function createStringDefaultReplacer(parameterName: string, parameters: Record<string, any>) {
  return parameterName.split('.').reduce<any>(createStringReducer, parameters);
}

function createStringReducer(parameters: any, key: string) {
  return parameters?.[key];
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
  return Array.from(template.matchAll(/%([^%]*)%/g), function ([, key]) {
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
  const array = s.match(
    new RegExp(
      `^${template
        .replace(/[$()*+.?[\\\]^{|}]/g, '\\$&')
        .replace(/%([^%]*)%/g, parseStringReplacer)}$`,
    ),
  );
  /** 解析結果 */
  const result = Object.fromEntries(
    Array.from(template.matchAll(/%([^%]*)%/g), function ([, key]) {
      return [key, array?.groups?.[key] ?? null] as const;
    }),
  );
  // `%%`パターンを削除する。
  delete result[''];
  return result as Record<StringTemplateKey<T>, string | null>;
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
  return result as Record<StringTemplateKey<T>, string>;
}
