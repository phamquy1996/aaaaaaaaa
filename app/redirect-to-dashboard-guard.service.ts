import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { Auth } from '@freelancer/auth';
import { Location } from '@freelancer/location';
import * as Rx from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RedirectToDashboardGuard implements CanActivate {
  constructor(private location: Location, private auth: Auth) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.auth.isLoggedIn().pipe(
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          return this.location.navigateByUrl('/dashboard').toPromise();
        }

        return Rx.of(true);
      }),
    );
  }
}
