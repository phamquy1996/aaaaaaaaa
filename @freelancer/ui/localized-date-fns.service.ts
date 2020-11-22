import { Injectable } from '@angular/core';
import { Localization } from '@freelancer/localization';
import { formatDistance, formatDistanceStrict } from 'date-fns';
import * as Rx from 'rxjs';

@Injectable()
export class LocalizedDateFns {
  localePromise: Promise<Locale | undefined>;

  constructor(private localization: Localization) {
    switch (this.localization.languageCode) {
      // FIXME: locale 'af' isn't available
      // case 'af':
      // this.localePromise = import('date-fns/locale/af');
      //   break;
      // FIXME: locale 'bn' isn't available
      // case 'bn':
      // this.localePromise = import('date-fns/locale/bn');
      // break;
      case 'ca':
        this.localePromise = import('date-fns/locale/ca');
        break;
      case 'cs':
        this.localePromise = import('date-fns/locale/cs');
        break;
      case 'da':
        this.localePromise = import('date-fns/locale/da');
        break;
      case 'de':
        this.localePromise = import('date-fns/locale/de');
        break;
      case 'es':
        this.localePromise = import('date-fns/locale/es');
        break;
      case 'el':
        this.localePromise = import('date-fns/locale/el');
        break;
      case 'fi':
        this.localePromise = import('date-fns/locale/fi');
        break;
      case 'fil':
        this.localePromise = import('date-fns/locale/fil');
        break;
      case 'fr':
        this.localePromise = import('date-fns/locale/fr');
        break;
      // FIXME: locale 'hi' isn't available
      // case 'hi':
      // this.localePromise = import('date-fns/locale/hi');
      // break;
      // FIXME: locale 'hu' isn't available
      // case 'hu':
      // this.localePromise = import('date-fns/locale/hu');
      // break;
      case 'id':
        this.localePromise = import('date-fns/locale/id');
        break;
      case 'it':
        this.localePromise = import('date-fns/locale/it');
        break;
      case 'ja':
        this.localePromise = import('date-fns/locale/ja');
        break;
      case 'ko':
        this.localePromise = import('date-fns/locale/ko');
        break;
      // FIXME: locale 'ms' isn't available
      // case 'ms':
      // this.localePromise = import('date-fns/locale/ms');
      // break;
      case 'nb':
        this.localePromise = import('date-fns/locale/nb');
        break;
      case 'nl':
        this.localePromise = import('date-fns/locale/nl');
        break;
      case 'pl':
        this.localePromise = import('date-fns/locale/pl');
        break;
      case 'pt':
        this.localePromise = import('date-fns/locale/pt');
        break;
      case 'ro':
        this.localePromise = import('date-fns/locale/ro');
        break;
      case 'ru':
        this.localePromise = import('date-fns/locale/ru');
        break;
      // FIXME: locale 'sl' isn't available
      // case 'sl':
      // this.localePromise = import('date-fns/locale/sl');
      // break;
      // FIXME: locale 'sq' isn't available
      // case 'sq':
      // this.localePromise = import('date-fns/locale/sq');
      // break;
      case 'sv':
        this.localePromise = import('date-fns/locale/sv');
        break;
      // FIXME: locale 'sw' isn't available
      // case 'sw':
      // this.localePromise = import('date-fns/locale/sw');
      //   break;
      case 'th':
        this.localePromise = import('date-fns/locale/th');
        break;
      case 'tr':
        this.localePromise = import('date-fns/locale/tr');
        break;
      case 'uk':
        this.localePromise = import('date-fns/locale/en-GB');
        break;
      case 'vi':
        this.localePromise = import('date-fns/locale/vi');
        break;
      case 'zh':
        this.localePromise = import('date-fns/locale/zh-CN');
        break;
      case 'en':
        this.localePromise = import('date-fns/locale/en-US');
        break;
      default:
        this.localePromise = Promise.resolve(undefined);
        console.error(
          `Locale ${this.localization.languageCode} isn't configure for date-fns, not all dates will be localized`,
        );
        break;
    }
  }

  /**
   * Returns the format used to display numeric longform (day + month + year) dates.
   * Changes based on the locale.
   */
  get dateFormat() {
    return this.localePromise.then(locale =>
      locale ? locale.formatLong('L') : 'MM/DD/YYYY',
    );
  }

  /**
   * Returns the format used to display numeric longform (day + month + year) date ranges
   * Changes based on the locale.
   */
  get dateRangeFormat() {
    return this.localePromise.then(locale => {
      const single = locale ? locale.formatLong('L') : 'MM/DD/YYYY';
      return `${single} - ${single}`;
    });
  }

  /**
   * Returns a list of localised months, if no locale is set English months are
   * returned.
   */
  getLocalisedMonths(): Rx.Observable<ReadonlyArray<string>> {
    return Rx.from(
      this.localePromise.then(locale =>
        locale
          ? locale.localize.months()
          : [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ],
      ),
    );
  }

  formatDistance(
    date: Date | string | number,
    baseDate: Date | string | number,
    options?: Options,
  ) {
    return this.localePromise.then(locale =>
      formatDistance(date, baseDate, {
        ...options,
        locale,
      }),
    );
  }

  formatDistanceStrict(
    date: Date | string | number,
    baseDate: Date | string | number,
    options?: Options,
  ) {
    return this.localePromise.then(locale =>
      formatDistanceStrict(date, baseDate, {
        ...options,
        locale,
      }),
    );
  }
}
