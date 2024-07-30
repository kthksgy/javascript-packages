/** 既定の書記素粒度分割器 */
export const DEFAULT_GRAPHEME_SEGMENTER = new Intl.Segmenter(undefined, {
  granularity: 'grapheme',
});
