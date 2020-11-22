import { Pipe, PipeTransform } from '@angular/core';
import { LocalizedDateFns } from '@freelancer/ui/localized-date-fns.service';
import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  addSeconds,
  addYears,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInYears,
  getMonth,
} from 'date-fns';

export enum DurationFormat {
  LONG = 'long',
  SHORT = 'short',
}

/**
 * Converts milliseconds to a human readable duration.
 *
 * The output can be formatted in two ways, long and short format:
 *
 * Long Format:
 * ```
 * {{ '1000' | duration:'long' }} => '1 second'
 * {{ '62 * 60 * 1000 | duration:'long' }} => '1 hour, 2 minutes'
 * ```
 *
 * Short Format (default):
 * ```
 * {{ '1000' | duration:'short' }} => '00 : 00 : 01'
 * {{ '62 * 60 * 1000 | duration:'short' }} => '01 : 02 : 00'
 * ```
 */
@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {
  constructor(private dateFns: LocalizedDateFns) {}

  transform(
    millis: number | null,
    format?: DurationFormat.SHORT,
    baseline?: number | Date,
  ): string | null;
  transform(
    millis: number | null,
    format: DurationFormat.LONG,
    baseline?: number | Date,
  ): Promise<string>;
  transform(
    millis: number | null,
    format: DurationFormat = DurationFormat.SHORT,
    baseline: number | Date = Date.now(),
  ): Promise<string> | string | null {
    // safety guard for undefined when template is loading
    if (millis === null) {
      return null;
    }
    const baselineTime = new Date(baseline).getTime();
    const otherBaseline = baselineTime + millis;

    // set start and end to the earlier time
    const start = Math.min(baselineTime, otherBaseline);
    const end = Math.max(baselineTime, otherBaseline);

    let hours = differenceInHours(end, start);
    const mins = differenceInMinutes(end, addHours(start, hours));
    const secs = differenceInSeconds(
      end,
      addMinutes(start, differenceInMinutes(end, start)),
    );

    if (format === DurationFormat.LONG) {
      // date-fns's formatDistanceStrict only ever returns one unit,
      // but we want to show two units at a time for the LONG format.
      // first, we calculate the values of each unit separately
      const years = differenceInYears(end, start);
      const months = differenceInMonths(end, addYears(start, years));
      const days = differenceInDays(
        end,
        addMonths(addYears(start, years), months),
      );
      hours = differenceInHours(
        end,
        addDays(addMonths(addYears(start, years), months), days),
      );

      // then we format the values to get their localised units
      const formattedValue = Promise.all([
        this.dateFns.formatDistanceStrict(addYears(start, years), start, {
          unit: 'Y',
        }),
        // FIXME: disgusting hack
        // if we add 1 month to February or add 1 month to get February,
        // `formatDistanceStrict` returns it as `28 days`, or `0 months`
        // this will result in places occasionally showing `1 months`
        // we add a few days to force the `0 months` to round up
        (getMonth(start) === 1 || getMonth(addMonths(start, months)) === 1) &&
        months === 1
          ? this.dateFns.formatDistanceStrict(
              addDays(addMonths(start, months), 3),
              start,
              {
                unit: 'M',
              },
            )
          : this.dateFns.formatDistanceStrict(addMonths(start, months), start, {
              unit: 'M',
            }),
        this.dateFns.formatDistanceStrict(addDays(start, days), start, {
          unit: 'd',
        }),
        this.dateFns.formatDistanceStrict(addHours(start, hours), start, {
          unit: 'h',
        }),
        this.dateFns.formatDistanceStrict(addMinutes(start, mins), start, {
          unit: 'm',
        }),
        this.dateFns.formatDistanceStrict(addSeconds(start, secs), start, {
          unit: 's',
        }),
      ]).then(formattedValues => {
        const [, , , , , formattedSeconds] = formattedValues;
        const unformattedValues = [years, months, days, hours, mins, secs];
        const first = unformattedValues.findIndex(value => value > 0);
        if (first !== -1) {
          // and finally, we replace all the values with the ones we calculated earlier
          // date-fns occassionally does strange things that end up hiding hours
          // for example:
          // daylight savings pushes time by an hour, so a "24-hour" period,
          // such as midnight to midnight, may actually have 23 or 25 hours.
          // date-fns formats the distance using the visual distance
          // (ie. 12am-12pm is always "12 hours")
          // however, we want to always be exact for things like hourly tracking
          // so we ignore whatever date-fns formats the number and use the actual hour difference
          return formattedValues
            .map(
              (val, i) => `${unformattedValues[i]} ${val.split(' ').slice(1)}`,
            )
            .slice(first, first + 2)
            .filter(x => x.charAt(0) !== '0')
            .join(', ');
        }
        return formattedSeconds;
      });
      return formattedValue;
    }

    const hoursFormatted =
      hours.toString().length > 1 ? hours : `0${hours}`.slice(-2);
    const minsFormatted = `0${mins}`.slice(-2);
    const secsFormatted = `0${secs}`.slice(-2);

    return `${hoursFormatted} : ${minsFormatted} : ${secsFormatted}`;
  }
}
