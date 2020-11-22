import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Auth, AuthConfig, AUTH_CONFIG } from '@freelancer/auth';
import { FreelancerHttp } from '@freelancer/freelancer-http';
import { TimeUtils } from '@freelancer/time-utils';
import { CookieService } from '@laurentgoudet/ngx-cookie';
import { filter, switchMap } from 'rxjs/operators';
import { ArrowCookieRefresherAjaxApi } from './arrow-cookie-refresher.backend-model';

@Injectable({
  providedIn: 'root',
})
export class ArrowCookieRefresher {
  /** Refresh interval (in milliseconds). Current: 2 hours */
  private TIME_INTERVAL = 1000 * 60 * 60 * 2;

  constructor(
    @Inject(AUTH_CONFIG) private authConfig: AuthConfig,
    private auth: Auth,
    private cookies: CookieService,
    private http: FreelancerHttp,
    private timeUtils: TimeUtils,
  ) {}

  init(): void {
    /**
     * Emits every `TIME_INTERVAL` milliseconds to call a php service which
     * calls an Arrow endpoint with the user's cookie and refreshes it.
     */
    this.auth
      .isLoggedIn()
      .pipe(
        filter(
          isLoggedIn =>
            isLoggedIn && this.authConfig.arrowFedCookie !== undefined,
        ),
        switchMap(() => this.timeUtils.rxTimer(0, this.TIME_INTERVAL)),
      )
      .subscribe(() => this.refreshCookie());
  }

  /**
   * Calls the arrow-refresh-cookie.php ajax-api service.
   * If the refresh fails, it removes the cookie and fails silently.
   */
  private refreshCookie(): void {
    if (this.authConfig.arrowFedCookie) {
      const arrowFedCookie = this.cookies.get(this.authConfig.arrowFedCookie);
      if (arrowFedCookie !== undefined) {
        this.http
          .get<ArrowCookieRefresherAjaxApi>(
            'enterprise/arrow-refresh-cookie.php',
            { isGaf: true },
          )
          .toPromise()
          // call successful, update cookie.
          .then(response =>
            response.status === 'success' &&
            response.result.value &&
            response.result.expiry
              ? this.updateCookie(response.result.value, response.result.expiry)
              : this.removeCookie(),
          )
          // call failed, remove cookie and fail silently
          .catch((err: HttpErrorResponse) => this.removeCookie());
      }
    }
  }

  private updateCookie(value: string, expiry: number): void {
    if (this.authConfig.arrowFedCookie) {
      this.cookies.put(this.authConfig.arrowFedCookie, value, {
        expires: new Date(expiry * 1000),
      });
    }
  }

  private removeCookie(): void {
    if (this.authConfig.arrowFedCookie) {
      this.cookies.remove(this.authConfig.arrowFedCookie);
    }
  }
}
