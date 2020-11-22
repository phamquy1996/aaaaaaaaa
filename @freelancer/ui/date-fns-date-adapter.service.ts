import { Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import {
  addDays,
  addMonths,
  addYears,
  format,
  getDate,
  getDaysInMonth,
  getMonth,
  getYear,
  parse,
  setDate,
  setDay,
  setMonth,
  setYear,
  toDate,
} from 'date-fns';
import { MatDateFormats } from 'saturn-datepicker';
import { LocalizedDateFns } from './localized-date-fns.service';

export const MAT_DATEFNS_DATE_FORMATS: MatDateFormats = {
  parse: {
    /** this is ignored by `parse` because it tries multiple formats */
    dateInput: undefined,
  },
  display: {
    dateInput: 'L',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

// date-fns doesn't provide locale-based start of week
// so we'll just use the ISO standard of Monday
const START_OF_WEEK = 1;

/**
 * Creates an array with all numbers between `start` and `end` (inclusive)
 * with values assigned using the provided `valueFunction`
 *
 * Taken from the `NativeDateAdapter` in `@angular/components`
 */
function range<T>(
  start: number,
  end: number,
  valueFunction: (index: number) => T,
): T[] {
  const valuesArray = Array(end - start + 1);
  for (let i = start; i <= end; i++) {
    valuesArray[i - start] = valueFunction(i);
  }
  return valuesArray;
}

@Injectable()
export class DateFnsDateAdapter extends DateAdapter<Date> {
  dateFnsLocale?: Locale;
  /** Promise which emits when the locale is ready */
  localeLoaded: Promise<void>;

  constructor(private dateFns: LocalizedDateFns) {
    super();
    // localized datefns knows the locale from uiConfig
    this.localeLoaded = this.dateFns.localePromise.then(loadedLocale => {
      // this is a bit hacky because it won't set the `dateFnsLocale` until
      // after the LocalizedDateFns service downloads the appropriate chunk.
      // it's unlikely, but if someone tries to use a datepicker before
      // the locale bundle is downloaded, it will not be localised yet.
      this.dateFnsLocale = loadedLocale;
    });
  }

  addCalendarDays(date: Date, days: number): Date {
    return addDays(date, days);
  }

  addCalendarMonths(date: Date, months: number): Date {
    return addMonths(date, months);
  }

  addCalendarYears(date: Date, years: number): Date {
    return addYears(date, years);
  }

  clone(date: Date): Date {
    return toDate(date);
  }

  createDate(year: number, month: number, date: number): Date {
    // create a definitely valid date with 0 hr 0 min etc.
    const base = new Date(2019, 1, 1);
    // TODO: dream about the pipe operator
    return setDate(setMonth(setYear(base, year), month), date);
  }

  format(date: Date, displayFormat: any): string {
    return format(date, displayFormat, { locale: this.dateFnsLocale });
  }

  getDate(date: Date): number {
    return getDate(date);
  }

  getDateNames(): string[] {
    const date = new Date(2019, 0, 1);
    return range(1, 31, day => format(setDate(date, day), 'D'));
  }

  getDayOfWeek(date: Date): number {
    // date-fns doesn't have a getDayOfWeek function
    // we have to use `format` and parse it back into a number
    return parseInt(format(date, 'd'), 10);
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    const map = {
      long: 'dddd',
      short: 'ddd',
      narrow: 'dd',
    };

    const formatStr = map[style];
    const date = new Date(2019, 0, 1);

    return range(0, 6, day =>
      format(setDay(date, day, { weekStartsOn: START_OF_WEEK }), formatStr, {
        locale: this.dateFnsLocale,
      }),
    );
  }

  getFirstDayOfWeek(): number {
    // date-fns doesn't tell us what this is so use the ISO standard of 1
    return START_OF_WEEK;
  }

  getMonth(date: Date): number {
    return getMonth(date);
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    const map = {
      long: 'MMMM',
      short: 'MMM',
      // FIXME: upgrade datefns
      // v2.0.0.alpha.7 narrows months to numbers
      narrow: 'MMM',
    };

    const formatStr = map[style];
    const date = new Date(2019, 0, 1);

    return range(0, 11, month =>
      format(setMonth(date, month), formatStr, {
        locale: this.dateFnsLocale,
      }),
    );
  }

  getNumDaysInMonth(date: Date): number {
    return getDaysInMonth(date);
  }

  getYear(date: Date): number {
    return getYear(date);
  }

  getYearName(date: Date): string {
    return format(date, 'YYYY', {
      locale: this.dateFnsLocale,
    });
  }

  invalid(): Date {
    return new Date(NaN);
  }

  isDateInstance(obj: any): boolean {
    return obj instanceof Date;
  }

  isValid(date: Date): boolean {
    return date instanceof Date && !Number.isNaN(date.getTime());
  }

  parse(value: any): Date | null {
    // parse can have anything put in it
    if (this.isDateInstance(value) || typeof value === 'number') {
      return toDate(value);
    }
    // empty string case - date-fns will otherwise parse this as Invalid Date
    if (!value) {
      return null;
    }

    // L forces double-digit months (01, 02, etc) which people may not expect
    // so try both 'L' and 'I' to see if either one works
    const res = parse(value, 'L', new Date(), {
      locale: this.dateFnsLocale,
      weekStartsOn: START_OF_WEEK,
    });
    if (this.isValid(res)) {
      return res;
    }
    return parse(value, 'I', new Date(), {
      locale: this.dateFnsLocale,
      weekStartsOn: START_OF_WEEK,
    });
  }

  deserialize(value: any): Date | null {
    /**
     * Matches strings that have the form of a valid RFC 339 string
     * Taken from the `NativeDateAdapter` in `@angular/components`
     */
    const regex = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|(?:(?:\+|-)\d{2}:\d{2}))?)?$/;

    if (typeof value === 'string') {
      if (!value) {
        return null;
      }
      // The `Date` constructor accepts formats other than ISO 8601, so we need to make sure the
      // string is the right format first.
      if (regex.test(value)) {
        const date = new Date(value);
        if (this.isValid(date)) {
          return date;
        }
      }
    }
    return super.deserialize(value);
  }

  toIso8601(date: Date): string {
    return date.toISOString();
  }

  today(): Date {
    return new Date();
  }
}
