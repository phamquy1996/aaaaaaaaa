import { Component, Input } from '@angular/core';
import { LinkHoverColor } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-home-page-hire-category-item',
  template: `
    <fl-link
      [flTrackingLabel]="'HireCategories-' + qtsLabel"
      [link]="'hire/' + seoUrl"
      [hoverColor]="LinkHoverColor.INHERIT"
    >
      <fl-bit class="CategoryItem" [flMarginBottom]="Margin.MID">
        <fl-picture
          class="CategoryItem-icon"
          [src]="'home/hire-categories/' + assetPath + '.svg'"
          [boundedHeight]="true"
          [lazyLoad]="true"
          [flMarginBottom]="Margin.SMALL"
        ></fl-picture>
        <fl-text class="CategoryItem-name" [size]="TextSize.XXSMALL">
          {{ displayName }}
        </fl-text>
      </fl-bit>
    </fl-link>
  `,
  styleUrls: ['./hire-category-item.component.scss'],
})
export class HomePageHireCategoryItemComponent {
  LinkHoverColor = LinkHoverColor;
  Margin = Margin;
  TextSize = TextSize;

  @Input() displayName: string;
  @Input() seoUrl: string;
  @Input() assetPath: string;
  @Input() qtsLabel: string;
}
