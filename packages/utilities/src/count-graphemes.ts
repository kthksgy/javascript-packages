import { DEFAULT_GRAPHEME_SEGMENTER } from './constants/default-grapheme-segmenter';

/**
 * 書記素を数える。
 * @param s 文字列
 * @returns 書記素の数
 */
export function countGraphemes(s: string) {
  return Array.from(DEFAULT_GRAPHEME_SEGMENTER.segment(s)).length;
}
