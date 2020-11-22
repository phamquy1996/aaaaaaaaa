import { Component, Input } from '@angular/core';
import { ProfileViewUser } from '@freelancer/datastore/collections';
import { Margin } from '@freelancer/ui/margin';
import { AvatarSize } from '@freelancer/ui/user-avatar';
import { UsernameSize } from '@freelancer/ui/username';

@Component({
  selector: 'app-user-portfolio-user-details',
  template: `
    <fl-bit class="UserDetailsContainer">
      <fl-user-avatar
        [flMarginRight]="Margin.XSMALL"
        [isOnline]="isOnline"
        [size]="AvatarSize.LARGE"
        [users]="[
          {
            username: user.username,
            avatar: user.avatarLarge
          }
        ]"
      >
      </fl-user-avatar>
      <fl-username
        [compact]="true"
        [country]="user?.location?.country?.code"
        [displayName]="user.publicName"
        [showUsernameTag]="false"
        [size]="UsernameSize.SMALL"
        [username]="user.username"
      ></fl-username>
    </fl-bit>
  `,
  styleUrls: ['./user-portfolio-user-details.component.scss'],
})
export class UserPortfolioUserDetailsComponent {
  AvatarSize = AvatarSize;
  Margin = Margin;
  UsernameSize = UsernameSize;

  @Input() isOnline: boolean;
  @Input() user: ProfileViewUser;
}
