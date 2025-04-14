/**
 * パーセントエンコードされた文字列をデコードする。
 * 現状、これは`decodeURIComponent()`の別名である。
 * @param s パーセントエンコードされた文字列
 * @returns 元の文字列
 * @see https://developer.mozilla.org/ja/docs/Glossary/Percent-encoding
 * @see https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent
 */
export const fromPercentEncoded = decodeURIComponent;
