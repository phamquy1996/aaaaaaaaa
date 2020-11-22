import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { UserBalance } from '@freelancer/datastore/collections';
import { Feature, FeatureFlagsService } from '@freelancer/feature-flags';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, TextSize } from '@freelancer/ui/text';
import { AvatarSize } from '@freelancer/ui/user-avatar';
import { UsernameColor } from '@freelancer/ui/username';
import * as Rx from 'rxjs';
import { NavigationUser } from '../../navigation-primary.model';

@Component({
  selector: 'app-user-card-revamp',
  template: `
    <fl-bit class="UserCard">
      <fl-user-avatar
        [flMarginRight]="Margin.XXSMALL"
        [size]="AvatarSize.SMALL"
        [users]="[user]"
      ></fl-user-avatar>

      <fl-bit class="UserCard-details">
        <fl-username
          *ngIf="user; else loadingUser"
          [color]="UsernameColor.INHERIT"
          [displayName]="!(showUsernameTag$ | async) ? user.publicName : ''"
          [showUsernameTag]="showUsernameTag$ | async"
          [truncateText]="true"
          [username]="user.username"
        ></fl-username>
        <!-- TODO: Limit balance to some length/chars in T221292 -->
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
    </fl-bit>
  `,
  styleUrls: ['./user-card-revamp.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardRevampComponent implements OnChanges {
  AvatarSize = AvatarSize;
  FontColor = FontColor;
  TextSize = TextSize;
  Margin = Margin;
  UsernameColor = UsernameColor;

  @Input() balance: UserBalance;
  @Input() user: NavigationUser;

  /** Use display name rather than user handle for Deloitte users */
  showUsernameTag$: Rx.Observable<boolean>;

  constructor(private featureFlagService: FeatureFlagsService) {}

  ngOnChanges() {
    this.showUsernameTag$ = this.featureFlagService.getFlag(
      Feature.DISPLAY_USERNAME,
    );
  }
}
