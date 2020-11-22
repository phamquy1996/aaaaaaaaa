import { ErrorHandler, Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Auth } from '@freelancer/auth';
import { Environment, ENVIRONMENT_NAME } from '@freelancer/config';
import { Location } from '@freelancer/location';
import { Pwa } from '@freelancer/pwa';
import { UI_CONFIG } from '@freelancer/ui/ui.config';
import { UiConfig } from '@freelancer/ui/ui.interface';
import { CookieService } from '@laurentgoudet/ngx-cookie';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ShellGuard implements CanActivate {
  constructor(
    @Inject(UI_CONFIG) private uiConfig: UiConfig,
    @Inject(ENVIRONMENT_NAME) private environment: Environment,
    private auth: Auth,
    private cookies: CookieService,
    private errorHandler: ErrorHandler,
    private location: Location,
    private pwa: Pwa,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const shouldBeLoggedIn = route.data.loggedIn;
    return this.auth.isLoggedIn().pipe(
      switchMap(async isLoggedIn => {
        // MBW redirect for /new-freelancer.
        // a mobile responsive version of the freelancer onboarding flow
        // currently does not exist. In the mean time we will redirect, newly
        // signed up mobile freelancers to the mobile web to finish the signup
        // flow. Remove this code once responsive freelancer onboarding is
        // implemented (TODO). Below are some additional requirements to trigger
        // the redirect.
        // - the app is not arrow, i.e. it's www.freelancer.com & the ccTLDs
        // - the app is not Capacitor (`this.pwa.isInstalled()`)
        // - the current domain is part of the ExtLB Dest_MDomain map (not
        // all domains are, e.g. fr.freelancer.com), i.e. it will be redirect
        // to a MBW domain
        // - the device user-agent is a mobile one as per the ExtLB regexes,
        // i.e. we can't just use UserAgent.isMobileDevice() here
        // - the mobile_optout query param is not true - this params allows
        // to bypass the test logic bypass, and only used for testing
        const currentDate = new Date();

        if (
          isLoggedIn &&
          !this.uiConfig.theme &&
          !this.pwa.isInstalled() &&
          this.isMobileReadyDomain() &&
          this.isMobileUserAgent() &&
          route.queryParamMap.get('mobile_optout') !== 'true' &&
          state.url.includes('/new-freelancer')
        ) {
          this.cookies.put('mobile_optout', 'false', {
            expires: new Date(
              currentDate.setTime(currentDate.getTime() + 60 * 1000),
            ),
          });
          const url = new URL(this.location.href);
          // This prevents circular directs & allows to log an error if
          // something went wrong
          if (!url.searchParams.has('mobile_redirected')) {
            // This allows to detect circular redirects. We don't want to
            // overload ngsw-bypass as it's used for other purposes
            url.searchParams.set('mobile_redirected', 'true');
            // Do trigger a hard reload. This should redirect 100% of the
            // time to the MBW, unless an A/B test logic bug
            this.location.redirect(url.toString());
            // Returning early here ensure that the rest of the shell guard
            // logic doesn't run
            return false;
          }
          // We should have redirected but did not: log an error as this is a
          // bug
          this.errorHandler.handleError(
            new Error(`${this.location.href} did not redirect to mobile web`),
          );
        }
        // End of MBW redirect logic.

        if (
          isLoggedIn !== shouldBeLoggedIn &&
          route.parent &&
          route.parent.routeConfig &&
          route.parent.routeConfig.children
        ) {
          // HACK: reverse the route config so the other route goes first
          // https://github.com/angular/angular/issues/16211
          route.parent.routeConfig.children.reverse();
          // then reload this route to access the reversed config
          // HACK 2: force the page to reload because we're doing a same url navigation
          this.router.onSameUrlNavigation = 'reload';
          // tslint:disable-next-line:no-navigate-by-url
          this.router.navigateByUrl(state.url).then(() => {
            this.router.onSameUrlNavigation = 'ignore';
          });
        }
        return isLoggedIn === shouldBeLoggedIn;
      }),
    );
  }

  // This dupplicates the Mobile_Browser map from rPP
  // roles/external_lb/manifests/nginx.pp
  isMobileUserAgent() {
    // eslint-disable-next-line no-restricted-properties, no-restricted-globals
    const ua = window.navigator.userAgent;
    if (/ipad/i.test(ua)) {
      return false;
    }
    if (
      /android.*mobile/i.test(ua) ||
      /blackberry/i.test(ua) ||
      /(iphone|ipod)/i.test(ua) ||
      /(avantgo|blazer|elaine|hiptop|palm|plucker|xiino)/i.test(ua) ||
      /windows ce; (iemobile|ppc|smartphone)/i.test(ua) ||
      /windows phone os/i.test(ua) ||
      /(Silk|kindle|mobile|mmp|midp|pocket|psp|symbian|smartphone|treo)/i.test(
        ua,
      ) ||
      /(up.browser|up.link|vodafone|wap|opera mini)/i.test(ua)
    ) {
      return true;
    }
    return false;
  }

  // This dupplicates the Dest_MDomain map from rPP
  // roles/external_lb/manifests/nginx.pp
  isMobileReadyDomain() {
    if (this.environment !== 'prod') {
      return true;
    }
    const mobileReadyDomains = [
      'www.freelancer.ca',
      'freelancer.ca',
      'www.freelancer.cl',
      'freelancer.cl',
      'www.freelancer.cn',
      'freelancer.cn',
      'www.freelancer.cz',
      'freelancer.cz',
      'www.freelancer.co.id',
      'freelancer.co.id',
      'www.freelancer.co.it',
      'freelancer.co.it',
      'www.freelancer.co.ke',
      'freelancer.co.ke',
      'www.freelancer.co.kr',
      'freelancer.co.kr',
      'www.freelancer.com.nl',
      'freelancer.com.nl',
      'www.freelancer.co.nz',
      'freelancer.co.nz',
      'www.freelancer.co.ro',
      'freelancer.co.ro',
      'www.freelancer.co.th',
      'freelancer.co.th',
      'www.freelancer.co.uk',
      'freelancer.co.uk',
      'www.freelancer.co.za',
      'freelancer.co.za',
      'www.freelancer.com',
      'freelancer.com',
      'www.freelancer.com.al',
      'freelancer.com.al',
      'www.freelancer.com.ar',
      'freelancer.com.ar',
      'www.freelancer.com.au',
      'freelancer.com.au',
      'www.freelancer.com.bd',
      'freelancer.com.bd',
      'www.freelancer.com.co',
      'freelancer.com.co',
      'www.freelancer.com.es',
      'freelancer.com.es',
      'www.freelancer.com.jm',
      'freelancer.com.jm',
      'www.freelancer.com.pe',
      'freelancer.com.pe',
      'www.freelancer.com.ru',
      'freelancer.com.ru',
      'www.freelancer.com.ua',
      'freelancer.com.ua',
      'www.freelancer.de',
      'freelancer.de',
      'www.freelancer.ec',
      'freelancer.ec',
      'www.freelancer.es',
      'freelancer.es',
      'www.freelancer.gr',
      'freelancer.gr',
      'www.freelancer.hu',
      'freelancer.hu',
      'www.freelancer.hk',
      'freelancer.hk',
      'www.freelancer.ie',
      'freelancer.ie',
      'www.freelancer.in',
      'freelancer.in',
      'www.freelancer.is',
      'freelancer.is',
      'www.freelancer.jp',
      'freelancer.jp',
      'www.freelancer.mx',
      'freelancer.mx',
      'www.freelancer.no',
      'freelancer.no',
      'www.freelancer.ph',
      'freelancer.ph',
      'www.freelancer.pk',
      'freelancer.pk',
      'www.freelancer.pl',
      'freelancer.pl',
      'www.freelancer.pt',
      'freelancer.pt',
      'www.freelancer.se',
      'freelancer.se',
      'www.freelancer.sg',
      'freelancer.sg',
      'www.freelancer.si',
      'freelancer.si',
      'www.freelancer.uy',
      'freelancer.uy',
      'www.syd1.fln-dev.net',
      'freelancer-staging.com',
      'www.freelancer-staging.com',
    ];
    return mobileReadyDomains.includes(this.location.hostname);
  }
}
