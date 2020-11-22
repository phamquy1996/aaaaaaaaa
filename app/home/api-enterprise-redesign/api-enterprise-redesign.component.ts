import { Component } from '@angular/core';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingColor, HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay, PictureObjectFit } from '@freelancer/ui/picture';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-home-page-api-enterprise-redesign',
  template: `
    <fl-bit class="ApiEnterprise" flTrackingSection="HomePage">
      <fl-picture
        class="ApiEnterprise-image ApiEnterprise-image-enterprise"
        alt="Enterprise Hero"
        i18n-alt="Enterprise Hero Alternative Text"
        [display]="PictureDisplay.BLOCK"
        [src]="'home/redesign/api-enterprise/enterprise-mobile-v2.jpg'"
        [srcTablet]="'home/redesign/api-enterprise/enterprise-tablet-v2.jpg'"
        [srcDesktop]="'home/redesign/api-enterprise/enterprise-desktop-v2.jpg'"
        [fullWidth]="true"
        [objectFit]="PictureObjectFit.COVER"
        [lazyLoad]="true"
      ></fl-picture>

      <fl-container class="ApiEnterprise-info">
        <fl-bit
          class="ApiEnterprise-info-container ApiEnterprise-info-enterprise"
          [flMarginRightTablet]="Margin.XXLARGE"
          [flMarginRightDesktop]="Margin.XSMALL"
        >
          <fl-heading
            i18n="Enterprise blade header"
            [color]="HeadingColor.LIGHT"
            [size]="TextSize.XLARGE"
            [sizeDesktop]="TextSize.XXXLARGE"
            [headingType]="HeadingType.H2"
          >
            Freelancer Enterprise
          </fl-heading>
          <fl-text
            i18n="Enterprise blade secondary header"
            [color]="FontColor.LIGHT"
            [size]="TextSize.LARGE"
            [sizeDesktop]="TextSize.XXLARGE"
            [weight]="FontWeight.LIGHT"
            [flMarginBottom]="Margin.SMALL"
            [flMarginBottomTablet]="Margin.SMALL"
            [flMarginBottomDesktop]="Margin.MID"
          >
            Take strategic advantage in your industry.
          </fl-text>
          <fl-text
            class="ApiEnterprise-info-description"
            i18n="Enterprise blade description"
            [color]="FontColor.LIGHT"
            [size]="TextSize.INHERIT"
            [sizeDesktop]="TextSize.LARGE"
            [flMarginBottom]="Margin.SMALL"
            [flMarginBottomTablet]="Margin.MID"
            [flMarginBottomDesktop]="Margin.LARGE"
          >
            Tap into over 45 million skilled professionals in over 1600 skills
            sets in 247 countries, regions and territories.
          </fl-text>
          <fl-button
            class="ApiEnterprise-cta ApiEnterprise-cta-enterprise"
            i18n="Button label for Enterprise blade"
            flTrackingLabel="ApiUpsell-EnterpriseButton"
            [color]="ButtonColor.CUSTOM"
            [size]="ButtonSize.XLARGE"
            [link]="'/enterprise'"
          >
            Learn More
          </fl-button>
        </fl-bit>
      </fl-container>
    </fl-bit>

    <fl-bit class="ApiEnterprise" flTrackingSection="HomePage">
      <fl-picture
        class="ApiEnterprise-image ApiEnterprise-image-api"
        alt="API Hero"
        i18n-alt="API Hero Alternative Text"
        [display]="PictureDisplay.BLOCK"
        [src]="'home/redesign/api-enterprise/api-mobile-v2.jpg'"
        [srcTablet]="'home/redesign/api-enterprise/api-tablet-v2.jpg'"
        [srcDesktop]="'home/redesign/api-enterprise/api-desktop-v2.jpg'"
        [fullWidth]="true"
        [objectFit]="PictureObjectFit.COVER"
        [lazyLoad]="true"
      ></fl-picture>

      <fl-container class="ApiEnterprise-info">
        <fl-bit
          class="ApiEnterprise-info-container ApiEnterprise-info-container-api"
        >
          <fl-heading
            i18n="API blade header"
            [color]="HeadingColor.LIGHT"
            [size]="TextSize.XLARGE"
            [sizeDesktop]="TextSize.XXXLARGE"
            [headingType]="HeadingType.H2"
          >
            Freelancer API
          </fl-heading>
          <fl-text
            i18n="API blade secondary header"
            [color]="FontColor.LIGHT"
            [size]="TextSize.LARGE"
            [sizeDesktop]="TextSize.XXLARGE"
            [weight]="FontWeight.LIGHT"
            [flMarginBottom]="Margin.SMALL"
            [flMarginBottomTablet]="Margin.SMALL"
            [flMarginBottomDesktop]="Margin.MID"
          >
            Task talent from software.
          </fl-text>
          <fl-text
            class="ApiEnterprise-info-description"
            i18n="API blade description"
            [color]="FontColor.LIGHT"
            [size]="TextSize.INHERIT"
            [sizeDesktop]="TextSize.LARGE"
            [flMarginBottom]="Margin.SMALL"
            [flMarginBottomTablet]="Margin.MID"
            [flMarginBottomDesktop]="Margin.LARGE"
          >
            Why set up costly infrastructure when you can make an API call to
            the cloud?
          </fl-text>
          <fl-button
            class="ApiEnterprise-cta ApiEnterprise-cta-api"
            i18n="Button label for API blade"
            [flTrackingLabel]="'ApiUpsell-ApiButton'"
            [color]="ButtonColor.CUSTOM"
            [size]="ButtonSize.XLARGE"
            [link]="'https://developers.freelancer.com/'"
          >
            View Documentation
          </fl-button>
        </fl-bit>
      </fl-container>
    </fl-bit>
  `,
  styleUrls: ['./api-enterprise-redesign.component.scss'],
})
export class HomePageApiEnterpriseRedesignComponent {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  FontColor = FontColor;
  FontWeight = FontWeight;
  HeadingColor = HeadingColor;
  HeadingType = HeadingType;
  Margin = Margin;
  PictureObjectFit = PictureObjectFit;
  PictureDisplay = PictureDisplay;
  TextSize = TextSize;
}
