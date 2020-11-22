import { Component, Input } from '@angular/core';
import {
  PortfolioItem,
  ProfileCategory,
} from '@freelancer/datastore/collections';
import { HeadingColor, HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, TextSize, TextTransform } from '@freelancer/ui/text';

@Component({
  selector: 'app-user-portfolio-item-heading',
  template: `
    <fl-bit class="ItemContainer">
      <fl-heading
        i18n="Portfolio item detail title"
        [color]="darkBackground ? HeadingColor.LIGHT : HeadingColor.DARK"
        [flMarginBottom]="Margin.XXSMALL"
        [headingType]="HeadingType.H2"
        [size]="TextSize.XLARGE"
      >
        {{ portfolioItem.title ? portfolioItem.title : '(untitled)' }}
      </fl-heading>
      <fl-bit
        *ngIf="categories && categories.length > 0"
        class="ItemCategories"
      >
        <fl-text
          *ngFor="let item of categories; last as isLast"
          i18n="Portfolio items category list item"
          [color]="darkBackground ? FontColor.LIGHT : FontColor.MID"
          [flMarginRight]="Margin.XXXSMALL"
          [textTransform]="TextTransform.UPPERCASE"
        >
          {{ item.name }}{{ isLast ? '' : ', ' }}
        </fl-text>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./user-portfolio-item-heading.component.scss'],
})
export class UserPortfolioItemHeadingComponent {
  FontColor = FontColor;
  Margin = Margin;
  HeadingColor = HeadingColor;
  TextSize = TextSize;
  HeadingType = HeadingType;
  TextTransform = TextTransform;

  @Input() categories: ReadonlyArray<ProfileCategory>;
  @Input() darkBackground: boolean;
  @Input() portfolioItem: PortfolioItem;
}
