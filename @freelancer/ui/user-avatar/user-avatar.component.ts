import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { OnlineIndicatorSize } from '@freelancer/ui/online-indicator';

export interface User {
  username: string;
  avatar?: string;
}

export enum AvatarSize {
  XXSMALL = 'xxsmall',
  XSMALL = 'xsmall',
  SMALL = 'small',
  MID = 'mid',
  LARGE = 'large',
  XLARGE = 'xlarge',
  XXLARGE = 'xxlarge',
  MAX = 'max',
}

@Component({
  selector: 'fl-user-avatar',
  template: `
    <fl-bit class="UserAvatar" *ngIf="!isMulti">
      <fl-bit
        class="UserAvatar-inner"
        [attr.data-size]="size"
        [attr.data-online-status]="
          isOnline !== undefined && size !== AvatarSize.XXSMALL
        "
      >
        <ng-container *ngIf="firstUser !== undefined; else loadingState">
          <figure class="ImgContainer">
            <img
              class="UserAvatar-img"
              *ngIf="firstUserHasPic"
              src="{{ firstUser?.avatar }}"
              alt="User Avatar"
              title="{{ firstUser?.username }}"
            />
            <fl-bit class="UserAvatarLetter" *ngIf="!firstUserHasPic">
              {{ firstUserLetter }}
            </fl-bit>
          </figure>
        </ng-container>
        <ng-template #loadingState>
          <fl-loading-text class="Loader" [padded]="false"></fl-loading-text>
        </ng-template>
        <fl-online-indicator
          class="OnlineStatus"
          *ngIf="isOnline !== undefined && size !== AvatarSize.XXSMALL"
          [border]="true"
          [username]="firstUser?.username"
          [isOnline]="isOnline"
          [size]="onlineIndicatorSize"
        ></fl-online-indicator>
      </fl-bit>
    </fl-bit>

    <fl-bit class="UserAvatar-multi" *ngIf="isMulti" [attr.data-size]="size">
      <fl-bit class="UserAvatar-multi-row">
        <fl-bit class="UserAvatar-content">
          <img
            class="UserAvatar-multi-img"
            *ngIf="firstUserHasPic"
            src="{{ firstUser?.avatar }}"
            alt="User Avatar"
            title="{{ firstUser?.username }}"
          />
          <fl-bit
            class="UserAvatar-multi-letter"
            *ngIf="!firstUserHasPic"
            [attr.data-size]="size"
          >
            {{ firstUserLetter }}
          </fl-bit>
        </fl-bit>

        <fl-bit class="UserAvatar-content">
          <img
            class="UserAvatar-multi-img"
            *ngIf="users.length > 2 && secondUserHasPic"
            src="{{ secondUser?.avatar }}"
            alt="User Avatar"
            title="{{ secondUser?.username }}"
          />
          <fl-bit
            class="UserAvatar-multi-letter"
            *ngIf="users.length > 2 && !secondUserHasPic"
            [attr.data-size]="size"
          >
            {{ secondUserLetter }}
          </fl-bit>
        </fl-bit>
      </fl-bit>

      <fl-bit class="UserAvatar-multi-row UserAvatar-multi-row--secondary">
        <fl-bit class="UserAvatar-content">
          <img
            class="UserAvatar-multi-img"
            *ngIf="users.length > 2 && thirdUserHasPic"
            src="{{ thirdUser?.avatar }}"
            alt="User Avatar"
            title="{{ thirdUser?.username }}"
          />
          <fl-bit
            class="UserAvatar-multi-letter"
            *ngIf="users.length > 2 && !thirdUserHasPic"
            [attr.data-size]="size"
          >
            {{ thirdUserLetter }}
          </fl-bit>
        </fl-bit>

        <fl-bit class="UserAvatar-content">
          <img
            class="UserAvatar-multi-img"
            *ngIf="bottomRightUser && bottomRightUserHasPic"
            src="{{ bottomRightUser?.avatar }}"
            alt="User Avatar"
            title="{{ bottomRightUser?.username }}"
          />
          <fl-bit
            class="UserAvatar-multi-letter"
            *ngIf="bottomRightUser && !bottomRightUserHasPic"
            [attr.data-size]="size"
          >
            {{ bottomRightUserLetter }}
          </fl-bit>
          <fl-bit
            class="UserAvatar-multi-letter"
            *ngIf="!bottomRightUser && bottomRightText"
            [attr.data-size]="size"
          >
            {{ bottomRightText }}
          </fl-bit>
        </fl-bit>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./user-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAvatarComponent implements OnChanges {
  @Input() users: ReadonlyArray<User | undefined>;

  @HostBinding('attr.data-size')
  @Input()
  size: AvatarSize = AvatarSize.MID;

  AvatarSize = AvatarSize;

  // This input is not supported. We know everyone loves round avatars, but you can't use them.
  // There are corporate and group users who upload square logos that shouldn't be rounded.
  // Don't use custom CSS to achieve this effect. Violating diffs will be shot on sight.
  // @Input() isCircle? = false;

  @Input() isOnline?: boolean;

  firstUser?: User;
  firstUserLetter?: string;
  firstUserHasPic: boolean;
  secondUser?: User;
  secondUserLetter?: string;
  secondUserHasPic: boolean;
  thirdUser?: User;
  thirdUserLetter?: string;
  thirdUserHasPic: boolean;
  fourthUser?: User;
  fourthUserLetter?: string;
  fourthUserHasPic: boolean;
  bottomRightUser?: User;
  bottomRightUserLetter?: string;
  bottomRightUserHasPic: boolean;
  bottomRightText?: string;
  isMulti: boolean;
  onlineIndicatorSize: OnlineIndicatorSize;

  readonly COUNT_LIMIT = 99;

  private hasPic(user?: User): user is User & { avatar: string } {
    return !!user && !!user.avatar;
  }

  private getLetter(user?: User) {
    // falsey check is OK because empty string should be undefined too.
    return !!user && !!user.username
      ? user.username[0].toUpperCase()
      : undefined;
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('users' in changes) {
      const users = changes.users.currentValue;
      if (users) {
        // Check if the user avatar is for multiple users.
        this.isMulti = users.length > 1;

        // TypeScript bug see https://github.com/Microsoft/TypeScript/pull/24672 and https://github.com/prettier/prettier/issues/4624
        // prettier-ignore
        [
          this.firstUser,
          this.secondUser,
          this.thirdUser,
          this.fourthUser
        ] = users;
        this.firstUserHasPic = this.hasPic(this.firstUser);
        this.firstUserLetter = this.getLetter(this.firstUser);
        this.secondUserHasPic = this.hasPic(this.secondUser);
        this.secondUserLetter = this.getLetter(this.secondUser);
        this.thirdUserHasPic = this.hasPic(this.thirdUser);
        this.thirdUserLetter = this.getLetter(this.thirdUser);
        this.fourthUserHasPic = this.hasPic(this.fourthUser);
        this.fourthUserLetter = this.getLetter(this.fourthUser);

        // Check for what to show for the bottom right user.
        if (users.length === 2) {
          [, this.bottomRightUser] = users;
          this.bottomRightText = undefined;
        } else if (users.length === 4) {
          [, , , this.bottomRightUser] = users;
          this.bottomRightText = undefined;
        } else if (users.length > 4) {
          const leftOverCount = users.length - 3;
          const count =
            leftOverCount > this.COUNT_LIMIT ? this.COUNT_LIMIT : leftOverCount;
          this.bottomRightText = `${count}+`;
          this.bottomRightUser = undefined;
        } else {
          this.bottomRightUser = undefined;
          this.bottomRightText = undefined;
        }

        this.bottomRightUserHasPic = this.hasPic(this.bottomRightUser);
        this.bottomRightUserLetter = this.getLetter(this.bottomRightUser);
      } else {
        this.isMulti = false;
        this.bottomRightUser = undefined;
        this.bottomRightText = undefined;
        this.bottomRightUserHasPic = false;
        this.bottomRightUserLetter = undefined;
      }
    }

    if ('size' in changes) {
      const size = changes.size.currentValue;
      switch (size) {
        case AvatarSize.MID:
          this.onlineIndicatorSize = OnlineIndicatorSize.MID;
          break;
        case AvatarSize.LARGE:
          this.onlineIndicatorSize = OnlineIndicatorSize.LARGE;
          break;
        case AvatarSize.XLARGE:
          this.onlineIndicatorSize = OnlineIndicatorSize.XLARGE;
          break;
        default:
          this.onlineIndicatorSize = OnlineIndicatorSize.SMALL;
      }
    }

    if (this.isMulti && typeof this.isOnline !== 'undefined') {
      console.error(
        'Online indicator may only be displayed on a single user avatar',
      );
    }
  }
}
