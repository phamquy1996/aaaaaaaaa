import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Auth } from '@freelancer/auth';
import { Datastore } from '@freelancer/datastore';
import { Enterprise, UsersCollection } from '@freelancer/datastore/collections';
import * as Rx from 'rxjs';
import { filter, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class DeloitteLoginSessionRefresher {
  constructor(
    private auth: Auth,
    private datastore: Datastore,
    private router: Router,
  ) {}

  init(): void {
    const isDeloitteUser$ = this.datastore
      .document<UsersCollection>('users', this.auth.getUserId())
      .valueChanges()
      .pipe(map(user => user.enterpriseIds?.includes(Enterprise.DELOITTE_DC)));

    Rx.combineLatest([
      this.router.events.pipe(filter(e => e instanceof NavigationStart)),
      isDeloitteUser$,
    ]).subscribe(([_, isDeloitteUser]) => {
      if (isDeloitteUser) {
        this.auth.refreshSession(1);
      }
    });
  }
}
