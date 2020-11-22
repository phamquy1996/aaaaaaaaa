import { APP_BASE_HREF, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import {
  FreelancerHttpConfig,
  FREELANCER_HTTP_CONFIG,
} from '@freelancer/freelancer-http';
import { Location } from '@freelancer/location';
import { PerformanceTracking } from '@freelancer/tracking';
import * as Rx from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RedirectToPhp {
  // We don't want to push states to the history if no route has been loaded,
  // i.e. if the webapp performed a redirect on start
  constructor(
    private performanceTracking: PerformanceTracking,
    @Inject(FREELANCER_HTTP_CONFIG)
    private freelancerHttpConfig: FreelancerHttpConfig,
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(APP_BASE_HREF) private baseHref: string,
  ) {}

  doRedirect(url: string): Rx.Observable<boolean> {
    // Add ?w=f (webapp false) search param to the URL in order to force the
    // PHP version on routes serving both webapp & php pages
    let redirectUrl: string;
    const u = this.baseHref
      ? new URL(
          `${this.location.origin}${this.baseHref.replace(/\/$/, '')}${url}`,
        )
      : new URL(`${this.location.origin}${url}`);
    const s = u.searchParams;
    s.set('w', 'f');
    u.search = s.toString();
    redirectUrl = u.toString();
    if (isPlatformBrowser(this.platformId)) {
      // Log the redirect time
      console.log(`redirected in ${Math.round(window.performance.now())} ms`);
      this.performanceTracking.mark('webapp_php_redirect', true);
    }
    if (
      this.location.hostname === 'localhost' ||
      this.location.hostname.startsWith('192.168.') ||
      this.location.hostname.startsWith('10.')
    ) {
      redirectUrl = `${this.freelancerHttpConfig.baseUrl}${u.pathname}${u.search}${u.hash}`;
    }
    return this.location.redirect(redirectUrl);
  }
}
