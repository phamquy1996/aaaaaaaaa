import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  BackendDeleteResponse,
  BackendPushErrorResponse,
  BackendPushResponse,
  Datastore,
  DatastoreCollection,
} from '@freelancer/datastore';
import {
  DiscoverCollection,
  DiscoverCollectionItem,
  DiscoverCollectionItemsCollection,
} from '@freelancer/datastore/collections';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { PictureObjectFit } from '@freelancer/ui/picture';
import { SpinnerColor, SpinnerSize } from '@freelancer/ui/spinner';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';
import { DiscoverCollectionItemTypeApi } from 'api-typings/users/users';

@Component({
  selector: 'app-collection-card',
  template: `
    <fl-bit
      class="Collection"
      flTrackingLabel="CollectionCard"
      [ngClass]="{ Selected: isSelected }"
      (mouseenter)="toggleHover()"
      (mouseleave)="toggleHover()"
      (click)="handleClick()"
    >
      <fl-bit class="CollectionInfo">
        <fl-bit class="ImagePreviewStack" [flMarginRight]="Margin.SMALL">
          <ng-container
            *ngIf="
              collection.previewItems && collection.previewItems[0];
              else Placeholder
            "
          >
            <fl-bit
              class="ImagePreviewContainer ImagePreviewContainer--lowest"
              [ngClass]="{
                'ImagePreviewContainer-selected': isSelected
              }"
            >
            </fl-bit>
            <fl-bit
              class="ImagePreviewContainer ImagePreviewContainer--lower"
            ></fl-bit>
            <fl-bit class="ImagePreviewContainer">
              <fl-picture
                class="ImagePreview"
                alt="Collection item preview image"
                i18n-alt="Alt text for preview in Discover collections"
                [src]="collection.previewItems[0]"
                [fullWidth]="true"
                [objectFit]="PictureObjectFit.COVER"
                [externalSrc]="true"
              ></fl-picture>
            </fl-bit>
          </ng-container>
          <ng-template #Placeholder>
            <fl-bit class="ImagePlaceholder ImagePlaceholder--lowest"> </fl-bit>
            <fl-bit class="ImagePlaceholder ImagePlaceholder--lower"></fl-bit>
            <fl-bit class="ImagePlaceholder ImagePlaceholder--base">
              <fl-icon
                [name]="'ui-file'"
                [size]="IconSize.SMALL"
                [color]="IconColor.MID"
              ></fl-icon>
            </fl-bit>
          </ng-template>
        </fl-bit>
        <fl-bit class="CollectionInfo-text">
          <fl-text
            [weight]="FontWeight.BOLD"
            [color]="isSelected ? FontColor.LIGHT : FontColor.DARK"
          >
            {{ collection.name }}
          </fl-text>
          <fl-text
            [size]="TextSize.XXXSMALL"
            [color]="isSelected ? FontColor.LIGHT : FontColor.DARK"
          >
            {{ collection.itemCount || 0 }}
            {{ collection.itemCount === 1 ? 'ITEM' : 'ITEMS' }}
          </fl-text>
        </fl-bit>
      </fl-bit>
      <fl-bit class="SelectedIcon">
        <fl-icon
          *ngIf="!removeItemPromise || (removeItemPromise | async)"
          [name]="isHovered ? 'ui-minus-thin' : 'ui-tick'"
          [size]="IconSize.SMALL"
          [color]="IconColor.LIGHT"
        ></fl-icon>
        <fl-spinner
          *ngIf="
            (addItemPromise && !(addItemPromise | async)) ||
            (removeItemPromise && !(removeItemPromise | async))
          "
          flTrackingLabel="DiscoverCollectionAddRemoveItemSpinner"
          [size]="SpinnerSize.SMALL"
          [color]="SpinnerColor.GRAY"
        ></fl-spinner>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./collection-card.component.scss'],
})
export class CollectionCardComponent implements OnInit {
  Margin = Margin;
  IconSize = IconSize;
  IconColor = IconColor;
  FontColor = FontColor;
  TextSize = TextSize;
  FontWeight = FontWeight;
  SpinnerSize = SpinnerSize;
  SpinnerColor = SpinnerColor;
  PictureObjectFit = PictureObjectFit;

  addItemPromise: Promise<
    BackendPushResponse<DiscoverCollectionItemsCollection>
  >;
  removeItemPromise: Promise<
    BackendDeleteResponse<DiscoverCollectionItemsCollection>
  >;
  itemMappingId: number | undefined;
  isSelected: boolean;
  isHovered = false;

  @Input() collection: DiscoverCollection;
  @Input() itemId: number;
  @Input() itemType: DiscoverCollectionItemTypeApi;
  @Input() itemMappingsCollection: DatastoreCollection<
    DiscoverCollectionItemsCollection
  >;
  @Input() itemMappings: ReadonlyArray<DiscoverCollectionItem>;

  @Output() error = new EventEmitter<
    BackendPushErrorResponse<DiscoverCollectionItemsCollection>
  >();

  constructor(private datastore: Datastore) {}

  ngOnInit(): void {
    const itemMapping = this.itemMappings.find(
      mapping => mapping.collectionId === this.collection.id,
    );

    this.itemMappingId = itemMapping ? itemMapping.id : undefined;
    this.isSelected = this.itemMappingId !== undefined;
  }

  handleClick(): void {
    if (this.itemMappingId) {
      this.removeItemFromCollection();
    } else {
      this.addItemToCollection();
    }
  }

  addItemToCollection(): void {
    this.addItemPromise = this.datastore.createDocument<
      DiscoverCollectionItemsCollection
    >('discoverCollectionItems', {
      collectionId: this.collection.id,
      context: {
        itemId: this.itemId,
        type: this.itemType,
      },
    });
    this.addItemPromise.then(response => {
      if (response.status === 'success') {
        this.itemMappingId = response.id;
      } else {
        this.error.emit(response);
      }
    });
  }

  removeItemFromCollection(): void {
    this.removeItemPromise = this.datastore
      .document<DiscoverCollectionItemsCollection>(
        'discoverCollectionItems',
        this.itemMappingId,
      )
      .remove();
    this.removeItemPromise.then(response => {
      if (response.status === 'success') {
        this.itemMappingId = undefined;
      } else {
        this.error.emit(response);
      }
    });
  }

  toggleHover(): void {
    this.isHovered = !this.isHovered;
  }
}
