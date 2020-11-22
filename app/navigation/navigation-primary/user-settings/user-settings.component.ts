import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Auth } from '@freelancer/auth';
import { Datastore, DatastoreDocument } from '@freelancer/datastore';
import {
  UserBalance,
  UserBalancesCollection,
  UserGiveGetDetailsCollection,
  UserInfoCollection,
} from '@freelancer/datastore/collections';
import { Feature } from '@freelancer/feature-flags';
import { Margin } from '@freelancer/ui/margin';
import { isDefined } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-user-settings',
  template: `
    <app-finances
      *flFeature="Feature.ACCOUNT_BALANCE"
      class="Finances"
      flTrackingSection="NavigationPrimary"
      [defaultBalance]="defaultBalance$ | async"
      [userBalances]="userBalances$ | async"
    ></app-finances>
    <app-account
      class="Account"
      flTrackingSection="NavigationPrimary"
      [userGiveGetDetails]="userGiveGetDetailsDoc.valueChanges() | async"
      [userInfo]="userInfoDoc.valueChanges() | async"
    ></app-account>
  `,
  styleUrls: ['./user-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsComponent implements OnInit {
  Margin = Margin;
  Feature = Feature;

  defaultBalance$: Rx.Observable<UserBalance>;
  userBalances$: Rx.Observable<ReadonlyArray<UserBalance>>;
  userInfoDoc: DatastoreDocument<UserInfoCollection>;

  userGiveGetDetailsDoc: DatastoreDocument<UserGiveGetDetailsCollection>;

  constructor(private auth: Auth, private datastore: Datastore) {}

  ngOnInit() {
    const userId$ = this.auth.getUserId();

    this.userBalances$ = this.datastore
      .collection<UserBalancesCollection>('userBalances')
      .valueChanges()
      .pipe(
        map(balances =>
          // If the balance is 0 don't return the balance information
          // unless if the currency is the user's primary currency.
          balances.filter(balance => balance.amount !== 0 || balance.primary),
        ),
      );

    this.defaultBalance$ = this.userBalances$.pipe(
      map(userBalances => userBalances.find(balance => balance.primary)),
      filter(isDefined),
    );

    this.userInfoDoc = this.datastore.document<UserInfoCollection>(
      'userInfo',
      userId$,
    );

    this.userGiveGetDetailsDoc = this.datastore.document<
      UserGiveGetDetailsCollection
    >('userGiveGetDetails', userId$);
  }
}
