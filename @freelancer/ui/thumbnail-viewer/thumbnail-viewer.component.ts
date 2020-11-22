import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { IconSize } from '@freelancer/ui/icon';
import { PictureDisplay, PictureObjectFit } from '@freelancer/ui/picture';

export interface ThumbnailViewerImage {
  src: string;
  alt?: string;
}

export enum ThumbnailViewerArrowPosition {
  OUTSIDE = 'outside',
  INSIDE = 'inside',
}

export enum ThumbnailViewerSlidesToScroll {
  INDIVIDUAL = 'individual',
  GROUP = 'group',
}

@Component({
  selector: 'fl-thumbnail-viewer-image',
  template: `
    <fl-loading-text
      class="ThumbnailLoader"
      *ngIf="loading"
      [padded]="false"
    ></fl-loading-text>
    <fl-picture
      class="ThumbnailImage"
      [ngClass]="{ IsHidden: loading }"
      [src]="src"
      [alt]="alt"
      [externalSrc]="externalSrc"
      [fixedAspectRatio]="true"
      (imageLoaded)="handleImageLoaded()"
    ></fl-picture>
  `,
  styleUrls: ['./thumbnail-viewer-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThumbnailViewerImageComponent {
  PictureDisplay = PictureDisplay;
  PictureObjectFit = PictureObjectFit;

  loading = true;

  @Input() src: string;
  @Input() alt: string;
  @Input() externalSrc = true;

  handleImageLoaded() {
    this.loading = false;
  }
}

@Component({
  selector: 'fl-thumbnail-viewer',
  template: `
    <fl-link
      class="Navigator Navigator--prev"
      *ngIf="arrows"
      [ngClass]="{ IsHidden: hidePrevArrow }"
      (click)="onViewPrevious($event)"
    >
      <fl-icon
        i18n-label="Thumbnail viewer icon to view previous"
        label="Previous"
        [name]="'ui-arrow-left-alt'"
        [size]="IconSize.SMALL"
      ></fl-icon>
    </fl-link>
    <fl-bit class="Slider">
      <fl-bit #track class="Slider-track">
        <fl-bit
          #slideItem
          class="Slider-item"
          *ngFor="let image of images; let slideItemIndex = index"
          (click)="selectSlideItem(slideItemIndex, $event)"
        >
          <fl-bit class="Slide">
            <fl-bit class="Slide-inner">
              <fl-thumbnail-viewer-image
                class="Slide-image"
                [src]="image.src"
                [alt]="image.alt"
                [externalSrc]="externalSrc"
              ></fl-thumbnail-viewer-image>
            </fl-bit>
          </fl-bit>
        </fl-bit>
      </fl-bit>
    </fl-bit>
    <fl-link
      class="Navigator Navigator--next"
      *ngIf="arrows"
      [ngClass]="{ IsHidden: hideNextArrow }"
      (click)="onViewNext($event)"
    >
      <fl-icon
        i18n-label="Thumbnail viewer icon to view next"
        label="Next"
        [name]="'ui-arrow-right-alt'"
        [size]="IconSize.SMALL"
      ></fl-icon>
    </fl-link>
  `,
  styleUrls: ['./thumbnail-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThumbnailViewerComponent implements OnChanges, AfterViewInit {
  IconSize = IconSize;
  PictureDisplay = PictureDisplay;
  PictureObjectFit = PictureObjectFit;

  trackWidth: number;
  slideWidth: number;
  slideIndex: number;
  currentGroupIndex = 0;
  currentIndexInGroup = 0;
  hidePrevArrow = false;
  hideNextArrow = false;
  maxImageCount = 0;

  @Input() images: ReadonlyArray<ThumbnailViewerImage>;
  @Input() externalSrc = true;
  @Input() slidesToShow = 1;
  @Input() currentIndex = 0;
  @Input() arrows = true;
  @Input() groupIndex = 0;
  @Input() slidesToScroll: ThumbnailViewerSlidesToScroll =
    ThumbnailViewerSlidesToScroll.INDIVIDUAL;

  @HostBinding('attr.data-arrow-position')
  @Input()
  arrowPosition = ThumbnailViewerArrowPosition.OUTSIDE;

  @Output() slideChange = new EventEmitter<number>();
  @Output() scrollChange = new EventEmitter<number>();

  @ViewChild('track', { read: ElementRef }) track: ElementRef;
  @ViewChildren('slideItem', { read: ElementRef })
  slideItems: QueryList<ElementRef>;

  constructor(
    private renderer: Renderer2,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    this.maxImageCount = this.images.length - 1;

    // Prevents slideIndex from exceeding the images length
    this.slideIndex = Math.min(this.maxImageCount, this.currentIndex);

    // Prevents groupIndex from exceeding the images length
    this.currentGroupIndex = Math.min(
      this.groupIndex,
      this.getTotalGroupCount(),
    );

    if ('currentIndex' in changes && this.slideItems) {
      this.setActiveSlide();
    }

    if ('slidesToShow' in changes && this.slideItems) {
      this.setViewWidths();
      this.moveTrackPosition();
    }

    if ('groupIndex' in changes && this.slideItems) {
      this.moveTrackPosition();
    }
  }

  ngAfterViewInit() {
    this.currentGroupIndex = this.groupIndex;
    this.setViewWidths();
    this.setActiveSlide();
    this.slideItems.changes.subscribe(() => {
      this.setViewWidths();
      this.setActiveSlide();
    });
    this.moveTrackPosition();
  }

  setViewWidths() {
    this.setTrackWidth();
    this.setSlideItemWidth(this.images.length);
  }

  setTrackWidth() {
    this.trackWidth = (this.images.length / this.slidesToShow) * 100;

    this.renderer.setStyle(
      this.track.nativeElement,
      'width',
      `${this.trackWidth}%`,
    );
  }

  setSlideItemWidth(slideCount: number) {
    this.slideWidth =
      this.trackWidth / (slideCount * (slideCount / this.slidesToShow));

    this.slideItems.forEach((slideItem: ElementRef) => {
      this.renderer.setStyle(
        slideItem.nativeElement,
        'width',
        `${this.slideWidth}%`,
      );
    });
  }

  setActiveSlide() {
    this.slideItems.forEach((slideItem: ElementRef, i) => {
      if (this.slideIndex === i) {
        this.renderer.addClass(slideItem.nativeElement, 'IsActive');
      } else {
        this.renderer.removeClass(slideItem.nativeElement, 'IsActive');
      }
    });
  }

  moveTrackPosition() {
    if (this.isIndividualScroll()) {
      this.currentGroupIndex = Math.floor(this.slideIndex / this.slidesToShow);
    }

    this.renderer.setStyle(
      this.track.nativeElement,
      'transform',
      `translateX(-${(this.currentGroupIndex / (this.trackWidth / 100)) *
        100}%)`,
    );

    this.scrollChange.emit(this.currentGroupIndex);
    this.toggleArrows();
  }

  onViewPrevious(event: MouseEvent) {
    event.stopPropagation();

    if (this.isIndividualScroll() && this.slideIndex >= 0) {
      this.slideIndex -= 1;
      this.setActiveSlide();
      this.slideChange.emit(this.slideIndex);
      this.moveTrackPosition();
    }

    if (!this.isIndividualScroll() && this.currentGroupIndex >= 0) {
      this.currentGroupIndex -= 1;
      this.moveTrackPosition();
    }
  }

  onViewNext(event: MouseEvent) {
    event.stopPropagation();

    if (this.isIndividualScroll() && this.slideIndex < this.maxImageCount) {
      this.slideIndex += 1;
      this.setActiveSlide();
      this.slideChange.emit(this.slideIndex);
      this.moveTrackPosition();
    }

    if (
      !this.isIndividualScroll() &&
      this.currentGroupIndex < this.getTotalGroupCount()
    ) {
      this.currentGroupIndex += 1;
      this.moveTrackPosition();
    }
  }

  selectSlideItem(slideIndex: number, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }

    if (slideIndex > this.maxImageCount || slideIndex < 0) {
      return;
    }

    this.slideIndex = slideIndex;
    this.setActiveSlide();
    this.moveTrackPosition();
    this.slideChange.emit(slideIndex);
  }

  toggleArrows() {
    this.hidePrevArrow =
      this.slidesToScroll === ThumbnailViewerSlidesToScroll.INDIVIDUAL
        ? this.slideIndex <= 0
        : this.currentGroupIndex <= 0;

    this.hideNextArrow =
      this.slidesToScroll === ThumbnailViewerSlidesToScroll.INDIVIDUAL
        ? this.slideIndex >= this.maxImageCount
        : this.currentGroupIndex >= this.getTotalGroupCount();

    this.changeDetector.detectChanges();
  }

  isIndividualScroll(): boolean {
    return this.slidesToScroll === ThumbnailViewerSlidesToScroll.INDIVIDUAL;
  }

  getTotalGroupCount(): number {
    return Math.floor(this.maxImageCount / this.slidesToShow);
  }
}
