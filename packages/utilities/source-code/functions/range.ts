/**
 * 範囲に含まれる数を一定間隔で順番に生成する。
 * Pythonの`range`関数のような動作をするが、一部異なる。
 * @param start 範囲の始点
 * 生成される数に含む。
 * @param stop 範囲の終点(任意)
 * 省略した場合は`[0, start)`の範囲になる。生成される数に含まれない。
 * @param step 間隔(任意)
 * 省略した場合、`start`が`stop`より小さい場合は`1`、`start`が`stop`より大きい場合は`-1`になる。
 * Pythonの場合、省略した場合はどのような`start`と`stop`の組でも`1`になる。
 */
export function* range(start: number, stop?: number, step?: number) {
  if (stop === undefined) {
    stop = start;
    start = 0;
  }
  if (step === undefined) {
    step = start <= stop ? 1 : -1;
  }
  if (!Number.isFinite(start) || !Number.isFinite(stop) || step === 0 || !Number.isFinite(step)) {
    throw new RangeError(`range(${start}, ${stop}, ${step}) is invalid.`);
  }

  if ((start <= stop && step < 0) || (start >= stop && step > 0)) {
    return;
  }

  for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
    yield i;
  }
}
