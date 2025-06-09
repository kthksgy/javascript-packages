/**
 * 62進数を10進数に変換する。
 * @param duosexagesimal 62進数
 * @returns 10進数
 */
export function fromDuosexagesimal(duosexagesimal: string) {
  if (duosexagesimal.length < 9 || duosexagesimal <= "fFgnDxSe7") {
    let decimal = 0;
    for (let i = 0; i < duosexagesimal.length; i++) {
      const character = duosexagesimal.charCodeAt(i);
      decimal =
        decimal * 62 +
        (character < 58 ? character - 48 : character < 91 ? character - 55 : character - 61);
    }
    return decimal;
  } else {
    let decimal = BigInt(0);
    for (let i = 0; i < duosexagesimal.length; i++) {
      const character = duosexagesimal.charCodeAt(i);
      decimal =
        decimal * BigInt(62) +
        BigInt(character < 58 ? character - 48 : character < 91 ? character - 55 : character - 61);
    }
    return decimal;
  }
}
