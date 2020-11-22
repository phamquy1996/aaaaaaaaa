import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { Auth } from '@freelancer/auth';
import * as Rx from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RedirectToPhp } from './redirect-to-php.service';

/**
 * Use this guard on routes where the logged-out version of the page isn't part
 * of the webapp yet.
 */
@Injectable({
  providedIn: 'root',
})
export class RedirectToPhpIfLoggedOutGuard implements CanActivate {
  constructor(private auth: Auth, private redirectToPhp: RedirectToPhp) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.auth.isLoggedIn().pipe(
      switchMap(isLoggedIn => {
        // Only show the webapp version to logged-in users
        if (!isLoggedIn) {
          return this.redirectToPhp.doRedirect(state.url);
        }
        return Rx.of(true);
      }),
    );
  }
}
