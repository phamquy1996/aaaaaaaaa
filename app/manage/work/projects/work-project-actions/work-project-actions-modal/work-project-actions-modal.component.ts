import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  BackendUpdateResponse,
  Datastore,
  DatastoreDocument,
} from '@freelancer/datastore';
import {
  Bid,
  BidsCollection,
  MilestoneRequestAction,
  MilestoneRequestsCollection,
  Project,
} from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';
import { assertNever } from '@freelancer/utils';
import {
  BidAwardStatusApi,
  MilestoneRequestStatusApi,
} from 'api-typings/projects/projects';
import * as Rx from 'rxjs';
import { take } from 'rxjs/operators';
import { WorkProjectModalAction } from '../work-project-actions.types';

@Component({
  template: `
    <fl-bit
      flTrackingSection="WorkProjectActionsModal"
      [flMarginBottom]="Margin.SMALL"
      [ngSwitch]="action"
    >
      <ng-container *ngSwitchCase="WorkProjectModalAction.CONFIRM_RETRACT_BID">
        <fl-heading
          i18n="Retract bid confirmation header"
          [size]="TextSize.MID"
          [headingType]="HeadingType.H1"
          [flMarginBottom]="Margin.SMALL"
        >
          Retract Bid
        </fl-heading>
        <fl-text i18n="Retract bid confirmation text">
          Are you sure you want to retract your bid?
        </fl-text>
      </ng-container>
      <ng-container *ngSwitchCase="WorkProjectModalAction.CONFIRM_ACCEPT_AWARD">
        <fl-heading
          i18n="Accept bid award confirmation header"
          [size]="TextSize.MID"
          [headingType]="HeadingType.H1"
          [flMarginBottom]="Margin.SMALL"
        >
          Congratulations! You've been awarded the project!
        </fl-heading>
        <fl-text i18n="Accept bid award confirmation text">
          If you accept this project, you will be charged a project fee in
          accordance with the
          <fl-link
            flTrackingLabel="FeesAndChargesLink"
            [link]="'/feesandcharges'"
          >
            Fees and Charges.
          </fl-link>
        </fl-text>
      </ng-container>
    </fl-bit>
    <ng-container *ngIf="confirmPromise | async as confirm">
      <fl-banner-alert
        i18n="Error encountered when processing confiramtion action"
        *ngIf="confirm.status !== 'success'"
        [closeable]="false"
        [flMarginBottom]="Margin.SMALL"
        [type]="BannerAlertType.ERROR"
      >
        Something went wrong. Please try refreshing the page or contacting
        support with request ID: {{ confirm.requestId }}
      </fl-banner-alert>
    </ng-container>
    <fl-bit
      flTrackingSection="WorkProjectActionsModalCallToAction"
      *ngIf="bid$ | async as bid"
      class="CallToAction"
    >
      <fl-button
        i18n="Cancel confirmation button"
        [color]="ButtonColor.DEFAULT"
        [disabled]="confirmPromise && (confirmPromise | async) === null"
        [size]="ButtonSize.SMALL"
        [flMarginRight]="Margin.SMALL"
        [flTrackingLabel]="
          action === WorkProjectModalAction.CONFIRM_RETRACT_BID
            ? 'CancelRetractBidButton'
            : 'CancelAcceptAwardButton'
        "
        (click)="handleCancelClick()"
      >
        Cancel
      </fl-button>
      <fl-button
        i18n="Confirm confirmation button"
        [busy]="confirmPromise && (confirmPromise | async) === null"
        [color]="ButtonColor.SECONDARY"
        [flTrackingLabel]="
          action === WorkProjectModalAction.CONFIRM_RETRACT_BID
            ? 'ConfirmRetractBidButton'
            : 'ConfirmAcceptAwardButton'
        "
        [size]="ButtonSize.SMALL"
        (click)="handleConfirmClick(bid.id)"
      >
        Confirm
      </fl-button>
    </fl-bit>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./work-project-actions-modal.component.scss'],
})
export class WorkProjectActionsModalComponent implements OnInit {
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  HeadingType = HeadingType;
  Margin = Margin;
  TextSize = TextSize;
  WorkProjectModalAction = WorkProjectModalAction;

  confirmPromise: Promise<BackendUpdateResponse<BidsCollection>>;
  bid$: Rx.Observable<Bid>;

  @Input() bidDocument: DatastoreDocument<BidsCollection>;
  @Input() project: Project;
  @Input() action: WorkProjectModalAction;

  constructor(
    private datastore: Datastore,
    private modalRef: ModalRef<WorkProjectActionsModalComponent>,
    private router: Router,
  ) {}

  ngOnInit() {
    this.bid$ = this.bidDocument.valueChanges();
  }

  handleCancelClick() {
    this.modalRef.close();
  }

  handleConfirmClick(bidId: number) {
    switch (this.action) {
      case WorkProjectModalAction.CONFIRM_ACCEPT_AWARD:
        this.confirmPromise = this.handleAcceptAward();
        break;
      case WorkProjectModalAction.CONFIRM_RETRACT_BID:
        this.confirmPromise = this.handleRetractBid(bidId);
        break;
      default:
        assertNever(this.action);
    }
  }

  handleAcceptAward(): Promise<BackendUpdateResponse<BidsCollection>> {
    return this.bidDocument
      .update({
        awardStatus: BidAwardStatusApi.AWARDED,
      })
      .then(response => {
        if (response.status === 'success') {
          this.router.navigate([`/projects/${this.project.seoUrl}/payments`]);
        }
        return response;
      });
  }

  handleRetractBid(
    bidId: number,
  ): Promise<BackendUpdateResponse<BidsCollection>> {
    return this.bidDocument
      .update({
        retracted: true,
      })
      .then(response => {
        if (response.status === 'success') {
          const milestoneRequestsCollection = this.datastore.collection<
            MilestoneRequestsCollection
          >('milestoneRequests', query =>
            query
              .where('bidId', '==', bidId)
              .where('status', '==', MilestoneRequestStatusApi.PENDING),
          );
          milestoneRequestsCollection
            .valueChanges()
            .pipe(take(1))
            .toPromise()
            .then(requests =>
              requests.forEach(milestone => {
                milestoneRequestsCollection.update(milestone.id, {
                  action: MilestoneRequestAction.DELETE,
                });
              }),
            );
          this.modalRef.close(response);
        }
        return response;
      });
  }
}
