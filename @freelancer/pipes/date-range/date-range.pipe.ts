import { DatePipe } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

/**
 * Converts a pair of Unix timestamps into a range of dates. Output format
 * can be customised with a format string, similar to the one used by
 * Angular's native DatePipe (https://angular.io/api/common/DatePipe).
 *
 * Examples:
 * ```
 * const start = new Date('January 1, 2019 00:00:00').getTime();
 * const end = new Date('January 2, 2019 05:00:00').getTime();
 * {{ start | dateRange:end }} => 'Jan 1, 2019 - Jan 2, 2019'
 * ```
 *
 * Pass the format string as the second parameter:
 * ```
 * {{ start | dateRange:end:'dd MMM, h:mm a'}} => '1 Jan, 12:00 AM - 2 Jan, 5:00 AM'
 * ```
 */
@Pipe({ name: 'dateRange' })
export class DateRangePipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  transform(
    dateStartMs: number | null,
    dateEndMs: number | null,
    format?: string | undefined,
  ): string | null {
    // safety guard for undefined when template is loading
    if (dateStartMs === null || dateEndMs === null) {
      return null;
    }

    const datePipe = new DatePipe(this.locale);
    const dateStart = new Date(dateStartMs);
    const dateEnd = new Date(dateEndMs);

    const dateStartFormatted = datePipe.transform(
      dateStartMs,
      format,
      undefined,
      this.locale,
    );

    if (
      dateStart.getDate() === dateEnd.getDate() &&
      dateStart.getMonth() === dateEnd.getMonth() &&
      dateStart.getFullYear() === dateEnd.getFullYear()
    ) {
      return dateStartFormatted;
    }

    const dateEndFormatted = datePipe.transform(
      dateEndMs,
      format,
      undefined,
      this.locale,
    );

    return `${dateStartFormatted} - ${dateEndFormatted}`;
  }
}
