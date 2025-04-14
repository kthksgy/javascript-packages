/**
 * 入力文字列から指定した接頭辞を削除する。
 */
export type RemovePrefixOutput<
  TInput extends string,
  TPrefix extends string,
> = TInput extends `${TPrefix}${infer TRest}` ? TRest : TInput;

/**
 * 入力文字列から指定した接頭辞を削除する。
 * @param input 入力文字列
 * @param prefix 接頭辞
 * @returns 出力文字列
 */
export function removePrefix<TInput extends string, TPrefix extends string>(
  input: TInput,
  prefix: TPrefix,
) {
  return (input.startsWith(prefix) ? input.slice(prefix.length) : input) as RemovePrefixOutput<
    TInput,
    TPrefix
  >;
}
