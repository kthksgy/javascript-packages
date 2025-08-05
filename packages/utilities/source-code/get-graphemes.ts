import { DEFAULT_GRAPHEME_SEGMENTER } from "./constants";

/**
 * 書記素配列を取得する。
 * @param s 文字列
 * @returns 書記素配列
 */
export function getGraphemes(s: string) {
  return Array.from(DEFAULT_GRAPHEME_SEGMENTER.segment(s)).map(({ segment }) => segment);
}
