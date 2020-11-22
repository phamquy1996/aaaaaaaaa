import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthServiceInterface } from '@freelancer/auth';
import { Location } from '@freelancer/location';
import { finalize, map } from 'rxjs/operators';
import { LOGIN_AUTH_SERVICE, LOGIN_CONFIG } from './login.config';
import { LoginConfig } from './login.interface';

@Injectable({
  providedIn: 'root',
})
export class LogoutGuard implements CanActivate {
  constructor(
    private location: Location,
    @Inject(LOGIN_AUTH_SERVICE) private authService: AuthServiceInterface,
    @Inject(LOGIN_CONFIG) private loginConfig: LoginConfig,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.isLoggedIn().pipe(
      map(isLoggedIn => {
        const { next } = route.queryParams;
        // already logged out - just progress to next/homepage
        if (!isLoggedIn) {
          this.location.navigateByUrl(
            next || this.loginConfig.defaultLogoutRedirectUrl,
          );
          return false;
        }
        this.authService
          .logout()
          .pipe(
            finalize(() =>
              this.location.navigateByUrl(
                next || this.loginConfig.defaultLogoutRedirectUrl,
              ),
            ),
          )
          .toPromise();
        return true;
      }),
    );
  }
}
