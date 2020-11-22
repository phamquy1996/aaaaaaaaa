import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FileDownload } from '@freelancer/file-download';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { CarouselImage } from '@freelancer/ui/carousel';
import {
  FileDisplayIconType,
  FileDisplayType,
} from '@freelancer/ui/file-display';
import { HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { PictureObjectFit } from '@freelancer/ui/picture';
import { TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-punch-viewer-modal-content',
  template: `
    <fl-bit class="TitleRow" [flHideMobile]="true">
      <fl-heading
        [headingType]="HeadingType.H1"
        [size]="TextSize.MID"
        [flMarginRight]="Margin.XSMALL"
      >
        {{ images[currentImageIndex].timeCreated | date: 'mediumDate' }}
      </fl-heading>
      <fl-text [size]="TextSize.SMALL">
        {{ images[currentImageIndex].timeCreated | date: 'hh:mm a' }}
      </fl-text>
    </fl-bit>
    <fl-bit class="TitleRow" [flShowMobile]="true">
      <fl-heading [headingType]="HeadingType.H1" [size]="TextSize.SMALL">
        {{ images[currentImageIndex].timeCreated | date: 'MMM d, y, hh:mm a' }}
      </fl-heading>
    </fl-bit>
    <!-- Main image preview -->
    <fl-carousel
      flTrackingLabel="PunchSlider"
      class="Carousel"
      [currentIndex]="currentImageIndex"
      (slideChange)="handleSlideChange($event)"
    >
      <fl-carousel-prev-btn class="CarouselNav">
        <fl-icon
          [name]="'ui-arrow-left-alt'"
          [color]="IconColor.LIGHT"
          [size]="IconSize.SMALL"
        ></fl-icon>
      </fl-carousel-prev-btn>
      <fl-carousel-item *ngFor="let image of images" class="CarouselItem">
        <fl-picture
          *ngIf="!image.showGenericFileTypeIcon; else genericFile"
          class="CarouselItem-content"
          [alt]="image.alt"
          [externalSrc]="true"
          [src]="image.src"
          [objectFit]="PictureObjectFit.CONTAIN"
          [fullWidth]="true"
        ></fl-picture>
        <ng-template #genericFile>
          <fl-bit class="FilePlaceholder">
            <fl-file-display
              [alt]="image.alt"
              [src]="image.src"
              [iconType]="FileDisplayIconType.GENERIC"
              [type]="FileDisplayType.ICON"
              [iconColor]="IconColor.WHITE"
              [iconSize]="IconSize.XXLARGE"
            ></fl-file-display>
          </fl-bit>
        </ng-template>
      </fl-carousel-item>
      <fl-carousel-next-btn class="CarouselNav">
        <fl-icon
          [name]="'ui-arrow-right-alt'"
          [color]="IconColor.LIGHT"
          [size]="IconSize.SMALL"
        ></fl-icon>
      </fl-carousel-next-btn>
    </fl-carousel>
    <fl-bit class="FooterRow">
      <fl-thumbnail-viewer
        class="ThumbnailViewer"
        [images]="images"
        [slidesToShow]="MAX_SLIDES_TO_SHOW_DESKTOP"
        [currentIndex]="currentImageIndex"
        [groupIndex]="currentGroupIndexDesktop"
        [flHideMobile]="true"
        (slideChange)="handleSlideChange($event)"
      >
      </fl-thumbnail-viewer>
      <fl-thumbnail-viewer
        class="ThumbnailViewer"
        [images]="images"
        [slidesToShow]="MAX_SLIDES_TO_SHOW_TABLET"
        [currentIndex]="currentImageIndex"
        [groupIndex]="currentGroupIndexTablet"
        [flShowMobile]="true"
        (slideChange)="handleSlideChange($event)"
      >
      </fl-thumbnail-viewer>
      <fl-button
        [flHideMobile]="true"
        flTrackingLabel="DownloadScreenshotButton"
        i18n="Download time-tracking screenshot button"
        [color]="ButtonColor.DEFAULT"
        [size]="ButtonSize.SMALL"
        (click)="handleDownloadImage()"
      >
        Download Image
      </fl-button>
    </fl-bit>
  `,
  styleUrls: ['./punch-viewer-modal-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PunchViewerModalContentComponent {
  FileDisplayIconType = FileDisplayIconType;
  FileDisplayType = FileDisplayType;
  Margin = Margin;
  HeadingType = HeadingType;
  IconColor = IconColor;
  IconSize = IconSize;
  TextSize = TextSize;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  PictureObjectFit = PictureObjectFit;

  // number of images shown per window of fl-thumbnail-viewer
  readonly MAX_SLIDES_TO_SHOW_DESKTOP = 7;
  readonly MAX_SLIDES_TO_SHOW_TABLET = 5;

  @Input() currentImageIndex = 0;
  @Input() images: ReadonlyArray<CarouselImage & { timeCreated: number }>;

  currentGroupIndexDesktop = 0;
  currentGroupIndexTablet = 0;

  constructor(private fileDownload: FileDownload) {}

  handleSlideChange(currentIndex: number) {
    // Update the group index of the thumbnail viewer, so if
    // the active image is not within the current group, the
    // thumbnail viewer could change the group index accordingly
    this.currentImageIndex = currentIndex;
    this.currentGroupIndexDesktop = Math.floor(
      this.currentImageIndex / this.MAX_SLIDES_TO_SHOW_DESKTOP,
    );
    this.currentGroupIndexTablet = Math.floor(
      this.currentImageIndex / this.MAX_SLIDES_TO_SHOW_TABLET,
    );
  }

  handleDownloadImage() {
    this.fileDownload.download(
      this.images[this.currentImageIndex].src,
      // FIXME: unknown.jpg
      this.images[this.currentImageIndex].alt ?? 'unknown.jpg',
    );
  }
}
