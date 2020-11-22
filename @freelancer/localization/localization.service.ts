import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import {
  Applications,
  AppsDomainsMap,
  APPS_DOMAINS_MAP,
  APP_NAME,
} from '@freelancer/config';
import { Location } from '@freelancer/location';

/**
 * Utility service for handling Angular language identifiers.
 * GAF doesn't support the locale extensions, which means that for all
 * our use cases we're using only the locale identifier, without the extension.
 * Once GAF adds support for locale this service can be replaced just by the
 * `LOCALE_ID` injection token.
 * http://cldr.unicode.org/core-spec#Unicode_Language_and_Locale_Identifiers
 * https://docs.oracle.com/cd/E13214_01/wli/docs92/xref/xqisocodes.html
 * https://angular.io/guide/i18n#setting-up-the-locale-of-your-app
 */
@Injectable({
  providedIn: 'root',
})
export class Localization {
  private _languageCode: string;
  private _countryCode?: string;

  constructor(
    private location: Location,
    @Inject(LOCALE_ID) private _locale: string,
    @Inject(APPS_DOMAINS_MAP) private appsDomainsMap: AppsDomainsMap,
    @Inject(APP_NAME) private appName: Applications,
  ) {
    [this._languageCode, this._countryCode] = this._locale.split('-');
    // FIXME: countryCode should be extracted from the locale but we don't
    // support regional locales at the moment
    const langParam = new URL(this.location.href).searchParams.get('lang');
    const domainMatch = Object.entries(this.appsDomainsMap[this.appName]).find(
      ([, domain]) => domain === this.location.hostname,
    );
    if (langParam) {
      const hasLocale = Object.keys(appsDomainsMap[appName]).includes(
        langParam,
      );
      if (hasLocale && langParam.split('-')[0] === this._languageCode) {
        [, this._countryCode] = langParam.split('-');
      }
    } else if (
      domainMatch &&
      domainMatch[0].split('-')[0] === this._languageCode
    ) {
      [, this._countryCode] = domainMatch[0].split('-');
    }
  }

  get locale(): string {
    return this._countryCode
      ? `${this._locale}-${this._countryCode}`
      : this._locale;
  }

  get languageCode(): string {
    return this._languageCode;
  }

  get countryCode(): string | undefined {
    return this._countryCode;
  }

  /**
   * Utility function to avoid all misusages in the code
   */
  isEnglish(): boolean {
    return this._languageCode === 'en';
  }
}
