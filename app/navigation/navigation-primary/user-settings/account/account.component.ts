import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Auth } from '@freelancer/auth';
import {
  UserGiveGetDetails,
  UserInfo,
  UserInfoSwitchUser,
} from '@freelancer/datastore/collections';
import { Location } from '@freelancer/location';

@Component({
  selector: 'app-account',
  template: `
    <app-account-list
      [userGiveGetDetails]="userGiveGetDetails"
      [userInfo]="userInfo"
      (switchAccount)="handleSwitchAccount($event)"
    ></app-account-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {
  @Input() userGiveGetDetails: UserGiveGetDetails;
  @Input() userInfo: UserInfo;

  constructor(private auth: Auth, private location: Location) {}

  handleSwitchAccount(switchUserInfo: UserInfoSwitchUser) {
    this.auth.switchUser(switchUserInfo.userId.toString()).then(gotoUrl => {
      if (gotoUrl) {
        this.location.navigateByUrl(gotoUrl);
      }
    });
  }
}
