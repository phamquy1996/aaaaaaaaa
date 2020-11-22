import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { UserBalance } from '@freelancer/datastore/collections';
import { Feature, FeatureFlagsService } from '@freelancer/feature-flags';
import { Badge, BadgeSize, BadgeType } from '@freelancer/ui/badge';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';
import { AvatarSize } from '@freelancer/ui/user-avatar';
import { UsernameColor } from '@freelancer/ui/username';
import * as Rx from 'rxjs';
import { NavigationUser } from '../../navigation-primary.model';

@Component({
  selector: 'app-user-card',
  template: `
    <fl-bit class="UserCard">
      <fl-user-avatar
        [flMarginRight]="Margin.XXSMALL"
        [size]="AvatarSize.SMALL"
        [users]="[user]"
      ></fl-user-avatar>

      <fl-bit class="UserCard-details" [flMarginRight]="Margin.XXSMALL">
        <fl-username
          *ngIf="user; else loadingUser"
          [color]="UsernameColor.INHERIT"
          [displayName]="user.publicName"
          [showUsernameTag]="showUsernameTag$ | async"
          [username]="user.username"
        ></fl-username>
        <fl-text
          *ngIf="balance; else loadingBalance"
          [color]="FontColor.INHERIT"
          [size]="TextSize.INHERIT"
        >
          {{ balance.amount | flCurrency: balance.currency.code }}
        </fl-text>
        <ng-template #loadingUser>
          <fl-loading-text
            class="LoadingTextContainer"
            [flMarginBottom]="Margin.XXXSMALL"
            [rows]="1"
            [padded]="false"
          ></fl-loading-text>
        </ng-template>
        <ng-template #loadingBalance>
          <fl-loading-text
            class="LoadingTextContainer"
            [rows]="1"
            [padded]="false"
          ></fl-loading-text>
        </ng-template>
      </fl-bit>

      <fl-bit class="UserCard-subDetails">
        <ng-container *flFeature="Feature.MEMBERSHIPS">
          <fl-badge
            *ngIf="user && user.membershipBadge"
            [badge]="membershipBadge"
            [flMarginRight]="Margin.XXSMALL"
            [size]="BadgeSize.MID"
          ></fl-badge>
        </ng-container>
        <fl-icon
          [name]="rightIconName"
          [size]="IconSize.XSMALL"
          [color]="FontColor.INHERIT"
        ></fl-icon>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./user-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent implements OnChanges {
  AvatarSize = AvatarSize;
  BadgeSize = BadgeSize;
  Feature = Feature;
  FontColor = FontColor;
  TextSize = TextSize;
  FontWeight = FontWeight;
  IconSize = IconSize;
  IconColor = IconColor;
  Margin = Margin;
  UsernameColor = UsernameColor;

  @Input() balance: UserBalance;
  @Input() rightIconName: string;
  @Input() user: NavigationUser;

  showUsernameTag$: Rx.Observable<boolean>;
  membershipBadge: Badge;

  constructor(private featureFlagService: FeatureFlagsService) {}

  ngOnChanges() {
    if (this.user && this.user.membershipBadge) {
      this.membershipBadge = {
        type: BadgeType.MEMBERSHIP,
        badge: this.user.membershipBadge,
      };
    }

    this.showUsernameTag$ = this.featureFlagService.getFlag(
      Feature.DISPLAY_USERNAME,
    );
  }
}
