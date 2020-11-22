import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { TimeUtils } from '@freelancer/time-utils';
import * as Rx from 'rxjs';
import { startWith } from 'rxjs/operators';

export enum CarouselScrollBehaviour {
  INDIVIDUAL = 'individual',
  GROUP = 'group',
}

export enum CarouselArrowPosition {
  INSIDE = 'inside',
  CENTER = 'center',
  OUTSIDE = 'outside',
}

export interface CarouselImage {
  src: string;
  alt?: string;
  showGenericFileTypeIcon?: boolean;
}

@Component({
  selector: 'fl-carousel-prev-btn',
  template: `
    <ng-content></ng-content>
  `,
})
export class CarouselPrevButtonComponent {}

@Component({
  selector: 'fl-carousel-next-btn',
  template: `
    <ng-content></ng-content>
  `,
})
export class CarouselNextButtonComponent {}

@Component({
  selector: 'fl-carousel-item',
  template: `
    <ng-content></ng-content>
  `,
})
export class CarouselItemComponent {
  constructor(public elementRef: ElementRef) {}
}

@Component({
  selector: 'fl-carousel',
  template: `
    <fl-bit
      class="Carousel"
      [attr.data-arrow-position]="arrowPosition"
      (swipeleft)="handleNext()"
      (swiperight)="handlePrevious()"
    >
      <fl-button
        class="Carousel-arrow Carousel-arrow--prev"
        *ngIf="arrows"
        [ngClass]="{ IsHidden: isFirstSlide }"
        (click)="handlePrevious($event)"
      >
        <ng-content select="fl-carousel-prev-btn"></ng-content>
      </fl-button>
      <fl-bit class="Carousel-list" #carouselList>
        <fl-bit
          class="Carousel-track"
          #carouselTrack
          [ngClass]="{ IsAnimatable: isAnimatable }"
        >
          <ng-content></ng-content>
        </fl-bit>
      </fl-bit>
      <fl-button
        class="Carousel-arrow Carousel-arrow--next"
        *ngIf="arrows"
        [ngClass]="{ IsHidden: isLastSlide }"
        (click)="handleNext($event)"
      >
        <ng-content select="fl-carousel-next-btn"></ng-content>
      </fl-button>
    </fl-bit>
  `,
  styleUrls: ['./carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselComponent implements OnChanges, AfterViewInit, OnDestroy {
  trackWidth: number;
  slideIndex: number;
  currentGroupIndex = 0;
  isFirstSlide = false;
  isLastSlide = false;
  maxImageCount = 0;
  isAnimatable = false;
  carouselItemsSubscription?: Rx.Subscription;

  @Input() arrows = true;
  @Input() currentIndex = 0;
  @Input() slidesToShow = 1;
  @Input() padding = 0;
  @Input() useAnimation = true;
  @Input() arrowPosition: CarouselArrowPosition = CarouselArrowPosition.INSIDE;
  @Input() scrollBehaviour: CarouselScrollBehaviour =
    CarouselScrollBehaviour.GROUP;
  @Output() slideChange = new EventEmitter<number>();

  @ViewChild('carouselTrack', { read: ElementRef })
  carouselTrack: ElementRef;
  @ViewChild('carouselList', { read: ElementRef })
  carouselList: ElementRef;

  @ContentChildren(CarouselItemComponent)
  carouselItems: QueryList<CarouselItemComponent>;

  constructor(
    private renderer: Renderer2,
    private changeDetector: ChangeDetectorRef,
    private timeUtils: TimeUtils,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if ('currentIndex' in changes && this.carouselItems) {
      this.setSlideIndex();
      this.setActiveSlide();
      this.moveTrackPosition();
    }

    if ('padding' in changes && this.carouselItems) {
      this.setSpacing();
    }

    if ('slidesToShow' in changes && this.carouselItems) {
      this.setViewWidths();
      this.moveTrackPosition();
    }
  }

  ngAfterViewInit() {
    // whenever the carousel items change, reset the track
    this.carouselItemsSubscription = this.carouselItems.changes
      .pipe(startWith(this.carouselItems))
      .subscribe(() => {
        this.setSlideIndex();
        this.setViewWidths();
        this.setSpacing();
        this.setActiveSlide();
        this.moveTrackPosition();
        if (this.useAnimation) {
          this.setTrackAnimation();
        }
        this.changeDetector.detectChanges();
      });
  }

  // Prevents unnecessary animation on load
  setTrackAnimation() {
    this.timeUtils.setTimeout(() => {
      this.isAnimatable = true;
    }, 250);
  }

  setSlideIndex() {
    this.maxImageCount = this.carouselItems.length - 1;

    // Prevents slideIndex from exceeding the images length
    this.slideIndex = Math.min(this.maxImageCount, this.currentIndex);
  }

  setMaxImageCount() {
    this.maxImageCount = this.carouselItems.length - 1;
  }

  setViewWidths() {
    this.setTrackWidth();
    this.setCarouselItemWidth(this.carouselItems.length);
  }

  setTrackWidth() {
    this.trackWidth = (this.carouselItems.length / this.slidesToShow) * 100;

    this.renderer.setStyle(
      this.carouselTrack.nativeElement,
      'width',
      `${this.trackWidth}%`,
    );
  }

  setCarouselItemWidth(slideCount: number) {
    this.carouselItems.forEach((carouselItem: CarouselItemComponent) => {
      this.renderer.setStyle(
        carouselItem.elementRef.nativeElement,
        'width',
        `${this.trackWidth / (slideCount * (slideCount / this.slidesToShow))}%`,
      );
    });
  }

  handlePrevious(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }

    if (!this.isFirstSlide) {
      this.slideIndex -= 1;
      this.moveTrackPosition();
      this.setActiveSlide();
    }
  }

  handleNext(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }

    if (!this.isLastSlide) {
      this.slideIndex += 1;
      this.moveTrackPosition();
      this.setActiveSlide();
    }
  }

  setActiveSlide() {
    if (!this.isIndividualScroll()) {
      return;
    }

    this.carouselItems.forEach((carouselItem: CarouselItemComponent, i) => {
      const carouselElement = carouselItem.elementRef.nativeElement;

      if (this.slideIndex === i) {
        this.renderer.addClass(carouselElement, 'IsActive');
      } else {
        this.renderer.removeClass(carouselElement, 'IsActive');
      }
    });
  }

  setSpacing() {
    this.carouselItems.forEach((carouselItem: CarouselItemComponent) => {
      this.renderer.setStyle(
        carouselItem.elementRef.nativeElement,
        'padding',
        `0 ${this.padding}px`,
      );
    });

    this.renderer.setStyle(
      this.carouselList.nativeElement,
      'margin',
      `0 -${this.padding}px`,
    );
  }

  moveTrackPosition() {
    if (this.isIndividualScroll()) {
      this.currentGroupIndex = Math.floor(this.slideIndex / this.slidesToShow);
    } else {
      this.currentGroupIndex = this.slideIndex;
    }

    this.renderer.setStyle(
      this.carouselTrack.nativeElement,
      'transform',
      `translateX(-${(this.currentGroupIndex / (this.trackWidth / 100)) *
        100}%)`,
    );

    this.slideChange.emit(this.slideIndex);
    this.updateStates();
  }

  updateStates() {
    this.isFirstSlide = this.slideIndex <= 0;
    this.isLastSlide = this.isIndividualScroll()
      ? this.slideIndex >= this.maxImageCount
      : this.slideIndex >= this.getTotalGroupCount();
  }

  private isIndividualScroll(): boolean {
    return this.scrollBehaviour === CarouselScrollBehaviour.INDIVIDUAL;
  }

  private getTotalGroupCount(): number {
    return Math.floor(this.maxImageCount / this.slidesToShow);
  }

  ngOnDestroy() {
    if (this.carouselItemsSubscription) {
      this.carouselItemsSubscription.unsubscribe();
    }
  }
}
