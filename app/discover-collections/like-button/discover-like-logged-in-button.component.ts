import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BackendDeleteResponse,
  BackendErrorResponse,
  BackendPushResponse,
  Datastore,
} from '@freelancer/datastore';
import {
  DiscoverCollectionItem,
  DiscoverCollectionItemsCollection,
  DiscoverItemContext,
} from '@freelancer/datastore/collections';
import { HoverColor, IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { ToastAlertService, ToastAlertType } from '@freelancer/ui/toast-alert';
import { ErrorCodeApi } from 'api-typings/errors/errors';

@Component({
  selector: 'app-discover-like-logged-in-button',
  template: `
    <ng-container
      *ngIf="
        (addItemToLikesPromise && (addItemToLikesPromise | async) === null) ||
          (removeItemFromLikesPromise &&
            (removeItemFromLikesPromise | async) === null);
        else functionalHearts
      "
    >
      <ng-container
        *ngIf="
          addItemToLikesPromise && (addItemToLikesPromise | async) === null;
          else loadingUnlikedHeart
        "
      >
        <fl-icon
          [name]="'ui-heart-v2'"
          [size]="IconSize.MID"
          [color]="IconColor.ERROR"
        >
        </fl-icon>
      </ng-container>
      <ng-template #loadingUnlikedHeart>
        <fl-icon
          class="HeartIconOutline"
          [name]="'ui-heart-alt-v2'"
          [size]="IconSize.MID"
          [color]="IconColor.DARK"
          [hoverColor]="HoverColor.CURRENT"
        >
        </fl-icon>
      </ng-template>
    </ng-container>
    <ng-template #functionalHearts>
      <ng-container *ngIf="itemIsLiked; else notLiked">
        <fl-button flTrackingLabel="unlikeButton" (click)="unlikeItem()">
          <fl-icon
            [name]="'ui-heart-v2'"
            [size]="IconSize.MID"
            [color]="IconColor.ERROR"
          >
          </fl-icon>
        </fl-button>
      </ng-container>
      <ng-template #notLiked>
        <fl-button flTrackingLabel="likeButton" (click)="likeItem()">
          <fl-icon
            class="HeartIconOutline"
            [name]="'ui-heart-alt-v2'"
            [size]="IconSize.MID"
            [color]="IconColor.DARK"
            [hoverColor]="HoverColor.CURRENT"
          >
          </fl-icon>
        </fl-button>
      </ng-template>
    </ng-template>
  `,
  styleUrls: ['./discover-like-button.component.scss'],
})
export class DiscoverLikeLoggedInButtonComponent implements OnInit, OnChanges {
  HoverColor = HoverColor;
  IconColor = IconColor;
  IconSize = IconSize;
  Margin = Margin;
  ToastAlertType = ToastAlertType;

  @Input() context: DiscoverItemContext;
  @Input() likesCollectionId: number;
  @Input() discoverLikeItems: ReadonlyArray<DiscoverCollectionItem>;

  @Output() error = new EventEmitter<any>();

  addItemToLikesPromise: Promise<
    BackendPushResponse<DiscoverCollectionItemsCollection>
  >;
  removeItemFromLikesPromise: Promise<
    BackendDeleteResponse<DiscoverCollectionItemsCollection>
  >;
  itemIsLiked: boolean;
  collectionItem: DiscoverCollectionItem | undefined;

  constructor(
    private datastore: Datastore,
    private toastAlertService: ToastAlertService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.setLikesVisibility();

    this.activatedRoute.queryParams.subscribe(params => {
      if (params.like && Number(params.item_id) === this.context.itemId) {
        this.likeItem();

        this.router.navigate([], {
          queryParams: {
            like: null,
            item_id: null,
          },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      }
    });
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if ('discoverLikeItems' in simpleChanges) {
      this.setLikesVisibility();
    }
  }

  // Make sure to add collection-toasts component to the root component of any page using collections
  showErrorToast(error: BackendErrorResponse<any>) {
    switch (error.errorCode) {
      case ErrorCodeApi.DISCOVER_COLLECTION_ITEM_NOT_FOUND:
        this.toastAlertService.open('like-item-not-found');
        break;
      case ErrorCodeApi.DISCOVER_COLLECTION_ITEM_DUPLICATE:
        this.toastAlertService.open('like-item-duplicate');
        break;
      default:
        this.toastAlertService.open('like-default-error');
    }
  }

  setLikesVisibility() {
    this.itemIsLiked = this.discoverLikeItems.some(discoverLikeItem =>
      this.itemMatchesContext(discoverLikeItem),
    );

    this.collectionItem = this.discoverLikeItems.find(discoverLikeItem =>
      this.itemMatchesContext(discoverLikeItem),
    );
  }

  likeItem() {
    this.addItemToLikesPromise = this.datastore.createDocument<
      DiscoverCollectionItemsCollection
    >('discoverCollectionItems', {
      collectionId: this.likesCollectionId,
      context: this.context,
    });

    this.addItemToLikesPromise.then(response => {
      if (response.status === 'error') {
        return this.showErrorToast(response);
      }
      return this.toastAlertService.open('collection-item-liked');
    });
  }

  unlikeItem() {
    if (!this.collectionItem) {
      return this.showErrorToast({
        status: 'error',
        errorCode: ErrorCodeApi.DISCOVER_COLLECTION_ITEM_NOT_FOUND,
      });
    }
    this.removeItemFromLikesPromise = this.datastore
      .document<DiscoverCollectionItemsCollection>(
        'discoverCollectionItems',
        this.collectionItem.id,
      )
      .remove();

    this.removeItemFromLikesPromise.then(response => {
      if (response.status === 'error') {
        return this.showErrorToast(response);
      }
    });
  }

  itemMatchesContext(likeItem: DiscoverCollectionItem) {
    return (
      likeItem.context.itemId === this.context.itemId &&
      likeItem.context.type === this.context.type
    );
  }
}
