import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CarouselArrowPosition } from '@freelancer/ui/carousel';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { PictureDisplay, PictureObjectFit } from '@freelancer/ui/picture';
import { TextAlign } from '@freelancer/ui/text';
import {
  CrowdFavoriteCarouselData,
  CrowdFavoriteImageQTS,
} from './crowd-favorites-carousel.types';

@Component({
  selector: 'app-crowd-favorites-carousel',
  template: `
    <fl-button
      class="Carousel-arrow Carousel-arrow--prev"
      flTrackingLabel="CarouselLeft"
      (click)="handlePrev()"
    >
      <fl-icon
        [name]="'ui-arrow-left-alt'"
        [size]="IconSize.MID"
        [sizeTablet]="IconSize.XLARGE"
      ></fl-icon>
    </fl-button>
    <fl-button
      class="Carousel-arrow Carousel-arrow--next"
      flTrackingLabel="CarouselRight"
      (click)="handleNext()"
    >
      <fl-icon
        [name]="'ui-arrow-right-alt'"
        [size]="IconSize.MID"
        [sizeTablet]="IconSize.XLARGE"
      ></fl-icon>
    </fl-button>
    <fl-bit class="Carousel" [style.text-align]="itemAlignment" #carousel>
      <ng-container
        *ngFor="
          let carouselItem of carouselData;
          let i = index;
          trackBy: trackById
        "
      >
        <app-crowd-favorite-carousel-item
          [src]="carouselItem.src"
          [carouselItemWidth]="carouselItemWidth"
          [leftOffset]="carouselItem.xPos"
          [isVisible]="carouselItem.visible"
          [link]="link"
          [qtsLabel]="carouselItem.qtsLabel"
        ></app-crowd-favorite-carousel-item>
      </ng-container>
    </fl-bit>
  `,
  styleUrls: ['./crowd-favorites-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrowdFavoritesCarouselComponent implements OnInit {
  CarouselArrowPosition = CarouselArrowPosition;
  IconColor = IconColor;
  IconSize = IconSize;
  PictureDisplay = PictureDisplay;
  PictureObjectFit = PictureObjectFit;
  TextAlign = TextAlign;

  @Input() itemsToShow = 3;
  @Input() itemAlignment = TextAlign.CENTER;
  @Input() imageSources: ReadonlyArray<CrowdFavoriteImageQTS>;
  @Input() link: string;

  carouselItemWidth = 100;

  orderOfItems: ReadonlyArray<number> = [];
  carouselData: ReadonlyArray<CrowdFavoriteCarouselData> = [];

  ngOnInit() {
    this.carouselItemWidth = 100 / this.itemsToShow;
    this.refreshCarouselData(this.imageSources.map((_, index) => index));

    this.handlePrev();
  }

  trackById(value: CrowdFavoriteCarouselData) {
    return value.id;
  }

  refreshCarouselData(listArray: ReadonlyArray<number>) {
    this.orderOfItems = listArray;
    this.carouselData = this.imageSources.map((item, index) => {
      const newData = {
        id: index,
        src: item.src,
        qtsLabel: item.qtsLabel,
        xPos: this.computeLeftOffset(index),
        visible: this.computeVisible(index),
      };
      return newData;
    });
  }

  handleNext() {
    const listArray = [...this.orderOfItems];
    const rightItem = listArray.shift();
    if (rightItem !== undefined) {
      listArray.push(rightItem);
    }
    this.refreshCarouselData(listArray);
  }

  handlePrev() {
    const listArray = [...this.orderOfItems];
    const leftItem = listArray.pop();
    if (leftItem !== undefined) {
      listArray.unshift(leftItem);
    }
    this.refreshCarouselData(listArray);
  }

  computeLeftOffset(index: number) {
    return 100 * (this.orderOfItems.indexOf(index) - 1);
  }
  computeVisible(index: number) {
    return this.orderOfItems.indexOf(index) < this.itemsToShow + 2;
  }
}
