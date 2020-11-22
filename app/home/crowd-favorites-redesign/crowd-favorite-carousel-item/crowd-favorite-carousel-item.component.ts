import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { PictureObjectFit } from '@freelancer/ui/picture';

@Component({
  selector: 'app-crowd-favorite-carousel-item',
  template: `
    <fl-bit
      *ngIf="isVisible"
      class="CarouselItem"
      [style.transform]="'translateX(' + leftOffset + '%)'"
      [style.width.%]="carouselItemWidth"
    >
      <fl-button
        class="CarouselItem-button"
        [display]="'block'"
        [link]="link"
        [flTrackingLabel]="qtsLabel"
      >
        <fl-bit class="CarouselItem-imageWrapper">
          <fl-picture
            class="CarouselItem-image"
            [fixedAspectRatio]="true"
            [fullWidth]="true"
            [src]="src"
            (imageLoaded)="ready = true"
          ></fl-picture>
          <fl-bit *ngIf="!ready" class="Placeholder">
            <fl-loading-text
              class="Placeholder-loadingState"
              [padded]="false"
            ></fl-loading-text>
          </fl-bit>
        </fl-bit>
      </fl-button>
    </fl-bit>
  `,
  styleUrls: ['./crowd-favorite-carousel-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrowdFavoriteCarouselItemComponent {
  IconColor = IconColor;
  IconSize = IconSize;
  Margin = Margin;
  PictureObjectFit = PictureObjectFit;

  @Input() src: string;
  @Input() carouselItemWidth = 100;
  @Input() leftOffset = -200;
  @Input() isVisible = true;
  @Input() link: string;
  @Input() qtsLabel: string;

  ready = false;
}
