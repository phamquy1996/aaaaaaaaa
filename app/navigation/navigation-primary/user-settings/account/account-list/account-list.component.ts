import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  UserGiveGetDetails,
  UserInfo,
  UserInfoSwitchUser,
} from '@freelancer/datastore/collections';
import { Feature } from '@freelancer/feature-flags';
import { PartnerDashboardAccess } from '@freelancer/partner-dashboard-access';
import { IconSize } from '@freelancer/ui/icon';
import { LinkColor, LinkIconPosition } from '@freelancer/ui/link';
import { ListItemPadding, ListItemType } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import {
  FontColor,
  FontWeight,
  TextSize,
  TextTransform,
} from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-account-list',
  template: `
    <fl-bit class="Heading">
      <fl-text
        i18n="Account heading"
        [flMarginRight]="Margin.MID"
        [size]="TextSize.XXSMALL"
        [textTransform]="TextTransform.UPPERCASE"
        [weight]="FontWeight.BOLD"
      >
        Account
      </fl-text>
      <fl-link
        i18n="Account manage"
        flTrackingLabel="Account-Manage"
        [iconName]="'ui-arrow-right'"
        [iconPosition]="LinkIconPosition.RIGHT"
        [iconSize]="IconSize.XSMALL"
        [link]="'/users/settings.php'"
        [size]="TextSize.XXSMALL"
      >
        Manage
      </fl-link>
    </fl-bit>

    <fl-list
      [padding]="ListItemPadding.SMALL"
      [type]="ListItemType.NON_BORDERED"
      [flMarginBottom]="Margin.SMALL"
      [flMarginBottomTablet]="Margin.NONE"
    >
      <fl-list-item>
        <fl-link
          *ngIf="userInfo"
          i18n="Account view profile"
          flTrackingLabel="Account-ViewProfile"
          [color]="LinkColor.DARK"
          [flMarginBottom]="Margin.SMALL"
          [link]="'/u/' + userInfo.username"
        >
          View Profile
        </fl-link>
      </fl-list-item>
      <fl-list-item *flFeature="Feature.MEMBERSHIPS">
        <fl-link
          i18n="Account manage membership"
          flTrackingLabel="Account-ManageMembership"
          [color]="LinkColor.DARK"
          [flMarginBottom]="Margin.SMALL"
          [link]="'/membership'"
        >
          Manage Membership
        </fl-link>
      </fl-list-item>
      <fl-list-item>
        <fl-link
          i18n="User settings"
          flTrackingLabel="Account-UserSettings"
          [color]="LinkColor.DARK"
          [flMarginBottom]="Margin.SMALL"
          [link]="'/users/settings.php'"
        >
          User Settings
        </fl-link>
      </fl-list-item>

      <fl-list-item>
        <fl-link
          i18n="Account insights"
          flTrackingLabel="Account-Insights"
          [color]="LinkColor.DARK"
          [flMarginBottom]="Margin.SMALL"
          [link]="'/insights'"
        >
          Discover Insights
        </fl-link>
      </fl-list-item>
      <fl-list-item>
        <fl-link
          i18n="Account support"
          flTrackingLabel="Account-Support"
          [color]="LinkColor.DARK"
          [flMarginBottom]="Margin.SMALL"
          [link]="'/support/categories'"
        >
          Get Support
        </fl-link>
      </fl-list-item>
      <ng-container *flFeature="Feature.GIVE_GET">
        <fl-list-item
          *ngIf="userGiveGetDetails && userGiveGetDetails.isEligible"
        >
          <fl-link
            i18n="Account invite friend"
            flTrackingLabel="Account-InviteFriend"
            [color]="LinkColor.DARK"
            [flMarginBottom]="Margin.SMALL"
            [link]="'/give'"
          >
            Invite Friend
          </fl-link>
        </fl-list-item>
      </ng-container>
      <fl-list-item *ngIf="hasPartnerDashboardAccess$ | async">
        <fl-link
          flTrackingLabel="PartnerDashboardLink"
          i18n="Partner dashboard navigation link"
          [color]="LinkColor.DARK"
          [flMarginBottom]="Margin.SMALL"
          [link]="'/partner-dashboard'"
        >
          Partner Dashboard
        </fl-link>
      </fl-list-item>
      <fl-list-item>
        <fl-link
          i18n="Account logout"
          flTrackingLabel="Account-Logout"
          [color]="LinkColor.DARK"
          [flMarginBottom]="Margin.SMALL"
          [link]="'/logout'"
        >
          Logout
        </fl-link>
      </fl-list-item>
    </fl-list>

    <ng-container *ngIf="userInfo && userInfo.canSwitchToUsers.length > 0">
      <fl-bit class="Heading Heading--switch">
        <fl-text
          i18n="SwitchAccount heading"
          [flMarginRight]="Margin.MID"
          [size]="TextSize.XXSMALL"
          [textTransform]="TextTransform.UPPERCASE"
          [weight]="FontWeight.BOLD"
        >
          Switch
        </fl-text>
      </fl-bit>

      <fl-list
        [padding]="ListItemPadding.SMALL"
        [type]="ListItemType.NON_BORDERED"
      >
        <fl-list-item *ngFor="let switchUserInfo of userInfo.canSwitchToUsers">
          <fl-button
            flTrackingLabel="Account-SwitchAccount"
            [display]="'block'"
            (click)="handleSwitchAccount(switchUserInfo)"
          >
            <app-user-card
              [balance]="switchUserInfo.balance"
              [rightIconName]="'ui-chevron-right'"
              [user]="switchUserInfo"
            ></app-user-card>
          </fl-button>
        </fl-list-item>
      </fl-list>
    </ng-container>
  `,
  styleUrls: ['./account-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountListComponent implements OnInit {
  Feature = Feature;
  FontColor = FontColor;
  TextSize = TextSize;
  FontWeight = FontWeight;
  IconSize = IconSize;
  LinkColor = LinkColor;
  LinkIconPosition = LinkIconPosition;
  ListItemPadding = ListItemPadding;
  ListItemType = ListItemType;
  Margin = Margin;
  TextTransform = TextTransform;

  @Input() userGiveGetDetails: UserGiveGetDetails;
  @Input() userInfo: UserInfo;

  @Output() switchAccount = new EventEmitter<UserInfoSwitchUser>();

  hasPartnerDashboardAccess$: Rx.Observable<boolean>;

  constructor(private partnerDashboardAccess: PartnerDashboardAccess) {}

  ngOnInit() {
    // Give the user access if they have permissions for at least one enterprise dashboard
    this.hasPartnerDashboardAccess$ = this.partnerDashboardAccess
      .getAccessibleDashboards()
      .pipe(map(dashboards => !!dashboards.length));
  }

  handleSwitchAccount(switchUserInfo: UserInfoSwitchUser) {
    this.switchAccount.emit(switchUserInfo);
  }
}
