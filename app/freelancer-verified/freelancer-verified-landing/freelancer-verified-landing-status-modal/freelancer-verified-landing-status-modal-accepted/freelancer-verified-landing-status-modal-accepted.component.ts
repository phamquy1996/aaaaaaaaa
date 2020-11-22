import { Component } from '@angular/core';
import {
  Badge,
  BadgeSize,
  BadgeType,
  VerifiedBadgeType,
} from '@freelancer/ui/badge';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-freelancer-verified-landing-status-modal-accepted',
  template: `
    <fl-badge
      [badge]="verifiedBadge"
      [flMarginBottom]="Margin.SMALL"
      [size]="BadgeSize.LARGE"
    ></fl-badge>

    <fl-heading
      i18n="Freelancer Verified application accepted header"
      [flMarginBottom]="Margin.SMALL"
      [headingType]="HeadingType.H3"
      [size]="TextSize.LARGE"
    >
      Congratulations, you have been verified!
    </fl-heading>

    <fl-text
      i18n="Freelancer Verified application accepted description"
      [flMarginBottom]="Margin.MID"
    >
      Thank you for your interest in getting verified. Our team has approved
      your request. You should now see the Verified badge on your profile and
      bid card.
    </fl-text>

    <fl-button
      i18n="Browse projects button"
      flTrackingLabel="BrowseProjectsButton"
      [color]="ButtonColor.PRIMARY"
      [size]="ButtonSize.LARGE"
      [link]="'/search/projects'"
    >
      Browse Projects
    </fl-button>
  `,
})
export class FreelancerVerifiedLandingStatusModalAcceptedComponent {
  BadgeSize = BadgeSize;
  BadgeType = BadgeType;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  HeadingType = HeadingType;
  Margin = Margin;
  TextSize = TextSize;
  VerifiedBadgeType = VerifiedBadgeType;

  verifiedBadge: Badge = {
    type: BadgeType.VERIFIED,
    badge: VerifiedBadgeType.VERIFIED,
  };
}
