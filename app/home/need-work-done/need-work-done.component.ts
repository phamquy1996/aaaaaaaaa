import { Component } from '@angular/core';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import { TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-home-page-need-work-done',
  template: `
    <fl-heading
      class="NeedWorkDone-header"
      i18n="Need Work Done Header"
      [size]="TextSize.LARGE"
      [sizeTablet]="TextSize.XLARGE"
      [headingType]="HeadingType.H2"
      [flMarginBottom]="Margin.MID"
      [flMarginBottomTablet]="Margin.XLARGE"
    >
      Need work done?
    </fl-heading>

    <fl-grid>
      <fl-col
        [col]="12"
        [colTablet]="4"
        class="NeedWorkDone-list-item"
        [flMarginBottom]="Margin.MID"
      >
        <fl-bit class="NeedWorkDone-list-item-content">
          <fl-bit
            class="NeedWorkDone-list-item-imageMainContainer"
            [flMarginBottom]="Margin.SMALL"
            [flMarginBottomTablet]="Margin.MID"
          >
            <fl-bit class="NeedWorkDone-list-item-imageSubContainer">
              <fl-picture
                class="NeedWorkDone-list-item-imageSubContainer-image"
                alt="Post a Job Icon"
                i18n-alt="Post a Job Icon Alternative Text"
                [src]="'home/need-work-done/post-a-job.svg'"
                [fullWidth]="true"
                [alignCenter]="true"
                [lazyLoad]="true"
                [display]="PictureDisplay.BLOCK"
              ></fl-picture>
            </fl-bit>
          </fl-bit>

          <fl-heading
            class="NeedWorkDone-list-item-header"
            i18n="Post a Job Header"
            [size]="TextSize.SMALL"
            [sizeTablet]="TextSize.LARGE"
            [headingType]="HeadingType.H3"
            [flMarginBottom]="Margin.XXSMALL"
            [flMarginBottomTablet]="Margin.MID"
          >
            Post a job
          </fl-heading>
          <fl-text
            class="NeedWorkDone-list-item-description"
            i18n="Post a job description"
            [size]="TextSize.SMALL"
            [sizeTablet]="TextSize.MID"
          >
            It's easy. Simply post a job you need completed and receive
            competitive bids from freelancers within minutes.
          </fl-text>
        </fl-bit>
      </fl-col>

      <fl-col
        [col]="12"
        [colTablet]="4"
        class="NeedWorkDone-list-item"
        [flMarginBottom]="Margin.MID"
      >
        <fl-bit class="NeedWorkDone-list-item-content">
          <fl-bit
            class="NeedWorkDone-list-item-imageMainContainer"
            [flMarginBottom]="Margin.SMALL"
            [flMarginBottomTablet]="Margin.MID"
          >
            <fl-bit class="NeedWorkDone-list-item-imageSubContainer">
              <fl-picture
                class="NeedWorkDone-list-item-imageSubContainer-image"
                alt="Choose Freelancers Icon"
                i18n-alt="Choose Freelancers Icon Alternative Text"
                [src]="'home/need-work-done/choose-freelancers.svg'"
                [fullWidth]="true"
                [alignCenter]="true"
                [lazyLoad]="true"
                [display]="PictureDisplay.BLOCK"
              ></fl-picture>
            </fl-bit>
          </fl-bit>
          <fl-heading
            class="NeedWorkDone-list-item-header"
            i18n="Choose freelancers Header"
            [size]="TextSize.SMALL"
            [sizeTablet]="TextSize.LARGE"
            [headingType]="HeadingType.H3"
            [flMarginBottom]="Margin.XXSMALL"
            [flMarginBottomTablet]="Margin.MID"
          >
            Choose freelancers
          </fl-heading>
          <fl-text
            class="NeedWorkDone-list-item-description"
            i18n="Choose freelancers description"
            [size]="TextSize.SMALL"
            [sizeTablet]="TextSize.MID"
          >
            Whatever your needs, there will be a freelancer to get it done: from
            web design, mobile app development, virtual assistants, product
            manufacturing, and graphic design (and a whole lot more).
          </fl-text>
        </fl-bit>
      </fl-col>

      <fl-col
        [col]="12"
        [colTablet]="4"
        class="NeedWorkDone-list-item"
        [flMarginBottom]="Margin.MID"
      >
        <fl-bit class="NeedWorkDone-list-item-content">
          <fl-bit
            class="NeedWorkDone-list-item-imageMainContainer"
            [flMarginBottom]="Margin.SMALL"
            [flMarginBottomTablet]="Margin.MID"
          >
            <fl-bit class="NeedWorkDone-list-item-imageSubContainer">
              <fl-picture
                class="NeedWorkDone-list-item-imageSubContainer-image"
                alt="Pay Safely Icon"
                i18n-alt="Pay Safely Icon Alternative Text"
                [src]="'home/need-work-done/pay-safely.svg'"
                [fullWidth]="true"
                [alignCenter]="true"
                [lazyLoad]="true"
                [display]="PictureDisplay.BLOCK"
              ></fl-picture>
            </fl-bit>
          </fl-bit>
          <fl-heading
            class="NeedWorkDone-list-item-header"
            i18n="Pay Safely Header"
            [size]="TextSize.SMALL"
            [sizeTablet]="TextSize.LARGE"
            [headingType]="HeadingType.H3"
            [flMarginBottom]="Margin.XXSMALL"
            [flMarginBottomTablet]="Margin.MID"
          >
            Pay safely
          </fl-heading>
          <fl-text
            class="NeedWorkDone-list-item-description"
            i18n="Pay safely description"
            [size]="TextSize.SMALL"
            [sizeTablet]="TextSize.MID"
          >
            With secure payments and thousands of reviewed professionals to
            choose from, Freelancer.com is the simplest and safest way to get
            work done online.
          </fl-text>
        </fl-bit>
      </fl-col>
    </fl-grid>
  `,
  styleUrls: ['./need-work-done.component.scss'],
})
export class HomePageNeedWorkDoneComponent {
  HeadingType = HeadingType;
  Margin = Margin;
  PictureDisplay = PictureDisplay;
  TextSize = TextSize;
}
