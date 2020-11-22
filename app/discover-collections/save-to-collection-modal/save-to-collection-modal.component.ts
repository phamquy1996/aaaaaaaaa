import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  BackendPushErrorResponse,
  BackendPushResponse,
  Datastore,
  DatastoreCollection,
} from '@freelancer/datastore';
import {
  DiscoverCollection,
  DiscoverCollectionItem,
  DiscoverCollectionItemsCollection,
  DiscoverCollectionsCollection,
} from '@freelancer/datastore/collections';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { ListItemPadding, ListItemType } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import { SpinnerColor, SpinnerSize } from '@freelancer/ui/spinner';
import { TextSize } from '@freelancer/ui/text';
import { ToastAlertService, ToastAlertType } from '@freelancer/ui/toast-alert';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import { DiscoverCollectionItemTypeApi } from 'api-typings/users/users';
import * as Rx from 'rxjs';

@Component({
  template: `
    <fl-toast-alert
      i18n="Default error message in toast"
      [id]="'error-toast-alert'"
      [type]="ToastAlertType.ERROR"
    >
      Something went wrong. Please try again.
    </fl-toast-alert>
    <fl-toast-alert
      i18n="Error message for duplicate collection item"
      [id]="'error-toast-alert-duplicate-items'"
      [type]="ToastAlertType.ERROR"
    >
      This item already exists in the collection you have selected.
    </fl-toast-alert>
    <fl-toast-alert
      i18n="Error message if the collection item is not found"
      [id]="'error-toast-alert-item-not-found'"
      [type]="ToastAlertType.ERROR"
    >
      The item you are trying to remove cannot be found.
    </fl-toast-alert>
    <fl-toast-alert
      i18n="
         Error message if the collection the user is trying to add to doesn't
        exist
      "
      [id]="'error-toast-alert-collection-not-found'"
      [type]="ToastAlertType.ERROR"
    >
      The collection you are trying to add to does not exist.
    </fl-toast-alert>
    <fl-bit
      class="SaveToCollectionModalContent"
      flTrackingSection="SaveToCollectionModal"
    >
      <ng-container *flModalTitle>
        <ng-container
          *ngIf="!createCollectionMode"
          i18n="Save to collection modal title"
        >
          Save to collection
        </ng-container>
        <ng-container
          *ngIf="createCollectionMode"
          i18n="Create a collection modal title"
        >
          Create new collection
        </ng-container>
      </ng-container>
      <fl-bit class="Header" [flHideMobile]="true">
        <fl-heading
          *ngIf="!createCollectionMode"
          i18n="Save to collection modal title"
          [size]="TextSize.MID"
          [headingType]="HeadingType.H1"
        >
          Save to collection
        </fl-heading>
        <fl-heading
          *ngIf="createCollectionMode"
          i18n="Create a collection modal title"
          [size]="TextSize.MID"
          [headingType]="HeadingType.H1"
        >
          Create new collection
        </fl-heading>
      </fl-bit>
      <fl-hr [flHideMobile]="true"></fl-hr>
      <perfect-scrollbar
        *ngIf="
          (discoverCollections$ | async)?.length != 0;
          else emptyCollectionState
        "
        [flHide]="createCollectionMode"
        class="ScrollableContainer"
        [config]="{}"
      >
        <fl-bit class="ScrollableContent">
          <fl-list
            class="List"
            [type]="ListItemType.NON_BORDERED"
            [outerPadding]="false"
            [bodyEdgeToEdge]="true"
            [padding]="ListItemPadding.XXSMALL"
          >
            <fl-list-item
              flTrackingLabel="CreateCollectionMode"
              (click)="triggerCreateCollectionMode()"
            >
              <fl-bit class="CreateCollection">
                <fl-bit
                  i18n="Create new collection text"
                  class="CreateCollection-text"
                >
                  + Create new collection
                </fl-bit>
              </fl-bit>
            </fl-list-item>
          </fl-list>
          <fl-list
            class="List"
            *ngIf="
              (itemMapping$ | async) && (discoverCollections$ | async);
              else loadingCollections
            "
            [type]="ListItemType.NON_BORDERED"
            [outerPadding]="false"
            [bodyEdgeToEdge]="true"
            [padding]="ListItemPadding.XXSMALL"
          >
            <fl-list-item
              *ngFor="let collection of discoverCollections$ | async"
            >
              <app-collection-card
                [collection]="collection"
                [itemId]="itemId"
                [itemType]="itemType"
                [itemMappings]="itemMapping$ | async"
                [itemMappingsCollection]="itemMappingsCollection"
                (error)="showErrorToast($event)"
              ></app-collection-card>
            </fl-list-item>
          </fl-list>
          <ng-template #loadingCollections>
            <fl-spinner
              flTrackingLabel="DiscoverySaveToCollectionModalInitialisationSpinner"
              class="Spinner"
              [size]="SpinnerSize.MID"
              [color]="SpinnerColor.GRAY"
            ></fl-spinner>
          </ng-template>
        </fl-bit>
      </perfect-scrollbar>

      <ng-template #emptyCollectionState>
        <fl-bit
          class="CreateCollectionEmptyState"
          [flHide]="createCollectionMode"
        >
          <fl-heading
            i18n="Prompt for user to create their first collection"
            class="CreateCollectionEmptyState-heading"
            [size]="TextSize.SMALL"
            [headingType]="HeadingType.H2"
            [flMarginBottom]="Margin.XXSMALL"
          >
            Create your first collection
          </fl-heading>

          <fl-text
            i18n="Introduction to collections"
            class="CreateCollectionEmptyState-text"
            [flMarginBottom]="Margin.SMALL"
          >
            Prepare for your next big project by using collections to save and
            organize the best work you've found on Freelancer!
          </fl-text>

          <fl-bit
            class="CreateCollectionEmptyState-picture"
            [flMarginBottom]="Margin.XXSMALL"
          >
            <fl-picture
              alt="Create New Collection"
              i18n-alt="Alt text for CTA image in Discover collections"
              [boundedWidth]="true"
              [boundedHeight]="true"
              [src]="'discover/portfoliocard-save.svg'"
            ></fl-picture>
          </fl-bit>

          <fl-button
            i18n="Create new collection button"
            flTrackingLabel="createNewCollection"
            [color]="ButtonColor.SECONDARY"
            (click)="triggerCreateCollectionMode()"
          >
            + Create new collection
          </fl-button>
        </fl-bit>
      </ng-template>

      <ng-container *ngIf="createCollectionMode === true">
        <app-create-collection-form
          class="CreateCollectionForm"
          (cancel)="removeCreateCollectionMode()"
          (create)="handleCreateResponse($event)"
        ></app-create-collection-form>
      </ng-container>
    </fl-bit>
  `,
  styleUrls: ['./save-to-collection-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveToCollectionModalComponent {
  ErrorCodeApi = ErrorCodeApi;
  TextSize = TextSize;
  HeadingType = HeadingType;
  ListItemPadding = ListItemPadding;
  ListItemType = ListItemType;
  Margin = Margin;
  SpinnerSize = SpinnerSize;
  SpinnerColor = SpinnerColor;
  ToastAlertType = ToastAlertType;
  ButtonColor = ButtonColor;

  @Input() itemId: number;
  @Input() itemType: DiscoverCollectionItemTypeApi;

  @Input() discoverCollections$: Rx.Observable<
    ReadonlyArray<DiscoverCollection>
  >;
  @Input() itemMapping$: Rx.Observable<ReadonlyArray<DiscoverCollectionItem>>;
  @Input() itemMappingsCollection: DatastoreCollection<
    DiscoverCollectionItemsCollection
  >;
  createCollectionMode: boolean;
  addItemPromise: Promise<
    BackendPushResponse<DiscoverCollectionItemsCollection>
  >;

  constructor(
    private datastore: Datastore,
    private toastAlertService: ToastAlertService,
  ) {}

  // Make sure to add collection-toasts component to the root component of any pages using this component.
  showErrorToast(
    error: BackendPushErrorResponse<DiscoverCollectionItemsCollection>,
  ) {
    switch (error.errorCode) {
      case ErrorCodeApi.DISCOVER_COLLECTION_ITEM_DUPLICATE:
        this.toastAlertService.open('error-toast-alert-duplicate-items');
        break;
      case ErrorCodeApi.DISCOVER_COLLECTION_ITEM_NOT_FOUND:
        this.toastAlertService.open('error-toast-alert-item-not-found');
        break;
      case ErrorCodeApi.DISCOVER_COLLECTION_NOT_FOUND:
        this.toastAlertService.open('error-toast-alert-collection-not-found');
        break;
      default:
        this.toastAlertService.open('error-toast-alert');
    }
  }

  triggerCreateCollectionMode() {
    this.createCollectionMode = true;
  }

  removeCreateCollectionMode() {
    this.createCollectionMode = false;
  }

  handleCreateResponse(
    response: BackendPushResponse<DiscoverCollectionsCollection>,
  ) {
    if (response.status === 'success') {
      this.addItemPromise = this.datastore.createDocument<
        DiscoverCollectionItemsCollection
      >('discoverCollectionItems', {
        collectionId: response.id,
        context: {
          itemId: this.itemId,
          type: this.itemType,
        },
      });
      this.addItemPromise.then(addItemResponse => {
        if (addItemResponse.status !== 'success') {
          this.showErrorToast(addItemResponse);
        }
        this.removeCreateCollectionMode();
      });
    }
  }
}
