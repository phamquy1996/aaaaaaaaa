import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { RedirectToPhp } from './redirect-to-php.service';

/**
 * Use this guard on routes where the webapp version of the page hasn't
 * been implemented yet
 */
@Injectable({
  providedIn: 'root',
})
export class RedirectToPhpGuard implements CanActivate {
  constructor(private redirectToPhp: RedirectToPhp) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.redirectToPhp.doRedirect(state.url);
  }
}
