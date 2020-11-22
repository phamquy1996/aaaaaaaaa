import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import * as UAParser from 'ua-parser-js';

@Injectable({
  providedIn: 'root',
})
export class UserAgent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  isMobileDevice(): boolean {
    return this.getUserAgent().getDevice().type !== undefined;
  }

  /**
   * Checks if the browser in use is IE or not
   *
   * @remark
   *
   * WARNING: Avoid using this since you should generally not be running IE
   * specific code.
   */
  isBrowserIE(): boolean {
    const ua = this.getUserAgent();
    const { name } = ua.getBrowser();
    return name === 'IE';
  }

  getUserAgent() {
    if (isPlatformServer(this.platformId)) {
      throw new Error(
        'getUserAgent() cannot be used on the server as it will have unexpected effects due to the User-Agent not being part of the cache key in Varnish',
      );
    }
    return new UAParser(window.navigator.userAgent);
  }
}
