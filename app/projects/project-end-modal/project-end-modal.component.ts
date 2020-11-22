import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { BackendUpdateResponse, Datastore } from '@freelancer/datastore';
import {
  BidsCollection,
  Invoice,
  InvoicesCollection,
  Milestone,
  MilestonesCollection,
  ProjectViewProject,
} from '@freelancer/datastore/collections';
import { HourlyContractHelper } from '@freelancer/hourly-contract';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';
import { isDefined } from '@freelancer/utils';
import {
  InvoiceStatusApi,
  ProjectInvoiceMilestoneLinkedStatusesApi,
} from 'api-typings/payments/payments';
import {
  BidCompleteStatusApi,
  MilestoneStatusApi,
} from 'api-typings/projects/projects';
import * as Rx from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

enum Reason {
  NOT_REQUIRED = 'My requirements have changed and I no longer require this work to be done',
  COMPLETE = 'I am satisfied that all my project requirements have been met',
  INCOMPLETE = 'The freelancer is unable to complete my project',
}

@Component({
  selector: `app-project-end-modal`,
  template: `
    <fl-bit flTrackingSection="ProjectEndModal">
      <fl-heading
        i18n="End project title."
        [size]="TextSize.MID"
        [headingType]="HeadingType.H4"
        [flMarginBottom]="Margin.SMALL"
      >
        End Project
      </fl-heading>
      <fl-text
        i18n="End project confirmation text"
        [flMarginBottom]="Margin.MID"
      >
        Ending this project will notify
        {{ freelancerDisplayName$ | async }} that no further work is required
        for this project.
        <ng-container
          *ngIf="initialPaymentMilestone$ | async as initialPaymentMilestone"
        >
          The remaining
          {{
            initialPaymentMilestone.amount
              | flCurrency: initialPaymentMilestone.currency?.code
          }}
          Initial Payment will be refunded to your account balance.
        </ng-container>
      </fl-text>
      <fl-bit
        *ngIf="
          !(hasOutstandingPayments$ | async) && !(isAutoBillingEnabled$ | async)
        "
      >
        <fl-text
          i18n="Description for end project options."
          [flMarginBottom]="Margin.XXSMALL"
          [weight]="FontWeight.BOLD"
        >
          What are the terms to end this project?
        </fl-text>
        <fl-bit [flMarginBottom]="Margin.MID">
          <fl-radio
            flTrackingLabel="EndProjectRadioSelect"
            [control]="control"
            [options]="options$ | async"
          ></fl-radio>
        </fl-bit>
      </fl-bit>
      <fl-text
        [color]="FontColor.ERROR"
        [flMarginBottom]="Margin.MID"
        *ngIf="isAutoBillingEnabled$ | async"
        i18n="Auto billing enabled error"
      >
        <ng-container
          *ngIf="!(isTokenProject$ | async); else autoApprovalEnabled"
        >
          To end this hourly project, you must first end the Automatic Billing
          agreement. This can be achieved by turning off the Automatic Billing
          toggle on the Payments tab.
        </ng-container>
        <ng-template #autoApprovalEnabled>
          To end this hourly project, you must first end the Automatic Approval
          agreement. This can be achieved by turning off the Automatic Approval
          toggle on the Milestones tab.
        </ng-template>
      </fl-text>
      <fl-text
        [color]="FontColor.ERROR"
        [flMarginBottom]="Margin.MID"
        *ngIf="hasOutstandingPayments$ | async"
        i18n="Outstanding payments error"
      >
        <!-- has outstanding payment i.e. milestone or invoice -->
        <ng-container
          *ngIf="!(isTokenProject$ | async); else outstandingMilestones"
        >
          You must release or cancel any outstanding payments before ending your
          project.
        </ng-container>
        <ng-template #outstandingMilestones>
          You must release or cancel any outstanding milestones before ending
          your project.
        </ng-template>
      </fl-text>

      <fl-text
        [color]="FontColor.ERROR"
        [flMarginBottom]="Margin.MID"
        *ngIf="submissionPromise | async as error"
      >
        <ng-container
          *ngIf="error.status !== 'success' && error.errorCode"
          [ngSwitch]="error.errorCode"
        >
          <ng-container
            *ngSwitchCase="'PROJECT_PENDING_INVOICE'"
            i18n="Pending invoice error"
          >
            You must release or cancel any oustanding invoices to end your
            project.
          </ng-container>
          <ng-container
            *ngSwitchCase="'PROJECT_PENDING_MILESTONE'"
            i18n="Pending milestone error"
          >
            You must release or cancel any pending milestones to end your
            project.
          </ng-container>
          <ng-container
            *ngSwitchCase="'PROJECT_PENDING_DISPUTE'"
            i18n="Pending dispute error"
          >
            You cannot end your project until your dispute is resolved.
          </ng-container>
          <ng-container
            *ngSwitchCase="'INVOICE_PAYMENT_REQUIRED'"
            i18n="Invoice payment required error"
          >
            You must pay for any failed invoices to end your project.
          </ng-container>
          <ng-container *ngSwitchDefault i18n="Generic error">
            Something went wrong.
          </ng-container>
        </ng-container>
        <ng-container
          *ngIf="error.status !== 'success' && error.requestId"
          i18n="Give support request ID"
        >
          Please contact support@freelancer.com with this request ID:
          {{ error.requestId }}
        </ng-container>
      </fl-text>
      <fl-bit class="ButtonsContainer">
        <fl-button
          flTrackingLabel="CloseEndProjectModalButton"
          i18n="Button to cancel end project action"
          [color]="ButtonColor.DEFAULT"
          [disabled]="submissionPromise && (submissionPromise | async) === null"
          [flMarginRight]="Margin.XXSMALL"
          [size]="ButtonSize.SMALL"
          (click)="handleCancel()"
        >
          Cancel
        </fl-button>
        <fl-button
          *ngIf="bidderId$ | async as bidderId"
          flTrackingLabel="ConfirmEndProjectModalButton"
          i18n="Button to confirm end project action"
          [flTrackingExtraParams]="{
            freelancerId: bidderId
          }"
          [color]="ButtonColor.SECONDARY"
          [size]="ButtonSize.SMALL"
          [disabled]="
            !control.dirty ||
            (hasOutstandingPayments$ | async) ||
            (isAutoBillingEnabled$ | async)
          "
          [busy]="submissionPromise && (submissionPromise | async) === null"
          (click)="handleClick()"
        >
          End Project
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./project-end-modal.component.scss'],
})
export class ProjectEndModalComponent implements OnInit {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  HeadingType = HeadingType;
  TextSize = TextSize;
  FontColor = FontColor;
  FontWeight = FontWeight;
  Margin = Margin;

  @Input() freelancerDisplayName$: Rx.Observable<string>;
  @Input() bidId$: Rx.Observable<number>;
  @Input() bidderId$: Rx.Observable<number>;
  @Input() project$: Rx.Observable<ProjectViewProject>;

  bidderId: number;
  control = new FormControl();
  options$: Rx.Observable<ReadonlyArray<string>>;

  submissionPromise: Promise<BackendUpdateResponse<BidsCollection>>;
  hasOutstandingPayments$: Rx.Observable<boolean>;

  initialPaymentMilestone$: Rx.Observable<Milestone | undefined>;

  isTokenProject$: Rx.Observable<boolean>;
  isAutoBillingEnabled$: Rx.Observable<boolean>;

  constructor(
    private datastore: Datastore,
    private modalRef: ModalRef<ProjectEndModalComponent>,
    private hourlyContractHelper: HourlyContractHelper,
  ) {}

  ngOnInit() {
    const milestones$ = this.datastore
      .collection<MilestonesCollection>('milestones', query =>
        query.where('bidId', '==', this.bidId$),
      )
      .valueChanges();

    this.initialPaymentMilestone$ = milestones$.pipe(
      map(milestones =>
        milestones.find(
          m => m.isInitialPayment && m.status === MilestoneStatusApi.FROZEN,
        ),
      ),
    );

    const invoices$ = this.datastore
      .collection<InvoicesCollection>('invoices', query =>
        query
          .where('bidId', '==', this.bidId$)
          .where(
            'milestoneLinkedStatus',
            '==',
            ProjectInvoiceMilestoneLinkedStatusesApi.LINKED,
          ),
      )
      .valueChanges();

    this.options$ = this.getOptions$(milestones$, invoices$);

    this.hasOutstandingPayments$ = this.checkOutstandingPayments$(
      milestones$,
      invoices$,
    );

    this.isTokenProject$ = this.project$.pipe(
      map(project => project.isTokenProject),
    );

    const hourlyContractsCollection = this.hourlyContractHelper.getHourlyContractsCollectionByUser(
      this.project$,
      this.bidderId$,
    );

    const activeHourlyContract$ = hourlyContractsCollection.valueChanges().pipe(
      map(hourlyContracts => hourlyContracts[0]),
      filter(isDefined),
    );

    this.isAutoBillingEnabled$ = activeHourlyContract$.pipe(
      map(hourlyContract => hourlyContract.timeTrackingStopped === undefined),
    );
  }

  handleCancel() {
    this.modalRef.close();
  }

  /**
   * Get options for form input. We use different copy for COMPLETE depending on
   * whether a payment has been made (project is complete) or not (project no
   * longer required).
   */
  private getOptions$(
    milestones$: Rx.Observable<ReadonlyArray<Milestone>>,
    invoices$: Rx.Observable<ReadonlyArray<Invoice>>,
  ) {
    const hasClearedMilestone$ = milestones$.pipe(
      map(milestones =>
        milestones.some(m => m.status === MilestoneStatusApi.CLEARED),
      ),
    );
    const hasPaidInvoice$ = invoices$.pipe(
      map(invoices => invoices.some(i => i.status === InvoiceStatusApi.PAID)),
    );
    const hasMadePayment$ = Rx.combineLatest([
      hasClearedMilestone$,
      hasPaidInvoice$,
    ]).pipe(
      map(
        ([hasClearedMilestone, hasPaidInvoice]) =>
          hasClearedMilestone || hasPaidInvoice,
      ),
    );

    return hasMadePayment$.pipe(
      map(hasMadePayment =>
        hasMadePayment
          ? [Reason.COMPLETE, Reason.INCOMPLETE]
          : [Reason.NOT_REQUIRED, Reason.INCOMPLETE],
      ),
    );
  }

  /**
   * Check for outstanding payments (unreleased milestones and unpaid invoices)
   */
  private checkOutstandingPayments$(
    milestones$: Rx.Observable<ReadonlyArray<Milestone>>,
    invoices$: Rx.Observable<ReadonlyArray<Invoice>>,
  ) {
    const hasUnreleasedMilestones$ = milestones$.pipe(
      map(milestones =>
        milestones
          .filter(m => !m.isInitialPayment)
          .some(m => m.status !== MilestoneStatusApi.CLEARED),
      ),
    );
    const hasUnpaidInvoices$ = invoices$.pipe(
      map(
        invoices =>
          !invoices.every(
            i =>
              i.status === InvoiceStatusApi.PAID ||
              i.status === InvoiceStatusApi.WITHDRAWN,
          ),
      ),
    );
    return Rx.combineLatest([
      hasUnreleasedMilestones$,
      hasUnpaidInvoices$,
    ]).pipe(
      map(
        ([hasUnreleasedMilestones, hasUnpaidInvoices]) =>
          hasUnreleasedMilestones || hasUnpaidInvoices,
      ),
    );
  }

  handleClick() {
    const bidDocument = this.datastore.document<BidsCollection>(
      'bids',
      this.bidId$,
    );

    // map from radio option value (which is the displayed copy) to appropriate bid status.
    const bidCompleteStatusOptionsMap: Record<string, BidCompleteStatusApi> = {
      [Reason.COMPLETE]: BidCompleteStatusApi.COMPLETE,
      [Reason.NOT_REQUIRED]: BidCompleteStatusApi.COMPLETE,
      [Reason.INCOMPLETE]: BidCompleteStatusApi.INCOMPLETE,
    };

    const completeStatus = bidCompleteStatusOptionsMap[this.control.value];

    this.submissionPromise = bidDocument
      .valueChanges()
      .pipe(take(1))
      .toPromise()
      .then(bid => {
        this.bidderId = bid.bidderId;
        return bidDocument.update({ completeStatus });
      })
      .then(bidUpdateResponse => {
        if (bidUpdateResponse.status === 'success') {
          if (completeStatus === BidCompleteStatusApi.COMPLETE) {
            this.modalRef.close(this.bidderId); // complete ending
          } else {
            this.modalRef.close(false); // incomplete ending
          }
        }
        return bidUpdateResponse;
      });
  }
}
