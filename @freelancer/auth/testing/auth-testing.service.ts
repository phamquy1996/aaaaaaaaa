import { isPlatformBrowser } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isDefined } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { filter, finalize, map, mapTo, skip, take, tap } from 'rxjs/operators';
import { AuthServiceInterface, AuthState } from '../auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthTesting implements AuthServiceInterface {
  private _authStateSubject$: Rx.ReplaySubject<string | undefined>;

  deviceToken$: Rx.Observable<string | undefined>;

  get authState$(): Rx.Observable<AuthState | undefined> {
    return this._authStateSubject$
      .asObservable()
      .pipe(map(userId => (userId ? { userId, token: 'token' } : undefined)));
  }

  constructor(@Inject(PLATFORM_ID) private platformId: string) {
    this._authStateSubject$ = new Rx.ReplaySubject(1);

    if (isPlatformBrowser(this.platformId)) {
      const userId = window.sessionStorage.getItem('authFakeUserId');

      if (userId) {
        this._authStateSubject$.next(userId);
      } else {
        this._authStateSubject$.next(undefined);
      }

      // keep auth cookies in sync with session
      this._authStateSubject$.pipe(skip(1)).subscribe(uId => {
        if (uId) {
          window.sessionStorage.setItem('authFakeUserId', uId);
        } else {
          window.sessionStorage.removeItem('authFakeUserId');
        }
      });
    }

    this.deviceToken$ = Rx.of('token');
  }

  getUserId(): Rx.Observable<string> {
    return this.authState$.pipe(
      filter(isDefined),
      map(auth => auth.userId),
    );
  }

  isLoggedIn(): Rx.Observable<boolean> {
    return this.authState$.pipe(map(state => !!state));
  }

  getAuthorizationHeader(): Rx.Observable<HttpHeaders> {
    return this.authState$.pipe(map(() => new HttpHeaders()));
  }

  setSession(userId: string) {
    this._authStateSubject$.next(userId);
  }

  deleteSession() {
    this._authStateSubject$.next(undefined);
  }

  switchUser(newUserId: string): Promise<string | undefined> {
    return this.authState$
      .pipe(
        take(1),
        tap(auth => {
          if (!auth) {
            throw new Error('no user to switch account from');
          }
        }),
        tap(() => this._authStateSubject$.next(newUserId)),
        map(() => `FIXME: gotoUrl`),
      )
      .toPromise();
  }

  logout(): Rx.Observable<undefined> {
    return this.authState$.pipe(
      take(1),
      tap(auth => {
        if (!auth) {
          throw new Error('no user to logout');
        }
      }),
      mapTo(undefined),
      finalize(() => this._authStateSubject$.next(undefined)),
    );
  }

  getCSRFToken(): string {
    return 'CSRFToken';
  }

  refreshSession(expiryHours: number): void {
    // do nothing
  }
}
