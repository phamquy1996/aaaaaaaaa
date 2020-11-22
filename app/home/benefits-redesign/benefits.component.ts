import { Component } from '@angular/core';
import { CarouselArrowPosition } from '@freelancer/ui/carousel';
import { HeadingType } from '@freelancer/ui/heading';
import { IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import { TextAlign, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-home-page-redesign-benefits',
  template: `
    <fl-bit class="Benefits">
      <fl-heading
        class="Benefits-header"
        i18n="Benefits Header"
        [size]="TextSize.XLARGE"
        [sizeTablet]="TextSize.XXXLARGE"
        [headingType]="HeadingType.H2"
        [flMarginBottom]="Margin.LARGE"
        [flMarginBottomTablet]="Margin.XXXLARGE"
        [flMarginBottomDesktop]="Margin.XXXXLARGE"
      >
        What's great about it?
      </fl-heading>
      <fl-bit class="Benefits-list">
        <!-- Mobile -->
        <fl-carousel
          [arrowPosition]="CarouselArrowPosition.CENTER"
          [currentIndex]="currentIndex"
          [flShowMobile]="true"
          (slideChange)="handleSlideChange($event)"
        >
          <fl-carousel-prev-btn>
            <fl-icon [name]="'ui-arrow-left-alt'"></fl-icon>
          </fl-carousel-prev-btn>
          <fl-carousel-item class="Carousel-item">
            <ng-container *ngTemplateOutlet="browsePortfolios"></ng-container>
          </fl-carousel-item>
          <fl-carousel-item class="Carousel-item">
            <ng-container *ngTemplateOutlet="viewBids"></ng-container>
          </fl-carousel-item>
          <fl-carousel-item class="Carousel-item">
            <ng-container *ngTemplateOutlet="liveChat"></ng-container>
          </fl-carousel-item>
          <fl-carousel-item class="Carousel-item">
            <ng-container *ngTemplateOutlet="payForQuality"></ng-container>
          </fl-carousel-item>
          <fl-carousel-item class="Carousel-item">
            <ng-container *ngTemplateOutlet="trackProgress"></ng-container>
          </fl-carousel-item>
          <fl-carousel-item class="Carousel-item">
            <ng-container *ngTemplateOutlet="support"></ng-container>
          </fl-carousel-item>
          <fl-carousel-next-btn>
            <fl-icon [name]="'ui-arrow-right-alt'"></fl-icon>
          </fl-carousel-next-btn>
        </fl-carousel>

        <!-- Tablet and above -->
        <fl-grid [flHideMobile]="true">
          <fl-col
            [col]="6"
            [colDesktopSmall]="4"
            [flMarginBottom]="Margin.XXLARGE"
            [flMarginBottomDesktop]="Margin.XXXXLARGE"
          >
            <fl-bit class="Benefits-list-item">
              <ng-container *ngTemplateOutlet="browsePortfolios"></ng-container>
            </fl-bit>
          </fl-col>
          <fl-col
            [col]="6"
            [colDesktopSmall]="4"
            [flMarginBottom]="Margin.XXLARGE"
            [flMarginBottomDesktop]="Margin.XXXXLARGE"
          >
            <fl-bit class="Benefits-list-item">
              <ng-container *ngTemplateOutlet="viewBids"></ng-container>
            </fl-bit>
          </fl-col>
          <fl-col
            [col]="6"
            [colDesktopSmall]="4"
            [flMarginBottom]="Margin.XXLARGE"
            [flMarginBottomDesktop]="Margin.XXXXLARGE"
          >
            <fl-bit class="Benefits-list-item">
              <ng-container *ngTemplateOutlet="liveChat"></ng-container>
            </fl-bit>
          </fl-col>
          <fl-col
            [col]="6"
            [colDesktopSmall]="4"
            [flMarginBottom]="Margin.XXLARGE"
            [flMarginBottomDesktop]="Margin.NONE"
          >
            <fl-bit class="Benefits-list-item">
              <ng-container *ngTemplateOutlet="payForQuality"></ng-container>
            </fl-bit>
          </fl-col>
          <fl-col
            [col]="6"
            [colDesktopSmall]="4"
            [flMarginBottom]="Margin.LARGE"
            [flMarginBottomDesktop]="Margin.NONE"
          >
            <fl-bit class="Benefits-list-item">
              <ng-container *ngTemplateOutlet="trackProgress"></ng-container>
            </fl-bit>
          </fl-col>
          <fl-col
            [col]="6"
            [colDesktopSmall]="4"
            [flMarginBottom]="Margin.LARGE"
            [flMarginBottomDesktop]="Margin.NONE"
          >
            <fl-bit class="Benefits-list-item">
              <ng-container *ngTemplateOutlet="support"></ng-container>
            </fl-bit>
          </fl-col>
        </fl-grid>
      </fl-bit>
    </fl-bit>
    <ng-template #browsePortfolios>
      <fl-picture
        class="Benefits-list-item-image"
        alt="Icon for Browse portfolios"
        i18n-alt="Alt text for Browse portfolios icon"
        [src]="'home/redesign/benefits/browse-portfolios.svg'"
        [boundedWidth]="true"
        [display]="PictureDisplay.BLOCK"
        [lazyLoad]="true"
        [flMarginBottom]="Margin.LARGE"
      ></fl-picture>
      <fl-heading
        class="Benefits-list-item-heading"
        i18n="Header for Browse portfolios"
        [flMarginBottom]="Margin.XXSMALL"
        [size]="TextSize.LARGE"
        [headingType]="HeadingType.H3"
      >
        Browse portfolios
      </fl-heading>
      <fl-text
        class="Benefits-list-item-description"
        i18n="Description for Browse portfolios"
        [size]="TextSize.INHERIT"
        [textAlign]="TextAlign.CENTER"
      >
        Find professionals you can trust by browsing their samples of previous
        work and reading their profile reviews.
      </fl-text>
    </ng-template>
    <ng-template #viewBids>
      <fl-picture
        class="Benefits-list-item-image"
        alt="Icon for View bids"
        i18n-alt="Alt text for View bids icon"
        [src]="'home/redesign/benefits/view-bids.svg'"
        [boundedWidth]="true"
        [display]="PictureDisplay.BLOCK"
        [lazyLoad]="true"
        [flMarginBottom]="Margin.LARGE"
      ></fl-picture>
      <fl-heading
        class="Benefits-list-item-heading"
        i18n="Header for View bids"
        [flMarginBottom]="Margin.XXSMALL"
        [size]="TextSize.LARGE"
        [headingType]="HeadingType.H3"
      >
        View bids
      </fl-heading>
      <fl-text
        class="Benefits-list-item-description"
        i18n="Description for View bids"
        [size]="TextSize.INHERIT"
        [textAlign]="TextAlign.CENTER"
      >
        Receive free bids from our talented freelancers within seconds.
      </fl-text>
    </ng-template>
    <ng-template #liveChat>
      <fl-picture
        class="Benefits-list-item-image"
        alt="Icon for Live chat"
        i18n-alt="Alt text for Live chat icon"
        [src]="'home/redesign/benefits/live-chat.svg'"
        [boundedWidth]="true"
        [display]="PictureDisplay.BLOCK"
        [lazyLoad]="true"
        [flMarginBottom]="Margin.LARGE"
      ></fl-picture>
      <fl-heading
        class="Benefits-list-item-heading"
        i18n="Header for Live chat"
        [flMarginBottom]="Margin.XXSMALL"
        [size]="TextSize.LARGE"
        [headingType]="HeadingType.H3"
      >
        Live chat
      </fl-heading>
      <fl-text
        class="Benefits-list-item-description"
        i18n="Description for Live chat"
        [size]="TextSize.INHERIT"
        [textAlign]="TextAlign.CENTER"
      >
        You can live chat with your freelancers to get constant updates on the
        progress of your work.
      </fl-text>
    </ng-template>
    <ng-template #payForQuality>
      <fl-picture
        class="Benefits-list-item-image"
        alt="Icon for Pay for quality"
        i18n-alt="Alt text for Pay for quality icon"
        [src]="'home/redesign/benefits/pay.svg'"
        [boundedWidth]="true"
        [display]="PictureDisplay.BLOCK"
        [lazyLoad]="true"
        [flMarginBottom]="Margin.LARGE"
      ></fl-picture>
      <fl-heading
        class="Benefits-list-item-heading"
        i18n="Header for Pay for quality"
        [flMarginBottom]="Margin.XXSMALL"
        [size]="TextSize.LARGE"
        [headingType]="HeadingType.H3"
      >
        Pay for quality
      </fl-heading>
      <fl-text
        class="Benefits-list-item-description"
        i18n="Description for Pay for quality"
        [size]="TextSize.INHERIT"
        [textAlign]="TextAlign.CENTER"
      >
        Pay for work when it has been completed and you're 100% satisfied.
      </fl-text>
    </ng-template>
    <ng-template #trackProgress>
      <fl-picture
        class="Benefits-list-item-image"
        alt="Icon for Track progress"
        i18n-alt="Alt text for Track progress icon"
        [src]="'home/redesign/benefits/track-progress.svg'"
        [boundedWidth]="true"
        [display]="PictureDisplay.BLOCK"
        [lazyLoad]="true"
        [flMarginBottom]="Margin.LARGE"
      ></fl-picture>
      <fl-heading
        class="Benefits-list-item-heading"
        i18n="Header for Track progress"
        [flMarginBottom]="Margin.XXSMALL"
        [size]="TextSize.LARGE"
        [headingType]="HeadingType.H3"
      >
        Track progress
      </fl-heading>
      <fl-text
        class="Benefits-list-item-description"
        i18n="Description for Track progress"
        [size]="TextSize.INHERIT"
        [textAlign]="TextAlign.CENTER"
      >
        Keep up-to-date and on-the-go with our time tracker, and mobile app.
      </fl-text>
    </ng-template>
    <ng-template #support>
      <fl-picture
        class="Benefits-list-item-image"
        alt="Icon for 24/7 support"
        i18n-alt="Alt text for 24/7 support"
        [src]="'home/redesign/benefits/support.svg'"
        [boundedWidth]="true"
        [display]="PictureDisplay.BLOCK"
        [lazyLoad]="true"
        [flMarginBottom]="Margin.LARGE"
      ></fl-picture>
      <fl-heading
        class="Benefits-list-item-heading"
        i18n="Header for 24/7 support"
        [flMarginBottom]="Margin.XXSMALL"
        [size]="TextSize.LARGE"
        [headingType]="HeadingType.H3"
      >
        24/7 support
      </fl-heading>
      <fl-text
        class="Benefits-list-item-description"
        i18n="Description for 24/7 support"
        [size]="TextSize.INHERIT"
        [textAlign]="TextAlign.CENTER"
      >
        We're always here to help. Our support consists of real people who are
        available 24/7.
      </fl-text>
    </ng-template>
  `,
  styleUrls: ['./benefits.component.scss'],
})
export class HomePageRedesignBenefitsComponent {
  CarouselArrowPosition = CarouselArrowPosition;
  HeadingType = HeadingType;
  IconSize = IconSize;
  Margin = Margin;
  PictureDisplay = PictureDisplay;
  TextAlign = TextAlign;
  TextSize = TextSize;

  currentIndex = 0;

  handleSlideChange(index: number) {
    this.currentIndex = index;
  }
}
