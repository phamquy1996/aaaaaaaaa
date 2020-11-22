import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FileDisplayType } from '@freelancer/ui/file-display';
import {
  HeadingColor,
  HeadingType,
  HeadingWeight,
} from '@freelancer/ui/heading';
import { IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { SpinnerSize } from '@freelancer/ui/spinner';
import { FontType, TextAlign, TextSize } from '@freelancer/ui/text';

export interface GalleryItem {
  readonly alt?: string;
  readonly fileName: string;
  readonly source: string;
  readonly isExternal?: boolean;
  readonly type: GalleryItemType;
}

export enum GalleryItemType {
  PICTURE,
  FILE,
}

@Component({
  selector: 'fl-gallery',
  template: `
    <fl-bit class="GalleryGrid">
      <fl-bit
        *ngFor="
          let galleryItem of galleryItems | slice: 0:displayedGalleryItems;
          index as i
        "
        class="GridColumn"
        [attr.data-columns]="maxColumns"
        [ngSwitch]="galleryItem.type"
        (click)="handleGalleryItemClicked(i, $event)"
      >
        <ng-container *ngSwitchCase="GalleryItemType.PICTURE">
          <fl-bit
            *ngIf="!errorItems.includes(galleryItem)"
            class="GridColumn-pictureContainer"
          >
            <fl-picture
              class="GridColumn-pictureContainer-picture"
              [alignCenter]="true"
              [alt]="galleryItem.alt"
              [externalSrc]="galleryItem.isExternal"
              [fixedAspectRatio]="true"
              [src]="galleryItem.source"
              (imageLoaded)="stopLoading(i)"
              (onError)="handleImageLoadError(galleryItem)"
            ></fl-picture>
            <fl-spinner
              *ngIf="loadingItems[i]"
              class="GridColumn-pictureContainer-loading"
              [size]="SpinnerSize.SMALL"
            ></fl-spinner>
          </fl-bit>
          <fl-bit
            *ngIf="errorItems.includes(galleryItem)"
            class="GridColumn-pictureLoadError"
          >
            <fl-bit class="GridColumn-pictureLoadError-inner">
              <fl-icon
                class="GalleryFileDisplay"
                [name]="'ui-broken-image'"
                [size]="IconSize.SMALL"
                [sizeTablet]="IconSize.MID"
                [sizeDesktop]="IconSize.XLARGE"
                [flMarginBottom]="Margin.XXXSMALL"
              ></fl-icon>
              <fl-text
                i18n="Image Failed To Load"
                [fontType]="FontType.SPAN"
                [size]="TextSize.XXSMALL"
                [sizeTablet]="TextSize.XXSMALL"
                [textAlign]="TextAlign.CENTER"
              >
                Failed to load
              </fl-text>
            </fl-bit>
          </fl-bit>
        </ng-container>
        <fl-bit
          *ngSwitchCase="GalleryItemType.FILE"
          class="GridColumn-filePreview"
        >
          <fl-bit class="GridColumn-filePreview-inner">
            <fl-file-display
              class="GalleryFileDisplay"
              [alt]="galleryItem.fileName"
              [iconSize]="IconSize.SMALL"
              [iconSizeTablet]="IconSize.MID"
              [iconSizeDesktop]="IconSize.XLARGE"
              [src]="galleryItem.source"
              [type]="FileDisplayType.ICON"
            ></fl-file-display>
            <fl-text
              [fontType]="FontType.SPAN"
              [size]="TextSize.XXSMALL"
              [sizeTablet]="TextSize.XXSMALL"
              [textAlign]="TextAlign.CENTER"
            >
              {{ galleryItem.fileName | truncateFilename: 25 }}
            </fl-text>
          </fl-bit>
        </fl-bit>
        <fl-bit
          *ngIf="
            i === displayedGalleryItems - 1 &&
            galleryItems.length > displayedGalleryItems &&
            !loadingItems[i]
          "
          class="GridColumn-cover"
        >
          <fl-heading
            [color]="HeadingColor.LIGHT"
            [headingType]="HeadingType.H2"
            [size]="TextSize.LARGE"
            [sizeTablet]="TextSize.XLARGE"
            [sizeDesktop]="TextSize.XXLARGE"
            [weight]="HeadingWeight.LIGHT"
          >
            + {{ galleryItems.length - displayedGalleryItems }}
          </fl-heading>
        </fl-bit>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent implements OnChanges, OnInit {
  FileDisplayType = FileDisplayType;
  FontType = FontType;
  GalleryItemType = GalleryItemType;
  HeadingColor = HeadingColor;
  HeadingType = HeadingType;
  HeadingWeight = HeadingWeight;
  IconSize = IconSize;
  Margin = Margin;
  SpinnerSize = SpinnerSize;
  TextAlign = TextAlign;
  TextSize = TextSize;

  @Input() galleryItems: ReadonlyArray<GalleryItem>;
  @Input() maxRows = 2;
  @Input() maxColumns = 4;

  @Output() openItem = new EventEmitter<number>();

  displayedGalleryItems = this.maxRows * this.maxColumns;
  errorItems: ReadonlyArray<GalleryItem> = [];

  loadingItems: ReadonlyArray<boolean> = [];

  ngOnChanges(changes: SimpleChanges): void {
    if ('maxRows' in changes || 'maxColumns' in changes) {
      this.displayedGalleryItems = this.maxRows * this.maxColumns;
      // Maintain the loading items
      if (this.displayedGalleryItems > this.loadingItems.length) {
        this.loadingItems = [
          ...this.loadingItems,
          ...Array.from(
            Array(this.displayedGalleryItems - this.loadingItems.length),
            (item, index) =>
              this.galleryItems && this.galleryItems.length > index
                ? this.galleryItems[index].type === GalleryItemType.PICTURE
                : true,
          ),
        ];
      } else {
        this.loadingItems = this.loadingItems.slice(
          0,
          this.displayedGalleryItems,
        );
      }
    }
  }

  ngOnInit(): void {
    this.loadingItems = Array.from(
      Array(this.displayedGalleryItems),
      (item, index) =>
        this.galleryItems && this.galleryItems.length > index
          ? this.galleryItems[index].type === GalleryItemType.PICTURE
          : true,
    );
  }

  handleGalleryItemClicked(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.openItem.emit(index);
  }

  handleImageLoadError(galleryItem: GalleryItem): void {
    this.errorItems = [...this.errorItems, galleryItem];
    const index = this.galleryItems.indexOf(galleryItem);
    this.stopLoading(index);
  }

  stopLoading(index: number): void {
    this.loadingItems = Object.assign([], this.loadingItems, {
      [index]: false,
    });
  }
}
