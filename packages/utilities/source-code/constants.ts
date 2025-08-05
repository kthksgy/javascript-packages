/** 英字 */
export type AlphabeticCharacter =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z"
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z";
/** 英字 */
export const ALPHABETIC_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/** 英数字 */
export type AlphanumericCharacter = NumericCharacter | AlphabeticCharacter;
/** 英数字 */
export const ALPHANUMERIC_CHARACTERS =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/** 既定の書記素粒度分割器 */
export const DEFAULT_GRAPHEME_SEGMENTER = new Intl.Segmenter(undefined, {
  granularity: "grapheme",
});

/** 数字 */
export type NumericCharacter = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
/** 数字 */
export const NUMERIC_CHARACTERS = "0123456789";
