import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { ABTest } from '@freelancer/abtest';
import { Auth } from '@freelancer/auth';
import { Datastore } from '@freelancer/datastore';
import { UsersSelfCollection } from '@freelancer/datastore/collections';
import { Localization } from '@freelancer/localization';
import { RedirectToPhp } from '@freelancer/redirect-to-php';
import { UserAgent } from '@freelancer/user-agent';
import { isDefined } from '@freelancer/utils';
import { CookieService } from '@laurentgoudet/ngx-cookie';
import * as Rx from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

const AB_TEST_NAME = 'T211099-webapp-user-search';
const AB_TEST_SPLIT = 0.2;

@Injectable()
export class SearchGuard implements CanActivate {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private abTest: ABTest,
    private auth: Auth,
    private cookies: CookieService,
    private datastore: Datastore,
    private localization: Localization,
    private redirectToPhp: RedirectToPhp,
    private router: Router,
    private userAgent: UserAgent,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const [, type = '/users', filters = ''] =
      state.url.match(/\/search(\/?[\w-]*)(\/?[\w-_/]*)/) ?? [];

    if (
      route.queryParams.w === 't' &&
      ['', '/users', '/projects', '/contests'].includes(type)
    ) {
      return Rx.of(true);
    }

    const url = ['/user', '/project', '/contest'].includes(type)
      ? `/search${type}s${filters}`
      : ['/users', '/projects', '/contests'].includes(type)
      ? state.url
      : '/search/users';

    if (isPlatformServer(this.platformId)) {
      return this.redirectToPhp.doRedirect(url);
    }

    if (type === '/freelancers') {
      this.router.navigate(['/search/users']);
      return Rx.of(false);
    }

    const userDocument = this.datastore.document<UsersSelfCollection>(
      'usersSelf',
      this.auth.getUserId(),
    );

    const user$ = userDocument.valueChanges();

    const showNonWebappOnError$ = userDocument.status$.pipe(
      filter(requestStatus => !!requestStatus.error),
      switchMap(() => this.redirectToPhp.doRedirect(state.url)),
    );

    const showWebapp$ = user$.pipe(
      switchMap(user => {
        const isEnterpriseUser =
          user.enterpriseIds && user.enterpriseIds.length > 0;

        if (this.abTest.isWhitelistUser()) {
          return Rx.of(true);
        }

        // Only show the projects and users webapp search pages in mobile
        if (this.userAgent.isMobileDevice() && type !== '/contests') {
          return Rx.of(true);
        }

        if (
          !this.abTest.shouldEnrol(AB_TEST_NAME, user.id, AB_TEST_SPLIT) ||
          !this.localization.isEnglish() ||
          ['/contests', '/projects'].includes(type) ||
          isEnterpriseUser ||
          isDefined(this.cookies.get('no_abtest')) ||
          route.queryParams.w === 'f' ||
          this.userAgent.isBrowserIE()
        ) {
          return this.redirectToPhp.doRedirect(url);
        }

        return this.abTest
          .getUserExperimentVariation(AB_TEST_NAME)
          .pipe(
            switchMap(variation =>
              variation === 'test'
                ? Rx.of(true)
                : this.redirectToPhp.doRedirect(url),
            ),
          );
      }),
    );

    return this.auth
      .isLoggedIn()
      .pipe(
        switchMap(isLoggedIn =>
          isLoggedIn
            ? Rx.race(showWebapp$, showNonWebappOnError$)
            : this.redirectToPhp.doRedirect(url),
        ),
      );
  }
}
