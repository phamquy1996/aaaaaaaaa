import { Component, Input } from '@angular/core';
import { HeadingType } from '@freelancer/ui/heading';
import { LinkUnderline } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';
import { CrowdFavorite } from '../crowd-favorites.component';

@Component({
  selector: 'app-crowd-favorite-card',
  template: `
    <fl-link
      class="CrowdFavoriteCard"
      [link]="'post-project'"
      [queryParams]="crowdFavorite.queryParams"
      [underline]="LinkUnderline.NEVER"
      [flTrackingLabel]="'ProjectShowcase-' + crowdFavorite.qtsLabel"
      [flMarginBottomTablet]="Margin.LARGE"
      [flMarginRight]="Margin.MID"
      [flMarginRightTablet]="Margin.NONE"
    >
      <fl-bit class="CrowdFavoriteCard-media">
        <fl-bit class="CrowdFavoriteCard-media-imageContainer">
          <fl-picture
            class="CrowdFavoriteCard-media-imageContainer-image"
            alt="Crowd Favorite"
            i18n-alt="Crowd Favorite Alternative Text"
            [src]="crowdFavorite.image"
            [fullWidth]="true"
            [display]="PictureDisplay.BLOCK"
            [lazyLoad]="true"
          >
          </fl-picture>
          <fl-bit class="CrowdFavoriteCard-media-imageContainer-overlay">
            <fl-text
              class="CrowdFavoriteCard-media-imageContainer-overlayText"
              [color]="FontColor.LIGHT"
              [size]="TextSize.XSMALL"
              [weight]="FontWeight.BOLD"
            >
              {{ actionText }}
            </fl-text>
          </fl-bit>
        </fl-bit>
      </fl-bit>
      <fl-bit class="CrowdFavoriteCard-text">
        <fl-heading
          i18n="Crowd Favorite Card Title"
          [size]="TextSize.SMALL"
          [sizeTablet]="TextSize.MID"
          [headingType]="HeadingType.H3"
          [flMarginBottom]="Margin.XSMALL"
        >
          {{ title }}
        </fl-heading>

        <fl-text
          i18n="Crowd Favorite Card Price and Description"
          [size]="TextSize.SMALL"
          [sizeTablet]="TextSize.MID"
        >
          {{ isIndia ? rupeeDescription : dollarDescription }}
        </fl-text>
      </fl-bit>
    </fl-link>
  `,
  styleUrls: ['./crowd-favorite-card.component.scss'],
})
export class HomePageCrowdFavoriteCardComponent {
  HeadingType = HeadingType;
  FontWeight = FontWeight;
  FontColor = FontColor;
  LinkUnderline = LinkUnderline;
  Margin = Margin;
  PictureDisplay = PictureDisplay;
  TextSize = TextSize;

  @Input() title: string;
  @Input() dollarDescription: string;
  @Input() rupeeDescription: string;
  @Input() actionText: string;
  @Input() isIndia: boolean;
  @Input() crowdFavorite: CrowdFavorite;
}
