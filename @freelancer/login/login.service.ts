import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { AuthServiceInterface } from '@freelancer/auth';
import { Location } from '@freelancer/location';
import { LoginSignupService } from '@freelancer/login-signup';
import * as Rx from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LOGIN_AUTH_SERVICE } from './login.config';
import { LoginServiceInterface } from './login.interface';

/**
 * This service can be injected as a login service.
 * It redirects to the gaf/login.php page unless `w=t` is set.
 * In future this may just become a `NoRedirectLogin` service.
 */
@Injectable({
  providedIn: 'root',
})
export class Login implements LoginServiceInterface {
  constructor(
    @Inject(LOGIN_AUTH_SERVICE) private auth: AuthServiceInterface,
    private location: Location,
    private loginSignupService: LoginSignupService,
  ) {}

  redirect(
    currentUrl: string,
    routeSnapshot: ActivatedRouteSnapshot,
  ): Rx.Observable<boolean> {
    return this.auth.isLoggedIn().pipe(
      switchMap(loggedIn => {
        if (loggedIn) {
          return this.loggedInRedirect(routeSnapshot);
        }

        return Rx.of(true);
      }),
    );
  }

  private loggedInRedirect(
    routeSnapshot: ActivatedRouteSnapshot,
  ): Rx.Observable<boolean> {
    this.loginSignupService
      .getRedirectUrl('login', {
        redirectDisabled: false,
        queryParams: routeSnapshot.queryParams,
      })
      .then(redirectUrl => this.location.navigateByUrl(redirectUrl || '/'));

    return Rx.of(false);
  }
}
