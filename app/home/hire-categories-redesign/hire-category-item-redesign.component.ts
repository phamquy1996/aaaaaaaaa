import { Component, Input } from '@angular/core';
import { LinkHoverColor } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import { TextSize } from '@freelancer/ui/text';

export enum HireCategoryItemIconSize {
  MID = 'mid',
  SMALL = 'small',
}
@Component({
  selector: 'app-home-page-hire-category-item-redesign',
  template: `
    <fl-link
      class="CategoryItem"
      [flTrackingLabel]="'HireCategories-' + qtsLabel"
      [link]="'hire/' + seoUrl"
      [hoverColor]="LinkHoverColor.INHERIT"
    >
      <fl-bit class="CategoryItem-content">
        <fl-bit
          class="CategoryItem-icon-container"
          [flMarginBottomTablet]="Margin.XXXSMALL"
          [flMarginBottomDesktop]="Margin.NONE"
          [flMarginRightDesktop]="Margin.SMALL"
        >
          <fl-picture
            class="CategoryItem-icon"
            alt="Icon"
            i18n-alt="Hire category item icon alt text"
            [ngClass]="{
              'CategoryItem-icon--small':
                iconSize === HireCategoryItemIconSize.SMALL,
              'CategoryItem-icon--hidden': !isReady
            }"
            [fullWidth]="true"
            [display]="PictureDisplay.BLOCK"
            [src]="'home/hire-categories/' + assetPath + '.svg'"
            [lazyLoad]="true"
            (imageLoaded)="isReady = true"
          ></fl-picture>
        </fl-bit>
        <fl-text
          class="CategoryItem-name"
          [size]="TextSize.XXXSMALL"
          [sizeTablet]="TextSize.XXSMALL"
          [sizeDesktop]="TextSize.XSMALL"
        >
          {{ displayName }}
        </fl-text>
      </fl-bit>
    </fl-link>
  `,
  styleUrls: ['./hire-category-item-redesign.component.scss'],
})
export class HomePageHireCategoryItemRedesignComponent {
  HireCategoryItemIconSize = HireCategoryItemIconSize;
  LinkHoverColor = LinkHoverColor;
  Margin = Margin;
  PictureDisplay = PictureDisplay;
  TextSize = TextSize;

  @Input() displayName: string;
  @Input() seoUrl: string;
  @Input() assetPath: string;
  @Input() qtsLabel: string;
  @Input() iconSize = HireCategoryItemIconSize.MID;

  isReady = false;
}
