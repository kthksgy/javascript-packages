/**
 * 文字列から指定した接尾辞を削除する。
 */
export type RemoveSuffixOutput<
  TInput extends string,
  TSuffix extends string,
> = TInput extends `${infer TRest}${TSuffix}` ? TRest : TInput;

/**
 * 文字列から指定した接尾辞を削除する。
 * @param input 入力文字列
 * @param suffix 接尾辞
 * @returns 出力文字列
 */
export function removeSuffix<TInput extends string, TSuffix extends string>(
  input: TInput,
  suffix: TSuffix,
) {
  return <RemoveSuffixOutput<TInput, TSuffix>>(
    (input.endsWith(suffix) ? input.slice(suffix.length) : input)
  );
}
