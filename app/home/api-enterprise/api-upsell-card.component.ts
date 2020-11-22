import { Component, Input, OnInit } from '@angular/core';
import { Assets } from '@freelancer/ui/assets';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType, HeadingWeight } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay, PictureObjectFit } from '@freelancer/ui/picture';
import { FontColor, TextSize, TextTransform } from '@freelancer/ui/text';

@Component({
  selector: 'app-home-page-api-upsell-card',
  template: `
    <fl-bit
      class="ApiCard"
      [flTrackingSection]="'HomePage'"
      [ngStyle]="
        showBackground && {
          backgroundImage: ' url(' + backgroundImage + ')'
        }
      "
    >
      <fl-bit class="ImageWrapper">
        <fl-picture
          class="ApiCard-image"
          alt="Illustration of the Freelancer API cloud service"
          i18n-alt="Image for API upsell card"
          [flHideDesktopLarge]="true"
          [src]="'home/api-enterprise/api_upsell.png'"
          [objectFit]="PictureObjectFit.CONTAIN"
          [boundedHeight]="true"
          [lazyLoad]="true"
          [fullWidth]="true"
        ></fl-picture>
      </fl-bit>
      <fl-bit class="ApiCard-body">
        <fl-bit>
          <fl-text
            class="ApiCard-body-subtext"
            i18n="API upsell card subtext"
            [color]="FontColor.INHERIT"
            [flMarginBottom]="Margin.XXSMALL"
            [size]="TextSize.XXSMALL"
            [sizeDesktop]="TextSize.XSMALL"
            [textTransform]="TextTransform.UPPERCASE"
          >
            Freelancer API
          </fl-text>
          <fl-heading
            class="ApiCard-body-heading"
            i18n="API upsell card heading"
            [flMarginBottom]="Margin.XXSMALL"
            [headingType]="HeadingType.H3"
            [size]="TextSize.MID"
            [weight]="HeadingWeight.BOLD"
          >
            48 million professionals on demand
          </fl-heading>
          <fl-text
            i18n="API upsell card description"
            [flMarginBottom]="Margin.MID"
            [size]="TextSize.SMALL"
          >
            Why hire people when you can simply integrate our talented cloud
            workforce instead?
          </fl-text>
        </fl-bit>
        <fl-button
          class="ApiCard-cta"
          i18n="Label of button to view API documentation"
          [flShowDesktopLarge]="true"
          [flTrackingLabel]="'ApiUpsell-ApiButton'"
          [color]="ButtonColor.SECONDARY"
          [link]="'https://developers.freelancer.com/'"
        >
          View Documentation
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./api-upsell-card.component.scss'],
})
export class HomePageApiUpsellCardComponent implements OnInit {
  ButtonColor = ButtonColor;
  FontColor = FontColor;
  HeadingType = HeadingType;
  HeadingWeight = HeadingWeight;
  Margin = Margin;
  PictureDisplay = PictureDisplay;
  PictureObjectFit = PictureObjectFit;
  TextSize = TextSize;
  TextTransform = TextTransform;

  backgroundImage: string;
  @Input() showBackground = false;

  constructor(private assets: Assets) {}

  ngOnInit() {
    this.backgroundImage = this.assets.getUrl(
      'home/api-enterprise/api_upsell.png',
    );
  }
}
