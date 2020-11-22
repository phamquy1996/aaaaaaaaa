import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthServiceInterface } from '@freelancer/auth';
import { LOGIN_AUTH_SERVICE } from '@freelancer/login';
import * as Rx from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoggedOutOnlyPageGuard implements CanActivate {
  constructor(
    @Inject(LOGIN_AUTH_SERVICE) private auth: AuthServiceInterface,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.auth.isLoggedIn().pipe(
      switchMap(loggedIn => {
        const { next } = route.queryParams;
        if (loggedIn) {
          return this.router.navigate([next || '/']);
        }
        return Rx.of(true);
      }),
    );
  }
}
