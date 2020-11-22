import { Component, Input } from '@angular/core';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import { TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-home-page-benefits',
  template: `
    <fl-heading
      class="Benefits-header"
      i18n="Benefits Header"
      [size]="TextSize.LARGE"
      [sizeTablet]="TextSize.XLARGE"
      [sizeDesktop]="TextSize.XXXLARGE"
      [headingType]="HeadingType.H2"
      [flMarginBottom]="Margin.MID"
      [flMarginBottomTablet]="Margin.XLARGE"
      [flMarginBottomDesktop]="Margin.XXXXLARGE"
    >
      What's great about it?
    </fl-heading>
    <fl-grid class="Benefits-list">
      <fl-col
        class="Benefits-list-item"
        [col]="12"
        [colTablet]="6"
        [colDesktopLarge]="4"
        [flMarginBottom]="Margin.SMALL"
        [flMarginBottomDesktop]="Margin.MID"
      >
        <fl-bit
          class="Benefits-list-item-header"
          [flMarginBottom]="Margin.SMALL"
        >
          <fl-picture
            alt="Browse portfolios Icon"
            i18n-alt="Browse portfolios Icon Alternative Text"
            class="Benefits-list-item-image"
            src="home/benefits/browse-portfolios-v2.svg"
            [boundedWidth]="true"
            [display]="PictureDisplay.BLOCK"
            [lazyLoad]="true"
            [flMarginRight]="Margin.SMALL"
          ></fl-picture>
          <fl-heading
            class="Benefits-list-item-header-text"
            i18n="Browse portfolios Header"
            [size]="TextSize.SMALL"
            [sizeTablet]="TextSize.LARGE"
            [headingType]="HeadingType.H3"
          >
            Browse portfolios
          </fl-heading>
        </fl-bit>
        <fl-text
          class="Benefits-list-item-description"
          i18n="Browse portfolios description"
          [size]="TextSize.SMALL"
          [sizeTablet]="TextSize.MID"
          [sizeDesktop]="TextSize.MARKETING_SMALL"
          [flMarginBottom]="Margin.MID"
        >
          Find professionals you can trust by browsing their samples of previous
          work and reading their profile reviews.
        </fl-text>
      </fl-col>

      <fl-col
        class="Benefits-list-item"
        [col]="12"
        [colTablet]="6"
        [colDesktopLarge]="4"
        [flMarginBottom]="Margin.SMALL"
        [flMarginBottomDesktop]="Margin.MID"
      >
        <fl-bit
          class="Benefits-list-item-header"
          [flMarginBottom]="Margin.SMALL"
        >
          <fl-picture
            alt="View bids Icon"
            i18n-alt="View bids Icon Alternative Text"
            class="Benefits-list-item-image"
            src="home/benefits/view-bids-v2.svg"
            [boundedWidth]="true"
            [display]="PictureDisplay.BLOCK"
            [lazyLoad]="true"
            [flMarginRight]="Margin.SMALL"
          ></fl-picture>
          <fl-heading
            class="Benefits-list-item-header-text"
            i18n="View bids Header"
            [size]="TextSize.SMALL"
            [sizeTablet]="TextSize.LARGE"
            [headingType]="HeadingType.H3"
          >
            View bids
          </fl-heading>
        </fl-bit>
        <fl-text
          class="Benefits-list-item-description"
          i18n="View bids description"
          [size]="TextSize.SMALL"
          [sizeTablet]="TextSize.MID"
          [sizeDesktop]="TextSize.MARKETING_SMALL"
          [flMarginBottom]="Margin.MID"
        >
          Receive free bids from our talented freelancers within seconds.
        </fl-text>
      </fl-col>

      <fl-col
        class="Benefits-list-item"
        [col]="12"
        [colTablet]="6"
        [colDesktopLarge]="4"
        [flMarginBottom]="Margin.SMALL"
        [flMarginBottomDesktop]="Margin.MID"
      >
        <fl-bit
          class="Benefits-list-item-header"
          [flMarginBottom]="Margin.SMALL"
        >
          <fl-picture
            alt="Live chat Icon"
            i18n-alt="Live chat Icon Alternative Text"
            class="Benefits-list-item-image"
            src="home/benefits/live-chat-v2.svg"
            [boundedWidth]="true"
            [display]="PictureDisplay.BLOCK"
            [lazyLoad]="true"
            [flMarginRight]="Margin.SMALL"
          ></fl-picture>
          <fl-heading
            class="Benefits-list-item-header-text"
            i18n="Live chat Header"
            [size]="TextSize.SMALL"
            [sizeTablet]="TextSize.LARGE"
            [headingType]="HeadingType.H3"
          >
            Live chat
          </fl-heading>
        </fl-bit>
        <fl-text
          class="Benefits-list-item-description"
          i18n="Live chat description"
          [size]="TextSize.SMALL"
          [sizeTablet]="TextSize.MID"
          [sizeDesktop]="TextSize.MARKETING_SMALL"
          [flMarginBottom]="Margin.MID"
        >
          You can live chat with your freelancers to get constant updates on the
          progress of your work.
        </fl-text>
      </fl-col>

      <fl-col
        class="Benefits-list-item"
        [col]="12"
        [colTablet]="6"
        [colDesktopLarge]="4"
        [flMarginBottom]="Margin.SMALL"
        [flMarginBottomDesktop]="Margin.MID"
      >
        <fl-bit
          class="Benefits-list-item-header"
          [flMarginBottom]="Margin.SMALL"
        >
          <fl-picture
            alt="Pay for quality Icon"
            i18n-alt="Pay for quality Icon Alternative Text"
            class="Benefits-list-item-image"
            src="home/benefits/pay-v2.svg"
            [boundedWidth]="true"
            [display]="PictureDisplay.BLOCK"
            [lazyLoad]="true"
            [flMarginRight]="Margin.SMALL"
          ></fl-picture>
          <fl-heading
            class="Benefits-list-item-header-text"
            i18n="Pay for quality Header"
            [size]="TextSize.SMALL"
            [sizeTablet]="TextSize.LARGE"
            [headingType]="HeadingType.H3"
          >
            Pay for quality
          </fl-heading>
        </fl-bit>
        <fl-text
          class="Benefits-list-item-description"
          i18n="Pay for quality description"
          [size]="TextSize.SMALL"
          [sizeTablet]="TextSize.MID"
          [sizeDesktop]="TextSize.MARKETING_SMALL"
          [flMarginBottom]="Margin.MID"
        >
          Pay for work when it has been completed and you're 100% satisfied.
        </fl-text>
      </fl-col>

      <fl-col
        class="Benefits-list-item"
        [col]="12"
        [colTablet]="6"
        [colDesktopLarge]="4"
        [flMarginBottom]="Margin.SMALL"
        [flMarginBottomDesktop]="Margin.MID"
      >
        <fl-bit
          class="Benefits-list-item-header"
          [flMarginBottom]="Margin.SMALL"
        >
          <fl-picture
            alt="Track progress Icon"
            i18n-alt="Track progress Icon Alternative Text"
            class="Benefits-list-item-image"
            src="home/benefits/track-progress-v2.svg"
            [boundedWidth]="true"
            [display]="PictureDisplay.BLOCK"
            [lazyLoad]="true"
            [flMarginRight]="Margin.SMALL"
          ></fl-picture>
          <fl-heading
            class="Benefits-list-item-header-text"
            i18n="Track progress Header"
            [size]="TextSize.SMALL"
            [sizeTablet]="TextSize.LARGE"
            [headingType]="HeadingType.H3"
          >
            Track progress
          </fl-heading>
        </fl-bit>
        <fl-text
          class="Benefits-list-item-description"
          i18n="Track progress description"
          [size]="TextSize.SMALL"
          [sizeTablet]="TextSize.MID"
          [sizeDesktop]="TextSize.MARKETING_SMALL"
          [flMarginBottom]="Margin.MID"
        >
          Keep up-to-date and on-the-go with our time tracker, and mobile app.
        </fl-text>
      </fl-col>

      <fl-col
        class="Benefits-list-item"
        [col]="12"
        [colTablet]="6"
        [colDesktopLarge]="4"
        [flMarginBottom]="Margin.SMALL"
        [flMarginBottomDesktop]="Margin.MID"
      >
        <fl-bit
          class="Benefits-list-item-header"
          [flMarginBottom]="Margin.SMALL"
        >
          <fl-picture
            alt="24/7 support Icon"
            i18n-alt="24/7 support Icon Alternative Text"
            class="Benefits-list-item-image"
            src="home/benefits/support-v2.svg"
            [boundedWidth]="true"
            [display]="PictureDisplay.BLOCK"
            [lazyLoad]="true"
            [flMarginRight]="Margin.SMALL"
          ></fl-picture>
          <fl-heading
            class="Benefits-list-item-header-text"
            i18n="24/7 support Header"
            [size]="TextSize.SMALL"
            [sizeTablet]="TextSize.LARGE"
            [headingType]="HeadingType.H3"
          >
            24/7 support
          </fl-heading>
        </fl-bit>
        <fl-text
          class="Benefits-list-item-description"
          i18n="24/7 support description"
          [size]="TextSize.SMALL"
          [sizeTablet]="TextSize.MID"
          [sizeDesktop]="TextSize.MARKETING_SMALL"
          [flMarginBottom]="Margin.MID"
        >
          We're always here to help. Our support consists of real people who are
          available 24/7.
        </fl-text>
      </fl-col>
    </fl-grid>
  `,
  styleUrls: ['./benefits.component.scss'],
})
export class HomePageBenefitsComponent {
  HeadingType = HeadingType;
  Margin = Margin;
  PictureDisplay = PictureDisplay;
  TextSize = TextSize;

  @Input() isLoading: boolean;
}
