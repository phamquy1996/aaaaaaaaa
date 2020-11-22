import { Component, Input, OnInit } from '@angular/core';
import { Assets } from '@freelancer/ui/assets';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType, HeadingWeight } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay, PictureObjectFit } from '@freelancer/ui/picture';
import { FontColor, TextSize, TextTransform } from '@freelancer/ui/text';

@Component({
  selector: 'app-home-page-enterprise-upsell-card',
  template: `
    <fl-bit
      class="EnterpriseCard"
      [flTrackingSection]="'HomePage'"
      [ngStyle]="
        showBackground && {
          backgroundImage: ' url(' + backgroundImage + ')'
        }
      "
    >
      <fl-bit class="ImageWrapper">
        <fl-picture
          class="EnterpriseCard-image"
          alt="Laptop, mobile phone, stack of paper, and business cards"
          i18n-alt="Image for Enterprise upsell card"
          [flHideDesktopLarge]="true"
          [src]="'home/api-enterprise/enterprise_upsell.png'"
          [objectFit]="PictureObjectFit.CONTAIN"
          [boundedHeight]="true"
          [lazyLoad]="true"
          [fullWidth]="true"
        ></fl-picture>
      </fl-bit>
      <fl-bit class="EnterpriseCard-body">
        <fl-bit>
          <fl-text
            class="EnterpriseCard-body-subtext"
            i18n="Enterprise upsell card subtext"
            [color]="FontColor.INHERIT"
            [flMarginBottom]="Margin.XXSMALL"
            [size]="TextSize.XXSMALL"
            [sizeDesktop]="TextSize.XSMALL"
            [textTransform]="TextTransform.UPPERCASE"
          >
            Freelancer Enterprise
          </fl-text>
          <fl-heading
            class="EnterpriseCard-body-heading"
            i18n="Enterprise upsell card heading"
            [flMarginBottom]="Margin.XXSMALL"
            [headingType]="HeadingType.H3"
            [size]="TextSize.MID"
            [weight]="HeadingWeight.BOLD"
          >
            Company budget? Get more done for less
          </fl-heading>
          <fl-text
            i18n="API upsell card description"
            [flMarginBottom]="Margin.MID"
            [size]="TextSize.SMALL"
          >
            Use our workforce of 48 million to help your business achieve more.
          </fl-text>
        </fl-bit>
        <fl-button
          class="EnterpriseCard-cta"
          i18n="Label of Contact Us button for Enterprise"
          [flShowDesktopLarge]="true"
          [flTrackingLabel]="'ApiUpsell-EnterpriseButton'"
          [color]="ButtonColor.SECONDARY"
          [link]="'/enterprise'"
        >
          Contact Us
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./enterprise-upsell-card.component.scss'],
})
export class HomePageEnterpriseUpsellCardComponent implements OnInit {
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
      'home/api-enterprise/enterprise_upsell.png',
    );
  }
}
