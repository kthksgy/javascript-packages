import {
  DATE_TIME_NUMBER_ATTOSECOND_MODE,
  DATE_TIME_NUMBER_DAY_MODE,
  DATE_TIME_NUMBER_FEMTOSECOND_MODE,
  DATE_TIME_NUMBER_HOUR_MODE,
  DATE_TIME_NUMBER_MICROSECOND_MODE,
  DATE_TIME_NUMBER_MILLISECOND_MODE,
  DATE_TIME_NUMBER_MINUTE_MODE,
  DATE_TIME_NUMBER_MODE_BIT_COUNT,
  DATE_TIME_NUMBER_MODE_BIT_MASK,
  DATE_TIME_NUMBER_MONTH_MODE,
  DATE_TIME_NUMBER_NANOSECOND_MODE,
  DATE_TIME_NUMBER_PICOSECOND_MODE,
  DATE_TIME_NUMBER_QUECTOSECOND_MODE,
  DATE_TIME_NUMBER_RONTOSECOND_MODE,
  DATE_TIME_NUMBER_SECOND_MODE,
  DATE_TIME_NUMBER_YEAR_MODE,
  DATE_TIME_NUMBER_YOCTOSECOND_MODE,
  DATE_TIME_NUMBER_ZEPTOSECOND_MODE,
} from "./to-date-time-number";

