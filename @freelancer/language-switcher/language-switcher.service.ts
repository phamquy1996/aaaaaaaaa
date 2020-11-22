import { Inject, Injectable } from '@angular/core';
import { Auth } from '@freelancer/auth';
import { Datastore } from '@freelancer/datastore';
import { UsersSelfCollection } from '@freelancer/datastore/collections';
import { LANGUAGE_COOKIE } from '@freelancer/localization';
import { Location } from '@freelancer/location';
import { Tracking } from '@freelancer/tracking';
import { CookieService } from '@laurentgoudet/ngx-cookie';

@Injectable()
export class LanguageSwitcher {
  constructor(
    private auth: Auth,
    private cookies: CookieService,
    private datastore: Datastore,
    private location: Location,
    private tracking: Tracking,
    @Inject(LANGUAGE_COOKIE) private languageCookie: string,
  ) {}

  /**
   * Update a page to show in the specified language
   */
  switchLanguage(languageCode: string): Promise<boolean> {
    return this.datastore
      .document<UsersSelfCollection>('usersSelf', this.auth.getUserId())
      .update({
        primaryLanguage: languageCode,
      })
      .then(() => {
        this.tracking.trackCustomEvent(
          'ChangeLanguageData',
          undefined, // section
          {
            language: languageCode,
          },
        );
        this.cookies.put(this.languageCookie, languageCode);
        const redirectUrl = new URL(this.location.href);
        redirectUrl.searchParams.set('lang', languageCode);
        return this.location.redirect(redirectUrl.toString()).toPromise();
      });
  }
}
