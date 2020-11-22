import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BackendDeleteResponse, Datastore } from '@freelancer/datastore';
import {
  DiscoverCollection,
  DiscoverCollectionsCollection,
} from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';
import { ToastAlertType } from '@freelancer/ui/toast-alert';
import * as Rx from 'rxjs';

@Component({
  template: `
    <fl-bit
      flTrackingSection="DeleteCollectionModal"
      class="DeleteCollectionModal"
    >
      <ng-container>
        <fl-bit class="Header">
          <fl-heading
            i18n="Delete collection modal title"
            [flMarginBottomDesktop]="Margin.XSMALL"
            [size]="TextSize.LARGE"
            [headingType]="HeadingType.H1"
          >
            Delete collection
          </fl-heading>
        </fl-bit>
        <fl-banner-alert
          *ngIf="(deletePromise | async)?.status == 'error'"
          i18n="User feedback for a successfully deleted collection"
          [flMarginBottomDesktop]="Margin.XSMALL"
          [type]="BannerAlertType.ERROR"
        >
          Something went wrong while deleting this collection. Please try again.
        </fl-banner-alert>
        <fl-text
          i18n="Delete collection modal warning text"
          [flMarginBottomDesktop]="Margin.MID"
        >
          You can't undo this action. The items in this collection will not be
          deleted.
        </fl-text>
        <fl-bit class="ButtonsContainer">
          <fl-button
            flTrackingLabel="CancelDeleteModalButton"
            i18n="Button to cancel deletion of collection"
            [color]="ButtonColor.TRANSPARENT_DARK"
            [flMarginRight]="Margin.XXSMALL"
            [size]="ButtonSize.SMALL"
            (click)="closeModal()"
          >
            Go Back
          </fl-button>
          <fl-button
            flTrackingLabel="DeleteCollectionModalButton"
            i18n="Button to delete collection"
            [color]="ButtonColor.DANGER"
            [busy]="deletePromise && (deletePromise | async) === null"
            [size]="ButtonSize.SMALL"
            (click)="deleteCollection(discoverCollection.id)"
          >
            Delete
          </fl-button>
        </fl-bit>
      </ng-container>
    </fl-bit>
  `,
  styleUrls: ['./delete-collection-modal.component.scss'],
})
export class DeleteCollectionModalComponent {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  Margin = Margin;
  TextSize = TextSize;
  HeadingType = HeadingType;
  BannerAlertType = BannerAlertType;
  ToastAlertType = ToastAlertType;

  deletePromise: Promise<BackendDeleteResponse<DiscoverCollectionsCollection>>;
  deleteError: boolean;
  deleteRedirectUrl$: Rx.Observable<string>;

  @Input() discoverCollection: DiscoverCollection;
  @Input() redirectUrl?: string;

  constructor(
    private modalRef: ModalRef<DeleteCollectionModalComponent>,
    private datastore: Datastore,
    private router: Router,
  ) {}

  closeModal() {
    this.modalRef.close();
  }

  deleteCollection(id: number) {
    this.deletePromise = this.datastore
      .document<DiscoverCollectionsCollection>('discoverCollections', id)
      .remove()
      .then(response => {
        if (response && response.status === 'success') {
          if (this.redirectUrl) {
            this.router.navigate([this.redirectUrl], {
              queryParams: { success_delete: true },
            });
          } else {
            this.closeModal();
          }
        }

        return response;
      });
  }
}
