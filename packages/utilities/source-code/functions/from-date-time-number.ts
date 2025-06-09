import { Temporal } from "temporal-polyfill";

export function fromDateTimeNumber(n: bigint) {
  const resolutionBits = Number(n & 0b1111n);
  n = n >> 4n;

  switch (resolutionBits) {
    case 0: {
      const year = Number(n);
      return new Temporal.PlainDateTime(year, 1, 1);
    }
    case 1: {
      const year = Number(n >> 4n);
      const month = Number(n & 0b1111n);
      return new Temporal.PlainDateTime(year, month, 1);
    }
    case 2: {
      const year = Number(n >> 9n);
      const month = Number((n >> 5n) & 0b1111n);
      const day = Number(n & 0b11111n);
      return new Temporal.PlainDateTime(year, month, day);
    }
    case 3: {
      const year = Number(n >> 14n);
      const month = Number((n >> 10n) & 0b1111n);
      const day = Number((n >> 5n) & 0b11111n);
      const hour = Number(n & 0b11111n);
      return new Temporal.PlainDateTime(year, month, day, hour);
    }
    case 4: {
      const year = Number(n >> 20n);
      const month = Number((n >> 16n) & 0b1111n);
      const day = Number((n >> 11n) & 0b11111n);
      const hour = Number((n >> 6n) & 0b11111n);
      const minute = Number(n & 0b111111n);
      return new Temporal.PlainDateTime(year, month, day, hour, minute);
    }
    case 5: {
      const year = Number(n >> 26n);
      const month = Number((n >> 22n) & 0b1111n);
      const day = Number((n >> 17n) & 0b11111n);
      const hour = Number((n >> 12n) & 0b11111n);
      const minute = Number((n >> 6n) & 0b111111n);
      const second = Number(n & 0b111111n);
      return new Temporal.PlainDateTime(year, month, day, hour, minute, second);
    }
    case 6: {
      const year = Number(n >> 36n);
      const month = Number((n >> 32n) & 0b1111n);
      const day = Number((n >> 27n) & 0b11111n);
      const hour = Number((n >> 22n) & 0b11111n);
      const minute = Number((n >> 16n) & 0b111111n);
      const second = Number((n >> 10n) & 0b111111n);
      const millisecond = Number(n & 0b1111111111n);
      return new Temporal.PlainDateTime(year, month, day, hour, minute, second, millisecond);
    }
    case 7: {
      const year = Number(n >> 46n);
      const month = Number((n >> 42n) & 0b1111n);
      const day = Number((n >> 37n) & 0b11111n);
      const hour = Number((n >> 32n) & 0b11111n);
      const minute = Number((n >> 26n) & 0b111111n);
      const second = Number((n >> 20n) & 0b111111n);
      const millisecond = Number((n >> 10n) & 0b1111111111n);
      const microsecond = Number(n & 0b1111111111n);
      return new Temporal.PlainDateTime(
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
        microsecond,
      );
    }
    case 8: {
      const year = Number(n >> 56n);
      const month = Number((n >> 52n) & 0b1111n);
      const day = Number((n >> 47n) & 0b11111n);
      const hour = Number((n >> 42n) & 0b11111n);
      const minute = Number((n >> 36n) & 0b111111n);
      const second = Number((n >> 30n) & 0b111111n);
      const millisecond = Number((n >> 20n) & 0b1111111111n);
      const microsecond = Number((n >> 10n) & 0b1111111111n);
      const nanosecond = Number(n & 0b1111111111n);
      return new Temporal.PlainDateTime(
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond,
      );
    }
    case 9: {
      throw new TypeError(`ピコ秒を含む日時番号『${n.toString(2)}』は日時に変換出来ません。`);
    }
    case 10: {
      throw new TypeError(`フェムト秒を含む日時番号『${n.toString(2)}』は日時に変換出来ません。`);
    }
    case 11: {
      throw new TypeError(`アト秒を含む日時番号『${n.toString(2)}』は日時に変換出来ません。`);
    }
    case 12: {
      throw new TypeError(`ゼプト秒を含む日時番号『${n.toString(2)}』は日時に変換出来ません。`);
    }
    case 13: {
      throw new TypeError(`ヨクト秒を含む日時番号『${n.toString(2)}』は日時に変換出来ません。`);
    }
    case 14: {
      throw new TypeError(`ロント秒を含む日時番号『${n.toString(2)}』は日時に変換出来ません。`);
    }
    case 15: {
      throw new TypeError(`クエクト秒を含む日時番号『${n.toString(2)}』は日時に変換出来ません。`);
    }
    default: {
      throw new TypeError(`解像度ビット『${resolutionBits.toString(2)}』は無効です。`);
    }
  }
}
