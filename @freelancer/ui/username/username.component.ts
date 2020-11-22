import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  Badge,
  BadgeSize,
  BadgeType,
  CorporateBadgeType,
  PreferredFreelancerBadgeType,
  VerifiedBadgeType,
} from '@freelancer/ui/badge';
import {
  HeadingColor,
  HeadingType,
  HeadingWeight,
} from '@freelancer/ui/heading';
import { LinkColor, QueryParams } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontType, FontWeight, TextSize } from '@freelancer/ui/text';

export enum UsernameSize {
  SMALL = 'small',
  MID = 'mid',
  LARGE = 'large',
  XLARGE = 'xlarge',
  XXLARGE = 'xxlarge',
}

export enum UsernameColor {
  DARK = 'dark',
  LIGHT = 'light',
  INHERIT = 'inherit',
}

export interface UsernameBadges {
  verified?: boolean;
  preferred_freelancer?: boolean;
  corporate?: boolean;
}

@Component({
  selector: 'fl-username',
  template: `
    <ng-container *ngIf="!isLink">
      <ng-container *ngIf="!isHeading">
        <fl-bit class="Username-row" [attr.data-truncate]="truncateText">
          <fl-flag
            *ngIf="country"
            class="Username-flag"
            [attr.data-size]="size"
            [country]="country"
            [flMarginRight]="Margin.XXSMALL"
          ></fl-flag>
          <fl-text
            *ngIf="displayName"
            class="Username-displayName"
            [attr.data-truncate]="truncateText"
            [color]="displayNameFontColor"
            [flMarginRight]="compact ? Margin.NONE : Margin.XXXSMALL"
            [fontType]="FontType.SPAN"
            [size]="usernameSize"
            [weight]="FontWeight.INHERIT"
          >
            {{ displayName }}
          </fl-text>
        </fl-bit>
        <fl-bit class="Username-row" [attr.data-truncate]="truncateText">
          <fl-text
            *ngIf="showUsernameTag"
            class="Username-userId"
            [attr.data-truncate]="truncateText"
            [attr.data-size]="size"
            [color]="usernameFontColor"
            [fontType]="FontType.SPAN"
            [size]="usernameSize"
            [weight]="FontWeight.INHERIT"
          >
            <ng-container *ngTemplateOutlet="userhandle"></ng-container>
          </fl-text>
          <ng-container
            *ngTemplateOutlet="userBadges; context: { badges: badges }"
          ></ng-container>
        </fl-bit>
      </ng-container>
      <ng-container *ngIf="isHeading">
        <fl-bit class="Username-row">
          <fl-flag
            *ngIf="country"
            class="Username-flag"
            [attr.data-size]="size"
            [country]="country"
            [flMarginRight]="Margin.XXSMALL"
          ></fl-flag>
          <fl-heading
            *ngIf="displayName"
            class="Username-displayName"
            [attr.data-truncate]="truncateText"
            [color]="displayNameHeadingColor"
            [flMarginRight]="compact ? Margin.NONE : Margin.XXXSMALL"
            [headingType]="HeadingType.H3"
            [size]="usernameSize"
            [weight]="HeadingWeight.INHERIT"
          >
            {{ displayName }}
          </fl-heading>
        </fl-bit>
        <fl-bit class="Username-row">
          <fl-heading
            *ngIf="showUsernameTag"
            class="Username-userId"
            [attr.data-compact]="compact"
            [attr.data-truncate]="truncateText"
            [attr.data-size]="size"
            [color]="usernameHeadingColor"
            [headingType]="HeadingType.H3"
            [size]="usernameSize"
            [weight]="HeadingWeight.INHERIT"
          >
            <ng-container *ngTemplateOutlet="userhandle"></ng-container>
          </fl-heading>
          <ng-container
            *ngTemplateOutlet="userBadges; context: { badges: badges }"
          ></ng-container>
        </fl-bit>
      </ng-container>
    </ng-container>
    <ng-container *ngIf="isLink">
      <fl-bit class="Username-row" [attr.data-truncate]="truncateText">
        <fl-flag
          *ngIf="country"
          class="Username-flag"
          [attr.data-size]="size"
          [country]="country"
          [flMarginRight]="Margin.XXSMALL"
        ></fl-flag>
        <fl-text
          *ngIf="displayName"
          class="Username-displayName"
          [attr.data-truncate]="truncateText"
          [color]="displayNameFontColor"
          [flMarginRight]="compact ? Margin.NONE : Margin.XXXSMALL"
          [fontType]="FontType.SPAN"
          [size]="usernameSize"
          [weight]="FontWeight.INHERIT"
        >
          {{ displayName }}
        </fl-text>
      </fl-bit>
      <fl-bit class="Username-row" [attr.data-truncate]="truncateText">
        <fl-text
          class="Username-userId"
          [color]="usernameFontColor"
          [fontType]="FontType.SPAN"
          [attr.data-truncate]="truncateText"
        >
          <fl-link
            *ngIf="showUsernameTag"
            [attr.data-size]="size"
            [color]="LinkColor.INHERIT"
            [link]="link"
            [newTab]="newTab"
            [size]="usernameSize"
            [queryParams]="queryParams"
          >
            <ng-container *ngTemplateOutlet="userhandle"></ng-container>
          </fl-link>
        </fl-text>
        <ng-container
          *ngTemplateOutlet="userBadges; context: { badges: badges }"
        ></ng-container>
      </fl-bit>
    </ng-container>

    <ng-template #userhandle>{{ '@' + username }}</ng-template>
    <ng-template #userBadges let-badges="badges">
      <fl-bit *ngIf="badges" class="Username-badges">
        <fl-tooltip
          *ngIf="badges.verified"
          class="Username-badge"
          i18n-message="Verified Freelancer badge tooltip message"
          message="Verified Freelancer"
        >
          <fl-badge [badge]="verifiedBadge" [size]="badgeSize"></fl-badge>
        </fl-tooltip>
        <fl-tooltip
          *ngIf="badges.preferred_freelancer"
          class="Username-badge"
          i18n-message="Preferred Freelancer badge tooltip message"
          message="Preferred Freelancer"
        >
          <fl-badge
            [badge]="preferredFreelancerBadge"
            [size]="badgeSize"
          ></fl-badge>
        </fl-tooltip>
        <fl-tooltip
          *ngIf="badges.corporate"
          class="Username-badge"
          i18n-message="Corporate Freelancer badge tooltip message"
          message="Corporate Freelancer"
        >
          <fl-badge [badge]="corporateBadge" [size]="badgeSize"></fl-badge>
        </fl-tooltip>
      </fl-bit>
    </ng-template>
  `,
  styleUrls: ['./username.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsernameComponent implements OnChanges, OnInit {
  BadgeSize = BadgeSize;
  FontColor = FontColor;
  TextSize = TextSize;
  FontType = FontType;
  FontWeight = FontWeight;
  HeadingType = HeadingType;
  HeadingWeight = HeadingWeight;
  LinkColor = LinkColor;
  Margin = Margin;
  UsernameSize = UsernameSize;
  BadgeType = BadgeType;

  badgeSize = BadgeSize.SMALL;
  displayNameFontColor: FontColor;
  displayNameHeadingColor: HeadingColor;
  usernameFontColor: FontColor;
  usernameHeadingColor: HeadingColor;
  usernameSize: TextSize;
  isHeading = false;

  verifiedBadge: Badge = {
    type: BadgeType.VERIFIED,
    badge: VerifiedBadgeType.VERIFIED,
  };

  preferredFreelancerBadge: Badge = {
    type: BadgeType.PREFERRED_FREELANCER,
    badge: PreferredFreelancerBadgeType.PREFERRED_FREELANCER,
  };

  corporateBadge: Badge = {
    type: BadgeType.CORPORATE,
    badge: CorporateBadgeType.CORPORATE,
  };

  @Input() color = UsernameColor.DARK;
  @Input() displayName: string;
  @Input() username: string;

  /** We don't advise the usage of country flags with new implementations of
  the username component. Please seek approval from management for permission
  to implement a country flag within the username component. */
  @Input() country?: string;
  @Input() queryParams?: QueryParams;
  @Input() link?: string;
  get isLink() {
    return this.link !== undefined ? this.link.length > 0 : false;
  }
  @Input() newTab?: boolean;
  @Input() truncateText?: boolean;

  @Input() size = UsernameSize.MID;

  @HostBinding('attr.data-compact')
  @Input()
  compact = false;

  /** We recommend to not use this option, username should always be shown. */
  @Input() showUsernameTag? = true;

  @Input() badges?: UsernameBadges;

  ngOnInit() {
    this.initializeUsername();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('color' in changes) {
      this.setUsernameColor();
    }

    if ('size' in changes) {
      this.setUsernameSize();
      this.setBadgeSize();
    }
  }

  initializeUsername() {
    this.setUsernameColor();
    this.setUsernameSize();
  }

  setBadgeSize() {
    switch (this.size) {
      case UsernameSize.XLARGE:
      case UsernameSize.XXLARGE:
        this.badgeSize = BadgeSize.MID;
        break;
      default:
        this.badgeSize = BadgeSize.SMALL;
    }
  }

  setUsernameColor() {
    switch (this.color) {
      case UsernameColor.LIGHT:
        this.displayNameFontColor = FontColor.LIGHT;
        this.displayNameHeadingColor = HeadingColor.LIGHT;
        this.usernameFontColor = FontColor.LIGHT;
        this.usernameHeadingColor = HeadingColor.LIGHT;
        break;
      case UsernameColor.INHERIT:
        this.displayNameFontColor = FontColor.INHERIT;
        this.displayNameHeadingColor = HeadingColor.INHERIT;
        this.usernameFontColor = FontColor.INHERIT;
        this.usernameHeadingColor = HeadingColor.INHERIT;
        break;
      default:
        this.displayNameFontColor = FontColor.DARK;
        this.displayNameHeadingColor = HeadingColor.DARK;
        this.usernameFontColor = FontColor.MID;
        this.usernameHeadingColor = HeadingColor.MID;
    }
  }

  setUsernameSize() {
    switch (this.size) {
      case UsernameSize.XXLARGE:
        this.isHeading = true;
        this.usernameSize = TextSize.LARGE;
        break;
      case UsernameSize.XLARGE:
        this.isHeading = true;
        this.usernameSize = TextSize.MID;
        break;
      case UsernameSize.LARGE:
        this.isHeading = false;
        this.usernameSize = TextSize.SMALL;
        break;
      case UsernameSize.SMALL:
        this.isHeading = false;
        this.usernameSize = TextSize.XXSMALL;
        break;
      default:
        this.isHeading = false;
        this.usernameSize = TextSize.XSMALL;
    }
  }

  trackByType(_: number, badge: Badge): BadgeType {
    return badge.type;
  }
}
