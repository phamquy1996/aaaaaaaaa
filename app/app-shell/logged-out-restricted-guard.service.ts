import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Auth } from '@freelancer/auth';
import { Applications, APP_NAME } from '@freelancer/config';
import { LoginConfig, LOGIN_CONFIG } from '@freelancer/login';
import { Pwa } from '@freelancer/pwa';
import { map } from 'rxjs/operators';
import { ShellConfig } from './shell-config.service';

/**
 * Guard which restricts access to logged-out pages
 *
 * When enabled, redirects to login on (almost) every page,
 * even ones that normally can be accessed when logged out.
 */
@Injectable({
  providedIn: 'root',
})
export class LoggedOutRestrictedGuard implements CanActivate {
  constructor(
    @Inject(LOGIN_CONFIG) private loginConfig: LoginConfig,
    @Inject(APP_NAME) private appName: Applications,
    private auth: Auth,
    private router: Router,
    private shellConfig: ShellConfig,
    private pwa: Pwa,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.auth.isLoggedIn().pipe(
      map(isLoggedIn => {
        const config = this.shellConfig.getRecursiveRouteData(route);
        // Capacitor apps always have restricted logged-out
        if (
          !isLoggedIn &&
          !config.bypassLoggedOutRestricted?.native &&
          this.pwa.isInstalled()
        ) {
          // Restricted access to homepage should not redirect back to
          // homepage once logged in/signed up, and instead let backend handle
          // next route
          const next =
            state.url === '/' ? undefined : encodeURIComponent(state.url);

          return this.router.createUrlTree(['/login'], {
            queryParams: {
              next,
            },
          });
        }

        if (
          !isLoggedIn &&
          // this build has restricted logged out
          this.loginConfig.loggedOutRestricted &&
          // and it's not bypassed in this specific app
          !config.bypassLoggedOutRestricted?.deloitte &&
          this.appName === 'deloitte'
        ) {
          return this.router.createUrlTree(['/login'], {
            queryParams: {
              next: encodeURIComponent(state.url),
            },
          });
        }
        return true;
      }),
    );
  }
}
