import { Component, Input } from '@angular/core';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType, HeadingWeight } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, TextSize, TextTransform } from '@freelancer/ui/text';

@Component({
  selector: 'app-home-page-api-enterprise-card',
  template: `
    <fl-bit
      class="ApiEnterpriseCard"
      [ngClass]="{ 'ApiEnterpriseCard--reverse': isReverse }"
    >
      <fl-bit class="ApiEnterpriseCard-image-wrapper">
        <fl-picture
          class="ApiEnterpriseCard-image"
          [alt]="subtext"
          [src]="image"
          [lazyLoad]="true"
          [fullWidth]="true"
        ></fl-picture>
      </fl-bit>
      <fl-bit
        class="ApiEnterpriseCard-body"
        [ngClass]="{ 'ApiEnterpriseCard-body--left': isReverse }"
      >
        <fl-bit>
          <fl-text
            class="ApiEnterpriseCard-body-subtext"
            [color]="FontColor.INHERIT"
            [size]="TextSize.SMALL"
            [textTransform]="TextTransform.UPPERCASE"
            [flMarginBottom]="Margin.SMALL"
          >
            {{ subtext }}
          </fl-text>
          <fl-heading
            class="ApiEnterpriseCard-body-heading"
            [headingType]="HeadingType.H3"
            [size]="TextSize.MID"
            [weight]="HeadingWeight.BOLD"
            [flMarginBottom]="Margin.SMALL"
          >
            {{ header }}
          </fl-heading>
          <fl-text [size]="TextSize.SMALL" [flMarginBottom]="Margin.MID">
            {{ description }}
          </fl-text>
        </fl-bit>
        <fl-button
          class="ApiEnterpriseCard-cta"
          [ngClass]="{ 'ApiEnterpriseCard-cta--left': isReverse }"
          [flTrackingLabel]="trackingLabel"
          [color]="ButtonColor.PRIMARY_PINK"
          [link]="link"
        >
          {{ cta }}
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./api-enterprise-card.component.scss'],
})
export class HomePageApiEnterpriseCardComponent {
  ButtonColor = ButtonColor;
  FontColor = FontColor;
  HeadingType = HeadingType;
  HeadingWeight = HeadingWeight;
  Margin = Margin;
  TextSize = TextSize;
  TextTransform = TextTransform;

  @Input() subtext: string;
  @Input() header: string;
  @Input() description: string;
  @Input() cta: string;
  @Input() image: string;
  @Input() trackingLabel: string;
  @Input() link: string;
  @Input() isReverse = false;
}
