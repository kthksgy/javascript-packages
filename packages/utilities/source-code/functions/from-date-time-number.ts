export function fromDateTimeNumber(n: bigint) {
  const resolutionBits = Number(n & 0b1111n);
  n = n >> 4n;

  switch (resolutionBits) {
    case 0: {
      const year = Number(n);
      return [year] as const;
    }
    case 1: {
      const year = Number(n >> 4n);
      const month = Number(n & 0b1111n);
      return [year, month] as const;
    }
    case 2: {
      const year = Number(n >> 9n);
      const month = Number((n >> 5n) & 0b1111n);
      const day = Number(n & 0b11111n);
      return [year, month, day] as const;
    }
    case 3: {
      const year = Number(n >> 14n);
      const month = Number((n >> 10n) & 0b1111n);
      const day = Number((n >> 5n) & 0b11111n);
      const hour = Number(n & 0b11111n);
      return [year, month, day, hour] as const;
    }
    case 4: {
      const year = Number(n >> 20n);
      const month = Number((n >> 16n) & 0b1111n);
      const day = Number((n >> 11n) & 0b11111n);
      const hour = Number((n >> 6n) & 0b11111n);
      const minute = Number(n & 0b111111n);
      return [year, month, day, hour, minute] as const;
    }
    case 5: {
      const year = Number(n >> 26n);
      const month = Number((n >> 22n) & 0b1111n);
      const day = Number((n >> 17n) & 0b11111n);
      const hour = Number((n >> 12n) & 0b11111n);
      const minute = Number((n >> 6n) & 0b111111n);
      const second = Number(n & 0b111111n);
      return [year, month, day, hour, minute, second] as const;
    }
    case 6: {
      const year = Number(n >> 36n);
      const month = Number((n >> 32n) & 0b1111n);
      const day = Number((n >> 27n) & 0b11111n);
      const hour = Number((n >> 22n) & 0b11111n);
      const minute = Number((n >> 16n) & 0b111111n);
      const second = Number((n >> 10n) & 0b111111n);
      const millisecond = Number(n & 0b1111111111n);
      return [year, month, day, hour, minute, second, millisecond] as const;
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
      return [year, month, day, hour, minute, second, millisecond, microsecond] as const;
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
      return [
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond,
      ] as const;
    }
    case 9: {
      const year = Number(n >> 66n);
      const month = Number((n >> 62n) & 0b1111n);
      const day = Number((n >> 57n) & 0b11111n);
      const hour = Number((n >> 52n) & 0b11111n);
      const minute = Number((n >> 46n) & 0b111111n);
      const second = Number((n >> 40n) & 0b111111n);
      const millisecond = Number((n >> 30n) & 0b1111111111n);
      const microsecond = Number((n >> 20n) & 0b1111111111n);
      const nanosecond = Number((n >> 10n) & 0b1111111111n);
      const picosecond = Number(n & 0b1111111111n);
      return [
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond,
        picosecond,
      ] as const;
    }
    case 10: {
      const year = Number(n >> 76n);
      const month = Number((n >> 72n) & 0b1111n);
      const day = Number((n >> 67n) & 0b11111n);
      const hour = Number((n >> 62n) & 0b11111n);
      const minute = Number((n >> 56n) & 0b111111n);
      const second = Number((n >> 50n) & 0b111111n);
      const millisecond = Number((n >> 40n) & 0b1111111111n);
      const microsecond = Number((n >> 30n) & 0b1111111111n);
      const nanosecond = Number((n >> 20n) & 0b1111111111n);
      const picosecond = Number((n >> 10n) & 0b1111111111n);
      const femtosecond = Number(n & 0b1111111111n);
      return [
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond,
        picosecond,
        femtosecond,
      ] as const;
    }
    case 11: {
      const year = Number(n >> 86n);
      const month = Number((n >> 82n) & 0b1111n);
      const day = Number((n >> 77n) & 0b11111n);
      const hour = Number((n >> 72n) & 0b11111n);
      const minute = Number((n >> 66n) & 0b111111n);
      const second = Number((n >> 60n) & 0b111111n);
      const millisecond = Number((n >> 50n) & 0b1111111111n);
      const microsecond = Number((n >> 40n) & 0b1111111111n);
      const nanosecond = Number((n >> 30n) & 0b1111111111n);
      const picosecond = Number((n >> 20n) & 0b1111111111n);
      const femtosecond = Number((n >> 10n) & 0b1111111111n);
      const attosecond = Number(n & 0b1111111111n);
      return [
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond,
        picosecond,
        femtosecond,
        attosecond,
      ] as const;
    }
    case 12: {
      const year = Number(n >> 96n);
      const month = Number((n >> 92n) & 0b1111n);
      const day = Number((n >> 87n) & 0b11111n);
      const hour = Number((n >> 82n) & 0b11111n);
      const minute = Number((n >> 76n) & 0b111111n);
      const second = Number((n >> 70n) & 0b111111n);
      const millisecond = Number((n >> 60n) & 0b1111111111n);
      const microsecond = Number((n >> 50n) & 0b1111111111n);
      const nanosecond = Number((n >> 40n) & 0b1111111111n);
      const picosecond = Number((n >> 30n) & 0b1111111111n);
      const femtosecond = Number((n >> 20n) & 0b1111111111n);
      const attosecond = Number((n >> 10n) & 0b1111111111n);
      const zeptosecond = Number(n & 0b1111111111n);
      return [
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond,
        picosecond,
        femtosecond,
        attosecond,
        zeptosecond,
      ] as const;
    }
    case 13: {
      const year = Number(n >> 106n);
      const month = Number((n >> 102n) & 0b1111n);
      const day = Number((n >> 97n) & 0b11111n);
      const hour = Number((n >> 92n) & 0b11111n);
      const minute = Number((n >> 86n) & 0b111111n);
      const second = Number((n >> 80n) & 0b111111n);
      const millisecond = Number((n >> 70n) & 0b1111111111n);
      const microsecond = Number((n >> 60n) & 0b1111111111n);
      const nanosecond = Number((n >> 50n) & 0b1111111111n);
      const picosecond = Number((n >> 40n) & 0b1111111111n);
      const femtosecond = Number((n >> 30n) & 0b1111111111n);
      const attosecond = Number((n >> 20n) & 0b1111111111n);
      const zeptosecond = Number((n >> 10n) & 0b1111111111n);
      const yoctosecond = Number(n & 0b1111111111n);
      return [
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond,
        picosecond,
        femtosecond,
        attosecond,
        zeptosecond,
        yoctosecond,
      ] as const;
    }
    case 14: {
      const year = Number(n >> 116n);
      const month = Number((n >> 112n) & 0b1111n);
      const day = Number((n >> 107n) & 0b11111n);
      const hour = Number((n >> 102n) & 0b11111n);
      const minute = Number((n >> 96n) & 0b111111n);
      const second = Number((n >> 90n) & 0b111111n);
      const millisecond = Number((n >> 80n) & 0b1111111111n);
      const microsecond = Number((n >> 70n) & 0b1111111111n);
      const nanosecond = Number((n >> 60n) & 0b1111111111n);
      const picosecond = Number((n >> 50n) & 0b1111111111n);
      const femtosecond = Number((n >> 40n) & 0b1111111111n);
      const attosecond = Number((n >> 30n) & 0b1111111111n);
      const zeptosecond = Number((n >> 20n) & 0b1111111111n);
      const yoctosecond = Number((n >> 10n) & 0b1111111111n);
      const rontosecond = Number(n & 0b1111111111n);
      return [
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond,
        picosecond,
        femtosecond,
        attosecond,
        zeptosecond,
        yoctosecond,
        rontosecond,
      ] as const;
    }
    case 15: {
      const year = Number(n >> 126n);
      const month = Number((n >> 122n) & 0b1111n);
      const day = Number((n >> 117n) & 0b11111n);
      const hour = Number((n >> 112n) & 0b11111n);
      const minute = Number((n >> 106n) & 0b111111n);
      const second = Number((n >> 100n) & 0b111111n);
      const millisecond = Number((n >> 90n) & 0b1111111111n);
      const microsecond = Number((n >> 80n) & 0b1111111111n);
      const nanosecond = Number((n >> 70n) & 0b1111111111n);
      const picosecond = Number((n >> 60n) & 0b1111111111n);
      const femtosecond = Number((n >> 50n) & 0b1111111111n);
      const attosecond = Number((n >> 40n) & 0b1111111111n);
      const zeptosecond = Number((n >> 30n) & 0b1111111111n);
      const yoctosecond = Number((n >> 20n) & 0b1111111111n);
      const rontosecond = Number((n >> 10n) & 0b1111111111n);
      const quectosecond = Number(n & 0b1111111111n);
      return [
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond,
        picosecond,
        femtosecond,
        attosecond,
        zeptosecond,
        yoctosecond,
        rontosecond,
        quectosecond,
      ] as const;
    }
    default: {
      throw new TypeError(`解像度ビット『${resolutionBits.toString(2)}』は無効です。`);
    }
  }
}
