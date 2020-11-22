import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-hourly-hourly-award-sidebar',
  template: `
    <fl-heading
      class="SidebarItem"
      i18n="Hourly award as hourly sidebar title"
      [headingType]="HeadingType.H5"
      [size]="TextSize.MID"
      [flMarginBottom]="Margin.SMALL"
    >
      How do Hourly Projects work?
    </fl-heading>

    <fl-bit class="SidebarItem" [flMarginBottom]="Margin.SMALL">
      <fl-picture
        class="SidebarItem-icon"
        alt="Freelancer time-tracking icon"
        i18n-alt="Freelancer time-tracking icon"
        [src]="'project-view/icon-track.svg'"
        [flMarginBottom]="Margin.XSMALL"
      ></fl-picture>
      <fl-heading
        i18n="Hourly award as hourly sidebar item title"
        [headingType]="HeadingType.H6"
      >
        Freelancer tracks time
      </fl-heading>
      <fl-text i18n="Hourly award as hourly sidebar item description">
        Your freelancer tracks the number of hours they have worked each week.
      </fl-text>
    </fl-bit>

    <fl-bit class="SidebarItem" [flMarginBottom]="Margin.SMALL">
      <fl-picture
        class="SidebarItem-icon"
        alt="Freelancer billing icon"
        i18n-alt="Freelancer billing icon"
        [src]="'project-view/icon-bill.svg'"
        [flMarginBottom]="Margin.XSMALL"
      ></fl-picture>
      <fl-heading
        i18n="Hourly award as hourly sidebar item title"
        [size]="TextSize.XSMALL"
        [headingType]="HeadingType.H6"
      >
        Billing on Monday
      </fl-heading>
      <fl-text i18n="Hourly award as hourly sidebar item description">
        Every Monday, this amount is billed and a payment is created. This gives
        you time to review the amount of hours your freelancer has submitted.
      </fl-text>
    </fl-bit>

    <fl-bit class="SidebarItem" [flMarginBottom]="Margin.SMALL">
      <fl-picture
        class="SidebarItem-icon"
        alt="Wallet icon"
        i18n-alt="Wallet icon"
        [src]="'project-view/icon-release.svg'"
        [flMarginBottom]="Margin.XSMALL"
      ></fl-picture>
      <fl-heading
        i18n="Hourly award as hourly sidebar item title"
        [size]="TextSize.XSMALL"
        [headingType]="HeadingType.H6"
      >
        Paid on Wednesday
      </fl-heading>
      <fl-text i18n="Hourly award as hourly sidebar item description">
        By Wednesday of each week, this payment is released to your freelancer.
      </fl-text>
    </fl-bit>

    <fl-text
      class="SidebarItem"
      i18n="Automatic billing cancellation description"
      [color]="FontColor.MID"
    >
      You will always have the ability to turn off Automatic Billing, dispute
      your freelancer’s submitted hours, as well as set the weekly work limit of
      your freelancer.
      <fl-link
        flTrackingLabel="HourlyBidAwardModalLearnMoreButton"
        link="/support/employer/project/managing-hourly-projects"
        [newTab]="true"
      >
        Learn More
      </fl-link>
    </fl-text>
  `,
  styleUrls: ['./hourly-award-as-hourly-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HourlyAwardAsHourlySidebarComponent {
  Margin = Margin;
  TextSize = TextSize;
  HeadingType = HeadingType;
  FontColor = FontColor;
}
