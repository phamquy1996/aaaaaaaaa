import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Datastore, DatastoreDocument } from '@freelancer/datastore';
import { ProjectViewProjectsCollection } from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { FontType, TextSize } from '@freelancer/ui/text';
import { ProjectStatusApi } from 'api-typings/projects/projects';
import * as Rx from 'rxjs';

@Component({
  template: `
    <ng-container flTrackingSection="CloseBiddingModal">
      <fl-heading
        i18n="Close bidding modal header"
        [size]="TextSize.MID"
        [headingType]="HeadingType.H1"
        [flMarginBottom]="Margin.XSMALL"
      >
        Close bidding
      </fl-heading>

      <fl-bit [flMarginBottom]="Margin.XSMALL">
        <fl-text i18n="Close bidding modal body">
          By closing bidding, you will no longer receive additional bids on this
          project. You will still be able to award freelancers who've already
          bid and continue working with awarded freelancers.
        </fl-text>
      </fl-bit>

      <fl-banner-alert
        *ngIf="showError"
        [type]="BannerAlertType.ERROR"
        [closeable]="false"
        [flMarginBottom]="Margin.XXSMALL"
        i18n="Project close bidding modal error message"
      >
        There was a problem closing the bidding of your project. Please try
        again or contact support.
      </fl-banner-alert>

      <div class="ActionsContainer">
        <fl-button
          class="ActionsContainer-button"
          i18n="Close bidding modal cancel CTA"
          flTrackingLabel="CancelButton"
          [flMarginRight]="Margin.XSMALL"
          [color]="ButtonColor.DEFAULT"
          (click)="handleClose()"
        >
          Cancel
        </fl-button>
        <fl-button
          i18n="Close bidding modal confirm CTA"
          flTrackingLabel="CloseBiddingButton"
          [color]="ButtonColor.SECONDARY"
          [busy]="isBusy"
          (click)="handleConfirm()"
        >
          Close bidding
        </fl-button>
      </div>
    </ng-container>
  `,
  styleUrls: ['./close-bidding-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloseBiddingModalComponent implements OnInit {
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  TextSize = TextSize;
  HeadingType = HeadingType;
  IconSize = IconSize;
  FontType = FontType;
  Margin = Margin;

  isBusy = false;
  showError = false;
  projectDoc: DatastoreDocument<ProjectViewProjectsCollection>;

  @Input() projectId$: Rx.Observable<number>;

  constructor(
    private datastore: Datastore,
    private changeDetectorRef: ChangeDetectorRef,
    private modalRef: ModalRef<CloseBiddingModalComponent>,
  ) {}

  ngOnInit() {
    this.projectDoc = this.datastore.document<ProjectViewProjectsCollection>(
      'projectViewProjects',
      this.projectId$,
    );
  }

  handleClose() {
    this.modalRef.close('closed');
  }

  handleConfirm() {
    this.isBusy = true;
    this.showError = false;

    this.projectDoc
      .update({
        status: ProjectStatusApi.FROZEN,
      })
      .then(response => {
        if (response.status === 'success') {
          this.modalRef.close('success');
        } else {
          this.showError = true;
        }

        this.isBusy = false;
      });

    this.changeDetectorRef.markForCheck();
  }
}
