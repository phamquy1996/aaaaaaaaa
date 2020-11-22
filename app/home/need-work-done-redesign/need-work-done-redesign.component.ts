import { Component } from '@angular/core';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import { TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-home-page-need-work-done-redesign',
  template: `
    <fl-heading
      class="NeedWorkDone-header"
      i18n="Need Work Done Header"
      [size]="TextSize.LARGE"
      [sizeTablet]="TextSize.XLARGE"
      [sizeDesktop]="TextSize.XXXLARGE"
      [headingType]="HeadingType.H2"
      [flMarginBottom]="Margin.MID"
      [flMarginBottomTablet]="Margin.XLARGE"
      [flMarginBottomDesktop]="Margin.XXXXLARGE"
    >
      Need something done?
    </fl-heading>

    <fl-grid>
      <fl-col
        [col]="12"
        [colDesktopSmall]="4"
        [flMarginBottom]="Margin.LARGE"
        [flMarginBottomTablet]="Margin.XLARGE"
        [flMarginBottomDesktop]="Margin.NONE"
      >
        <fl-bit
          class="NeedWorkDone-item-header"
          [flMarginBottom]="Margin.XXSMALL"
          [flMarginBottomDesktop]="Margin.LARGE"
        >
          <fl-picture
            class="NeedWorkDone-item-header-image"
            alt="Post a Job Icon"
            i18n-alt="Post a Job Icon Alternative Text"
            [ngClass]="{
              'NeedWorkDone-item-header-image--hidden': !isIcon1Ready
            }"
            [src]="'home/need-work-done/post-a-job-v3.svg'"
            [fullWidth]="true"
            [alignCenter]="true"
            [lazyLoad]="true"
            [display]="PictureDisplay.BLOCK"
            [flMarginRight]="Margin.SMALL"
            (imageLoaded)="isIcon1Ready = true"
          ></fl-picture>

          <fl-heading
            i18n="Post a Job Header"
            [size]="TextSize.SMALL"
            [sizeTablet]="TextSize.LARGE"
            [headingType]="HeadingType.H3"
          >
            Post a job
          </fl-heading>
        </fl-bit>
        <fl-text
          class="NeedWorkDone-item-description"
          i18n="Post a job description"
          [size]="TextSize.SMALL"
          [sizeTablet]="TextSize.MID"
          [sizeDesktop]="TextSize.MARKETING_SMALL"
        >
          It's easy. Simply post a job you need completed and receive
          competitive bids from freelancers within minutes.
        </fl-text>
      </fl-col>

      <fl-col
        [col]="12"
        [colDesktopSmall]="4"
        [flMarginBottom]="Margin.LARGE"
        [flMarginBottomTablet]="Margin.XLARGE"
        [flMarginBottomDesktop]="Margin.NONE"
      >
        <fl-bit
          class="NeedWorkDone-item-header"
          [flMarginBottom]="Margin.XXSMALL"
          [flMarginBottomDesktop]="Margin.LARGE"
        >
          <fl-picture
            class="NeedWorkDone-item-header-image"
            alt="Choose Freelancers Icon"
            i18n-alt="Choose Freelancers Icon Alternative Text"
            [ngClass]="{
              'NeedWorkDone-item-header-image--hidden': !isIcon2Ready
            }"
            [src]="'illustrations/work.svg'"
            [fullWidth]="true"
            [alignCenter]="true"
            [lazyLoad]="true"
            [display]="PictureDisplay.BLOCK"
            [flMarginRight]="Margin.SMALL"
            (imageLoaded)="isIcon2Ready = true"
          ></fl-picture>

          <fl-heading
            i18n="Choose freelancers Header"
            [size]="TextSize.SMALL"
            [sizeTablet]="TextSize.LARGE"
            [headingType]="HeadingType.H3"
          >
            Choose freelancers
          </fl-heading>
        </fl-bit>
        <fl-text
          class="NeedWorkDone-item-description"
          i18n="Choose freelancers description"
          [size]="TextSize.SMALL"
          [sizeTablet]="TextSize.MID"
          [sizeDesktop]="TextSize.MARKETING_SMALL"
        >
          Whatever your needs, there will be a freelancer to get it done: from
          web design, mobile app development, virtual assistants, product
          manufacturing, and graphic design (and a whole lot more).
        </fl-text>
      </fl-col>

      <fl-col [col]="12" [colDesktopSmall]="4">
        <fl-bit
          class="NeedWorkDone-item-header"
          [flMarginBottom]="Margin.XXSMALL"
          [flMarginBottomDesktop]="Margin.LARGE"
        >
          <fl-picture
            class="NeedWorkDone-item-header-image"
            alt="Pay Safely Icon"
            i18n-alt="Pay Safely Icon Alternative Text"
            [ngClass]="{
              'NeedWorkDone-item-header-image--hidden': !isIcon3Ready
            }"
            [src]="'home/need-work-done/pay-safely-v3.svg'"
            [fullWidth]="true"
            [alignCenter]="true"
            [lazyLoad]="true"
            [display]="PictureDisplay.BLOCK"
            [flMarginRight]="Margin.SMALL"
            (imageLoaded)="isIcon3Ready = true"
          ></fl-picture>

          <fl-heading
            i18n="Pay Safely Header"
            [size]="TextSize.SMALL"
            [sizeTablet]="TextSize.LARGE"
            [headingType]="HeadingType.H3"
          >
            Pay safely
          </fl-heading>
        </fl-bit>
        <fl-text
          class="NeedWorkDone-item-description"
          i18n="Pay safely description"
          [size]="TextSize.SMALL"
          [sizeTablet]="TextSize.MID"
          [sizeDesktop]="TextSize.MARKETING_SMALL"
        >
          With secure payments and thousands of reviewed professionals to choose
          from, Freelancer.com is the simplest and safest way to get work done
          online.
        </fl-text>
      </fl-col>
    </fl-grid>
  `,
  styleUrls: ['./need-work-done-redesign.component.scss'],
})
export class HomePageNeedWorkDoneRedesignComponent {
  HeadingType = HeadingType;
  Margin = Margin;
  PictureDisplay = PictureDisplay;
  TextSize = TextSize;

  isIcon1Ready = false;
  isIcon2Ready = false;
  isIcon3Ready = false;
}