export function fromDateTimeNumber(dateTimeNumber: bigint) {
  const mode = Number(dateTimeNumber & DATE_TIME_NUMBER_MODE_BIT_MASK);
  dateTimeNumber = dateTimeNumber >> DATE_TIME_NUMBER_MODE_BIT_COUNT;

  switch (mode) {
    case DATE_TIME_NUMBER_YEAR_MODE: {
      const year = Number(dateTimeNumber);
      return [year] as const;
    }
    case DATE_TIME_NUMBER_MONTH_MODE: {
      const year = Number(dateTimeNumber >> 4n);
      const month = Number(dateTimeNumber & 0b1111n);
      return [year, month] as const;
    }
    case DATE_TIME_NUMBER_DAY_MODE: {
      const year = Number(dateTimeNumber >> 9n);
      const month = Number((dateTimeNumber >> 5n) & 0b1111n);
      const day = Number(dateTimeNumber & 0b11111n);
      return [year, month, day] as const;
    }
    case DATE_TIME_NUMBER_HOUR_MODE: {
      const year = Number(dateTimeNumber >> 14n);
      const month = Number((dateTimeNumber >> 10n) & 0b1111n);
      const day = Number((dateTimeNumber >> 5n) & 0b11111n);
      const hour = Number(dateTimeNumber & 0b11111n);
      return [year, month, day, hour] as const;
    }
    case DATE_TIME_NUMBER_MINUTE_MODE: {
      const year = Number(dateTimeNumber >> 20n);
      const month = Number((dateTimeNumber >> 16n) & 0b1111n);
      const day = Number((dateTimeNumber >> 11n) & 0b11111n);
      const hour = Number((dateTimeNumber >> 6n) & 0b11111n);
      const minute = Number(dateTimeNumber & 0b111111n);
      return [year, month, day, hour, minute] as const;
    }
    case DATE_TIME_NUMBER_SECOND_MODE: {
      const year = Number(dateTimeNumber >> 26n);
      const month = Number((dateTimeNumber >> 22n) & 0b1111n);
      const day = Number((dateTimeNumber >> 17n) & 0b11111n);
      const hour = Number((dateTimeNumber >> 12n) & 0b11111n);
      const minute = Number((dateTimeNumber >> 6n) & 0b111111n);
      const second = Number(dateTimeNumber & 0b111111n);
      return [year, month, day, hour, minute, second] as const;
    }
    case DATE_TIME_NUMBER_MILLISECOND_MODE: {
      const year = Number(dateTimeNumber >> 36n);
      const month = Number((dateTimeNumber >> 32n) & 0b1111n);
      const day = Number((dateTimeNumber >> 27n) & 0b11111n);
      const hour = Number((dateTimeNumber >> 22n) & 0b11111n);
      const minute = Number((dateTimeNumber >> 16n) & 0b111111n);
      const second = Number((dateTimeNumber >> 10n) & 0b111111n);
      const millisecond = Number(dateTimeNumber & 0b1111111111n);
      return [year, month, day, hour, minute, second, millisecond] as const;
    }
    case DATE_TIME_NUMBER_MICROSECOND_MODE: {
      const year = Number(dateTimeNumber >> 46n);
      const month = Number((dateTimeNumber >> 42n) & 0b1111n);
      const day = Number((dateTimeNumber >> 37n) & 0b11111n);
      const hour = Number((dateTimeNumber >> 32n) & 0b11111n);
      const minute = Number((dateTimeNumber >> 26n) & 0b111111n);
      const second = Number((dateTimeNumber >> 20n) & 0b111111n);
      const millisecond = Number((dateTimeNumber >> 10n) & 0b1111111111n);
      const microsecond = Number(dateTimeNumber & 0b1111111111n);
      return [year, month, day, hour, minute, second, millisecond, microsecond] as const;
    }
    case DATE_TIME_NUMBER_NANOSECOND_MODE: {
      const year = Number(dateTimeNumber >> 56n);
      const month = Number((dateTimeNumber >> 52n) & 0b1111n);
      const day = Number((dateTimeNumber >> 47n) & 0b11111n);
      const hour = Number((dateTimeNumber >> 42n) & 0b11111n);
      const minute = Number((dateTimeNumber >> 36n) & 0b111111n);
      const second = Number((dateTimeNumber >> 30n) & 0b111111n);
      const millisecond = Number((dateTimeNumber >> 20n) & 0b1111111111n);
      const microsecond = Number((dateTimeNumber >> 10n) & 0b1111111111n);
      const nanosecond = Number(dateTimeNumber & 0b1111111111n);
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
    case DATE_TIME_NUMBER_PICOSECOND_MODE: {
      const year = Number(dateTimeNumber >> 66n);
      const month = Number((dateTimeNumber >> 62n) & 0b1111n);
      const day = Number((dateTimeNumber >> 57n) & 0b11111n);
      const hour = Number((dateTimeNumber >> 52n) & 0b11111n);
      const minute = Number((dateTimeNumber >> 46n) & 0b111111n);
      const second = Number((dateTimeNumber >> 40n) & 0b111111n);
      const millisecond = Number((dateTimeNumber >> 30n) & 0b1111111111n);
      const microsecond = Number((dateTimeNumber >> 20n) & 0b1111111111n);
      const nanosecond = Number((dateTimeNumber >> 10n) & 0b1111111111n);
      const picosecond = Number(dateTimeNumber & 0b1111111111n);
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
    case DATE_TIME_NUMBER_FEMTOSECOND_MODE: {
      const year = Number(dateTimeNumber >> 76n);
      const month = Number((dateTimeNumber >> 72n) & 0b1111n);
      const day = Number((dateTimeNumber >> 67n) & 0b11111n);
      const hour = Number((dateTimeNumber >> 62n) & 0b11111n);
      const minute = Number((dateTimeNumber >> 56n) & 0b111111n);
      const second = Number((dateTimeNumber >> 50n) & 0b111111n);
      const millisecond = Number((dateTimeNumber >> 40n) & 0b1111111111n);
      const microsecond = Number((dateTimeNumber >> 30n) & 0b1111111111n);
      const nanosecond = Number((dateTimeNumber >> 20n) & 0b1111111111n);
      const picosecond = Number((dateTimeNumber >> 10n) & 0b1111111111n);
      const femtosecond = Number(dateTimeNumber & 0b1111111111n);
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
    case DATE_TIME_NUMBER_ATTOSECOND_MODE: {
      const year = Number(dateTimeNumber >> 86n);
      const month = Number((dateTimeNumber >> 82n) & 0b1111n);
      const day = Number((dateTimeNumber >> 77n) & 0b11111n);
      const hour = Number((dateTimeNumber >> 72n) & 0b11111n);
      const minute = Number((dateTimeNumber >> 66n) & 0b111111n);
      const second = Number((dateTimeNumber >> 60n) & 0b111111n);
      const millisecond = Number((dateTimeNumber >> 50n) & 0b1111111111n);
      const microsecond = Number((dateTimeNumber >> 40n) & 0b1111111111n);
      const nanosecond = Number((dateTimeNumber >> 30n) & 0b1111111111n);
      const picosecond = Number((dateTimeNumber >> 20n) & 0b1111111111n);
      const femtosecond = Number((dateTimeNumber >> 10n) & 0b1111111111n);
      const attosecond = Number(dateTimeNumber & 0b1111111111n);
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
    case DATE_TIME_NUMBER_ZEPTOSECOND_MODE: {
      const year = Number(dateTimeNumber >> 96n);
      const month = Number((dateTimeNumber >> 92n) & 0b1111n);
      const day = Number((dateTimeNumber >> 87n) & 0b11111n);
      const hour = Number((dateTimeNumber >> 82n) & 0b11111n);
      const minute = Number((dateTimeNumber >> 76n) & 0b111111n);
      const second = Number((dateTimeNumber >> 70n) & 0b111111n);
      const millisecond = Number((dateTimeNumber >> 60n) & 0b1111111111n);
      const microsecond = Number((dateTimeNumber >> 50n) & 0b1111111111n);
      const nanosecond = Number((dateTimeNumber >> 40n) & 0b1111111111n);
      const picosecond = Number((dateTimeNumber >> 30n) & 0b1111111111n);
      const femtosecond = Number((dateTimeNumber >> 20n) & 0b1111111111n);
      const attosecond = Number((dateTimeNumber >> 10n) & 0b1111111111n);
      const zeptosecond = Number(dateTimeNumber & 0b1111111111n);
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
    case DATE_TIME_NUMBER_YOCTOSECOND_MODE: {
      const year = Number(dateTimeNumber >> 106n);
      const month = Number((dateTimeNumber >> 102n) & 0b1111n);
      const day = Number((dateTimeNumber >> 97n) & 0b11111n);
      const hour = Number((dateTimeNumber >> 92n) & 0b11111n);
      const minute = Number((dateTimeNumber >> 86n) & 0b111111n);
      const second = Number((dateTimeNumber >> 80n) & 0b111111n);
      const millisecond = Number((dateTimeNumber >> 70n) & 0b1111111111n);
      const microsecond = Number((dateTimeNumber >> 60n) & 0b1111111111n);
      const nanosecond = Number((dateTimeNumber >> 50n) & 0b1111111111n);
      const picosecond = Number((dateTimeNumber >> 40n) & 0b1111111111n);
      const femtosecond = Number((dateTimeNumber >> 30n) & 0b1111111111n);
      const attosecond = Number((dateTimeNumber >> 20n) & 0b1111111111n);
      const zeptosecond = Number((dateTimeNumber >> 10n) & 0b1111111111n);
      const yoctosecond = Number(dateTimeNumber & 0b1111111111n);
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
    case DATE_TIME_NUMBER_RONTOSECOND_MODE: {
      const year = Number(dateTimeNumber >> 116n);
      const month = Number((dateTimeNumber >> 112n) & 0b1111n);
      const day = Number((dateTimeNumber >> 107n) & 0b11111n);
      const hour = Number((dateTimeNumber >> 102n) & 0b11111n);
      const minute = Number((dateTimeNumber >> 96n) & 0b111111n);
      const second = Number((dateTimeNumber >> 90n) & 0b111111n);
      const millisecond = Number((dateTimeNumber >> 80n) & 0b1111111111n);
      const microsecond = Number((dateTimeNumber >> 70n) & 0b1111111111n);
      const nanosecond = Number((dateTimeNumber >> 60n) & 0b1111111111n);
      const picosecond = Number((dateTimeNumber >> 50n) & 0b1111111111n);
      const femtosecond = Number((dateTimeNumber >> 40n) & 0b1111111111n);
      const attosecond = Number((dateTimeNumber >> 30n) & 0b1111111111n);
      const zeptosecond = Number((dateTimeNumber >> 20n) & 0b1111111111n);
      const yoctosecond = Number((dateTimeNumber >> 10n) & 0b1111111111n);
      const rontosecond = Number(dateTimeNumber & 0b1111111111n);
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
    case DATE_TIME_NUMBER_QUECTOSECOND_MODE: {
      const year = Number(dateTimeNumber >> 126n);
      const month = Number((dateTimeNumber >> 122n) & 0b1111n);
      const day = Number((dateTimeNumber >> 117n) & 0b11111n);
      const hour = Number((dateTimeNumber >> 112n) & 0b11111n);
      const minute = Number((dateTimeNumber >> 106n) & 0b111111n);
      const second = Number((dateTimeNumber >> 100n) & 0b111111n);
      const millisecond = Number((dateTimeNumber >> 90n) & 0b1111111111n);
      const microsecond = Number((dateTimeNumber >> 80n) & 0b1111111111n);
      const nanosecond = Number((dateTimeNumber >> 70n) & 0b1111111111n);
      const picosecond = Number((dateTimeNumber >> 60n) & 0b1111111111n);
      const femtosecond = Number((dateTimeNumber >> 50n) & 0b1111111111n);
      const attosecond = Number((dateTimeNumber >> 40n) & 0b1111111111n);
      const zeptosecond = Number((dateTimeNumber >> 30n) & 0b1111111111n);
      const yoctosecond = Number((dateTimeNumber >> 20n) & 0b1111111111n);
      const rontosecond = Number((dateTimeNumber >> 10n) & 0b1111111111n);
      const quectosecond = Number(dateTimeNumber & 0b1111111111n);
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
      throw new TypeError(`日時番号のモード『${mode}(${mode.toString(2)})』は無効です。`);
    }
  }
}
