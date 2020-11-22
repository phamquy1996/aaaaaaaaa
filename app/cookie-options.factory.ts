import { isPlatformBrowser } from '@angular/common';
import { Location } from '@freelancer/location';
import { CookieOptions } from '@laurentgoudet/ngx-cookie';

export function cookieOptionsFactory(
  platformId: Object,
  location: Location,
): CookieOptions {
  return isPlatformBrowser(platformId)
    ? {
        path: '/',
        domain: location.hostname.match(/freelancer.*$/)
          ? `.${(location.hostname.match(/freelancer.*$/) as string[])[0]}`
          : `${location.hostname}`,
        secure: location.protocol === 'https:',
        sameSite: 'Lax',
      }
    : {};
}
