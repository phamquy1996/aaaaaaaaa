import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LOGIN_CONFIG, LOGIN_REDIRECT_SERVICE } from './login.config';
import { LoginConfig, LoginServiceInterface } from './login.interface';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(
    @Inject(LOGIN_REDIRECT_SERVICE) private loginService: LoginServiceInterface,
    @Inject(LOGIN_CONFIG) private loginConfig: LoginConfig,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.loginConfig.ssoIntegration) {
      return this.router.createUrlTree(['/saml_sso/sso.php'], {
        queryParams: {
          ...route.queryParams,
          integration: this.loginConfig.ssoIntegration,
        },
      });
    }
    return this.loginService.redirect(state.url, route);
  }
}
