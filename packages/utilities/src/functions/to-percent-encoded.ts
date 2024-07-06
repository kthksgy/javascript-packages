/**
 * パーセントエンコードされた文字列にエンコードする。
 * 復号するには`fromPercentEncoded()`または標準の`decodeURIComponent()`を使う。
 * @param s 文字列
 * @returns パーセントエンコードされた文字列
 * @see https://developer.mozilla.org/ja/docs/Glossary/Percent-encoding
 * @see https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
 */
export function toPercentEncoded(s: string) {
  return encodeURIComponent(s).replace(/[!'()*]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}
