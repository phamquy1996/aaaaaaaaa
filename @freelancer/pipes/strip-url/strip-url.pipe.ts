import { Pipe, PipeTransform } from '@angular/core';
import Autolinker from 'autolinker';

@Pipe({
  name: 'stripUrl',
})
export class StripUrlPipe implements PipeTransform {
  private HTTP_PATTERN: RegExp = /^(http|https):\/\//;

  /**
   * This copies legacy's implementation that can be found:
   * `public/util/classes/StripURLService.php`.
   *
   * @param text The text to be stripped of urls.
   * @param replacementLabel The string to replace the links with.
   * @param useWhitelist If set to TRUE whitelisted urls will not be replaced.
   */
  transform(
    text: string,
    replacementLabel = '[login to view URL]',
    useWhitelist = false,
  ): string {
    return Autolinker.link(text, {
      replaceFn: match =>
        useWhitelist && this.isInternalWhitelistedUrl(match.getMatchedText())
          ? match.getMatchedText()
          : replacementLabel,
    });
  }

  private isInternalWhitelistedUrl(inputUrl: string): boolean {
    const url = inputUrl.match(this.HTTP_PATTERN)
      ? inputUrl
      : `http://${inputUrl}`;
    // Matches extracted by Autolinker aren't necessary valid URLs, e.g. phone
    // numbers with spaces
    let finalUrl;
    try {
      finalUrl = new URL(url).host.replace(/^www\./, '');
    } catch (e) {
      // Do nothing
    }

    return finalUrl
      ? this.getInternalWhitelistedUrls().includes(finalUrl)
      : false;
  }

  /**
   * This is taken from: `public/util/classes/StripURLService.php` if you are
   * adding something here also update that array too.
   */
  private getInternalWhitelistedUrls(): string[] {
    return [
      'angular.js',
      'asp.net',
      'backbone.js',
      'd3.js',
      'ember.js',
      'knockout.js',
      'microsoft.net',
      'node.js',
      'react.js',
      'vb.net',
      'freelancer.com',
      'freelancer.com.ua',
      'freelancer.com.au',
      'freelancer.co.nz',
      'freelancer.co.uk',
      'freelancer.hk',
      'freelancer.sg',
      'freelancer.ph',
      'freelancer.de',
      'freelancer.ca',
      'freelancer.co.za',
      'freelancer.com.jm',
      'freelancer.com.es',
      'freelancer.cl',
      'freelancer.cz',
      'freelancer.pk',
      'freelancer.com.bd',
      'freelancer.co.id',
      'freelancer.co.kr',
      'freelancer.mx',
      'freelancer.no',
      'freelancer.com.pe',
      'freelancer.ec',
      'freelancer.es',
      'freelancer.hu',
      'freelancer.ie',
      'freelancer.in',
      'freelancer.uy',
      'freelancer.pt',
      'freelancer.co.ro',
      'freelancer.com.ru',
      'freelancer.co.zw',
      'freelancer.cn',
      'freelancer.jp',
      'freelancer.gr',
      'freelancer.is',
      'freelancer.se',
      'freelancer.si',
      'freelancer.com.al',
      'freelancer.com.ar',
      'freelancer.com.co',
      'freelancer.co.ke',
      'freelancer.com.nl',
      'freelancer.co.th',
      'br.freelancer.com',
      'dk.freelancer.com',
      'fi.freelancer.com',
      'my.freelancer.com',
      'tr.freelancer.com',
      'vn.freelancer.com',
      'freelancer.pl',
      'freelancer.co.it',
      'freemarket.com',
      'fr.freelancer.com',
      'warriorforum.com',
      'escrow.com',
      'vue.js',
    ];
  }
}
