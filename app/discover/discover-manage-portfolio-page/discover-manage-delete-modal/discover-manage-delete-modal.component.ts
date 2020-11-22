import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BackendDeleteResponse, Datastore } from '@freelancer/datastore';
import { ShowcaseCollection } from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, TextSize } from '@freelancer/ui/text';

@Component({
  template: `
    <fl-bit class="MainBody" flTrackingSection="DiscoverManageDeleteModal">
      <fl-heading
        i18n="Delete portfolio modal title"
        [size]="TextSize.MID"
        [headingType]="HeadingType.H1"
        [flMarginBottom]="Margin.XXSMALL"
      >
        Delete portfolio item
      </fl-heading>
      <fl-text
        i18n="Delete portfolio modal subtitle"
        [flMarginBottom]="Margin.LARGE"
      >
        Are you sure you want to delete this portfolio item? You can't undo this
        action.
      </fl-text>
      <fl-grid>
        <fl-col [col]="12" [colDesktopSmall]="6">
          <ng-container *ngIf="deletePromise | async as deleteResponse">
            <fl-text
              *ngIf="deleteResponse.status == 'error'"
              i18n="Delete portfolio modal error message"
              [color]="FontColor.ERROR"
              [size]="TextSize.XXSMALL"
              [flMarginBottom]="Margin.XXSMALL"
            >
              <ng-container *ngIf="deleteResponse.requestId; else noRequestId">
                Something went wrong while deleting this portfolio. Please try
                refreshing the page or contacting support with request ID:
                {{ deleteResponse.requestId }}.
              </ng-container>
              <ng-template #noRequestId>
                Something went wrong while deleting this portfolio. Please try
                refreshing the page.
              </ng-template>
            </fl-text>
          </ng-container>
        </fl-col>

        <fl-col class="ActionContainer" [col]="12" [colDesktopSmall]="6">
          <fl-button
            i18n="Delete portfolio modal cancel button"
            flTrackingLabel="DeleteModalCloseButton"
            [color]="ButtonColor.TRANSPARENT_DARK"
            [flMarginRight]="Margin.SMALL"
            (click)="close()"
          >
            Go Back
          </fl-button>
          <fl-button
            i18n="Delete portfolio modal Delete button"
            flTrackingLabel="DeleteModalDeleteButton"
            [color]="ButtonColor.DANGER"
            [busy]="deletePromise && (deletePromise | async) === null"
            (click)="deletePortfolio(portfolioId)"
          >
            Delete
          </fl-button>
        </fl-col>
      </fl-grid>
    </fl-bit>
  `,
  styleUrls: ['./discover-manage-delete-modal.component.scss'],
})
export class DiscoverManageDeleteModalComponent {
  ButtonColor = ButtonColor;
  IconSize = IconSize;
  FontColor = FontColor;
  TextSize = TextSize;
  HeadingType = HeadingType;
  Margin = Margin;

  deletePromise: Promise<BackendDeleteResponse<ShowcaseCollection>>;
  @Input() portfolioId: number;
  @Input() redirectUrl?: string;

  constructor(
    private modalRef: ModalRef<DiscoverManageDeleteModalComponent>,
    private datastore: Datastore,
    private router: Router,
  ) {}

  close() {
    this.modalRef.close();
  }

  deletePortfolio(id: number) {
    this.deletePromise = this.datastore
      .document<ShowcaseCollection>('showcase', id)
      .remove()
      .then(response => {
        if (response.status === 'success') {
          if (this.redirectUrl) {
            this.router.navigate([this.redirectUrl]);
          } else {
            this.close();
          }
        }
        return response;
      });
  }
}
