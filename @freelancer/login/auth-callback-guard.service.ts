import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthServiceInterface } from '@freelancer/auth';
import { Location } from '@freelancer/location';
import { mapTo } from 'rxjs/operators';
import { LOGIN_AUTH_SERVICE } from './login.config';

@Injectable({
  providedIn: 'root',
})
export class AuthCallbackGuard implements CanActivate {
  constructor(
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(LOGIN_AUTH_SERVICE) private authService: AuthServiceInterface,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // We render the empty component on the server as we obviously can't set
    // the session there: once returned, the app will bootstrap on the same
    // route, and this guard will be executed again
    if (isPlatformServer(this.platformId)) {
      return true;
    }
    const { uid, token, next } = route.queryParams;
    this.authService.setSession(uid, decodeURIComponent(token));
    return this.location
      .navigateByUrl(decodeURIComponent(next))
      .pipe(mapTo(false));
  }
}
