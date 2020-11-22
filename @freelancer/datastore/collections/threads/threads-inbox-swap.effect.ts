import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@freelancer/auth';
import { isWebsocketAction, TypedAction } from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import { Actions, Effect } from '@ngrx/effects';
import * as Rx from 'rxjs';
import { filter, tap } from 'rxjs/operators';

@Injectable()
export class ThreadsInboxSwapEffect {
  @Effect({ dispatch: false })
  readonly effect$ = Rx.combineLatest([
    this.actions$.pipe(filter(isWebsocketAction)),
    this.auth.getUserId(),
  ]).pipe(
    tap(([action, authUid]) => {
      const { payload } = action;
      // check if user was removed from thread
      if (
        payload.type === 'groupchat' &&
        payload.data.action === 'remove' &&
        payload.data.payload.members.includes(toNumber(authUid))
      ) {
        // clear inbox thread if we're in inbox
        if (this.router.url.startsWith('/messages')) {
          this.router.navigate(['/messages']);
        }
      }
    }),
  );

  constructor(
    private actions$: Actions<TypedAction>,
    private auth: Auth,
    private router: Router,
  ) {}
}
