export function chunk<T>(elements: ReadonlyArray<T>, size: number) {
  if (size > 0 && Number.isInteger(size)) {
    const chunks: Array<Array<T>> = [];
    for (let i = 0; i < elements.length; i += size) {
      chunks.push(elements.slice(i, i + size));
    }
    return chunks;
  } else {
    throw new RangeError(`${elements}はチャンクサイズ${size}でチャンクに分割出来ません。`);
  }
}
