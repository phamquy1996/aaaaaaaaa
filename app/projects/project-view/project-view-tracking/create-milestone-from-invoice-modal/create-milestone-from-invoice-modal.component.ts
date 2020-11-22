import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  BackendPushErrorResponse,
  BackendPushResponse,
  Datastore,
} from '@freelancer/datastore';
import {
  Bid,
  BidsCollection,
  CartsCollection,
  Currency,
  Invoice,
  Milestone,
  MilestoneDraft,
  MilestoneDraftsCollection,
  MilestonesCollection,
  ProjectViewUser,
  ProjectViewUsersCollection,
} from '@freelancer/datastore/collections';
import { PaymentsCart } from '@freelancer/payments-cart';
import { ModalRef } from '@freelancer/ui';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType, HeadingWeight } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontType, FontWeight, TextSize } from '@freelancer/ui/text';
import { isDefined, toNumber } from '@freelancer/utils';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import { ContextTypeApi, DestinationApi } from 'api-typings/payments/payments';
import { isValid, max, min } from 'date-fns';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';

interface InvoiceAggregate {
  invoices: ReadonlyArray<Invoice>;
  periodEnd?: Date;
  periodStart?: Date;
  hoursAmount: number;
  hours: number;
  currency: Currency;
  projectId: number;
}

interface InvoiceAndFreelancer {
  invoiceAggregate: InvoiceAggregate;
  freelancer: ProjectViewUser;
}

@Component({
  template: `
    <ng-container
      *ngIf="
        invoiceAndFreelancer$ | async as invoiceAndFreelancer;
        else Loading
      "
    >
      <fl-bit
        class="ModalBody"
        flTrackingSection="CreateMilestoneFromInvoiceModal"
      >
        <fl-heading
          i18n="Create milestone modal heading"
          [size]="TextSize.LARGE"
          [weight]="HeadingWeight.BOLD"
          [headingType]="HeadingType.H1"
          [flMarginBottom]="Margin.SMALL"
        >
          Confirm Payment
        </fl-heading>
        <fl-text
          *ngIf="invoices.length === 1"
          i18n="Create milestone modal body"
          [flMarginBottom]="Margin.LARGE"
        >
          This action will fund the unpaid hours previously billed by
          <fl-text [weight]="FontWeight.BOLD" [fontType]="FontType.SPAN">
            {{ invoiceAndFreelancer.freelancer.displayName }}
          </fl-text>
        </fl-text>
        <ng-container
          *ngIf="submitPromise && submitPromise | async as errorResponse"
        >
          <fl-banner-alert
            *ngIf="errorResponse.status !== 'success'"
            [type]="BannerAlertType.ERROR"
            [closeable]="false"
            [flMarginBottom]="Margin.SMALL"
            [ngSwitch]="errorResponse.errorCode"
          >
            <ng-container
              *ngSwitchCase="ErrorCodeApi.INVOICE_HAS_LINKED_MILESTONE"
              i18n="
                 Failed to create milestone for invoices error message as a
                milestone exists
              "
            >
              A Milestone Payment has already been created to fund these tracked
              hours. Please refresh the page.
            </ng-container>
            <ng-container
              *ngSwitchCase="ErrorCodeApi.INVOICE_NOT_UNPAID"
              i18n="
                 Failed to create milestone for not unpaid invoices error
                message
              "
            >
              You are not required to Pay for these tracked hours at this time.
              Please refresh the page.
            </ng-container>
            <ng-container
              *ngSwitchDefault
              i18n="Failed to create milestone for invoices error message"
            >
              Failed to create milestone payment. Please try again or contact
              support@freelancer.com with request id:
              {{ errorResponse.requestId }}
            </ng-container>
          </fl-banner-alert>
        </ng-container>
        <fl-bit class="InvoiceInfoTable" [flMarginBottom]="Margin.LARGE">
          <fl-text i18n="Invoice date range" [flMarginBottom]="Margin.MID">
            {{
              invoiceAndFreelancer.invoiceAggregate.periodStart
                | dateRange: invoiceAndFreelancer.invoiceAggregate.periodEnd
            }}
          </fl-text>
          <fl-list [bottomBorder]="true">
            <fl-list-item>
              <fl-bit class="Row">
                <fl-text i18n="Label for tracked hours" [color]="FontColor.MID">
                  Tracked Hours
                </fl-text>
                <fl-text i18n="Tracked hours number">
                  {{ invoiceAndFreelancer.invoiceAggregate.hours }}
                  <ng-container
                    *ngIf="
                      invoiceAndFreelancer.invoiceAggregate.hours === 1;
                      else pluralHours
                    "
                  >
                    hour
                  </ng-container>
                  <ng-template #pluralHours>hours</ng-template>
                </fl-text>
              </fl-bit>
            </fl-list-item>
            <fl-list-item>
              <fl-bit class="Row">
                <fl-text i18n="Label for amount to pay" [color]="FontColor.MID">
                  Amount to Pay
                </fl-text>
                <fl-text [weight]="FontWeight.BOLD">
                  {{
                    invoiceAndFreelancer.invoiceAggregate.hoursAmount
                      | flCurrency
                        : invoiceAndFreelancer.invoiceAggregate.currency.code
                  }}
                </fl-text>
              </fl-bit>
            </fl-list-item>
          </fl-list>
        </fl-bit>
        <fl-button
          class="ConfirmButton"
          i18n="Confirm and pay button"
          flTrackingLabel="CreateMilestoneButton"
          [color]="ButtonColor.SECONDARY"
          [busy]="submitPromise && (submitPromise | async) === null"
          (click)="
            handleConfirmClick(
              invoiceAndFreelancer.invoiceAggregate.invoices,
              invoiceAndFreelancer.invoiceAggregate.projectId,
              initialPaymentMilestone
            )
          "
        >
          Confirm and Pay
        </fl-button>
      </fl-bit>
    </ng-container>
    <ng-template #Loading>
      <fl-bit class="LoadingState">
        <fl-spinner
          flTrackingLabel="CreateMilestoneFromInvoiceModalInitialisationSpinner"
          [overlay]="true"
        ></fl-spinner>
      </fl-bit>
    </ng-template>
  `,
  styleUrls: ['./create-milestone-from-invoice-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateMilestoneFromInvoiceModalComponent implements OnInit {
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  ErrorCodeApi = ErrorCodeApi;
  FontColor = FontColor;
  FontType = FontType;
  FontWeight = FontWeight;
  TextSize = TextSize;
  HeadingType = HeadingType;
  HeadingWeight = HeadingWeight;
  Margin = Margin;

  @Input() initialPaymentMilestone: Milestone;

  @Input() invoices: ReadonlyArray<Invoice>;
  submitPromise: Promise<
    | BackendPushErrorResponse<CartsCollection>
    | BackendPushErrorResponse<MilestoneDraftsCollection>
    | BackendPushErrorResponse<MilestonesCollection>
    | BackendPushResponse<MilestonesCollection>
    | undefined
  >;
  invoiceAndFreelancer$: Rx.Observable<InvoiceAndFreelancer>;

  constructor(
    private cart: PaymentsCart,
    private datastore: Datastore,
    private modalRef: ModalRef<CreateMilestoneFromInvoiceModalComponent>,
  ) {}

  ngOnInit() {
    const freelancer$ = this.datastore
      .document<ProjectViewUsersCollection>(
        'projectViewUsers',
        this.invoices[0].freelancerId,
      )
      .valueChanges();

    const bid$ = this.datastore
      .document<BidsCollection>('bids', this.invoices[0].bidId)
      .valueChanges();

    this.invoiceAndFreelancer$ = Rx.combineLatest([freelancer$, bid$]).pipe(
      map(([freelancer, bid]) => ({
        invoiceAggregate: this.aggregateInvoices(this.invoices, bid),
        freelancer,
      })),
    );
  }

  handleConfirmClick(
    invoices: ReadonlyArray<Invoice>,
    projectId: number,
    initialPaymentMilestone?: Milestone,
  ) {
    let initialPaymentAmount = initialPaymentMilestone?.amount ?? 0;

    let totalOutstandingAmount = invoices.reduce(
      (acc, val) => acc + (val.totalHoursAmount - val.totalMilestoneAmount),
      0,
    );

    totalOutstandingAmount = toNumber(totalOutstandingAmount.toFixed(2));

    if (totalOutstandingAmount <= initialPaymentAmount) {
      this.submitPromise = Promise.all(
        invoices.map(invoice =>
          this.datastore.createDocument<MilestonesCollection>(
            'milestones',
            {
              // dummy
              projectId: invoice.projectId,
              // dummy
              timeCreated: 1,
            },
            { invoiceId: invoice.id },
          ),
        ),
      ).then(responses => {
        const errorResponse = responses.find(x => x.status === 'error');
        if (errorResponse) {
          return errorResponse;
        }
        // assume everything is fine when reached here
        this.modalRef.close();
      });
    } else {
      // redirect to deposit page
      const milestoneDrafts = invoices.map(invoice => {
        if (!invoice.bidId) {
          throw new Error('Bid id is missing from the invoice.');
        }
        if (!invoice.currency) {
          throw new Error('Currency is missing from the invoice.');
        }

        const outstandingAmount = toNumber(
          (invoice.totalHoursAmount - invoice.totalMilestoneAmount).toFixed(2),
        );

        let amountRequiresDeposit = 0;

        if (initialPaymentAmount > 0) {
          // if amountRequiresDeposit is positive that means
          // initial payment is not enough,
          // then we need to deposit the outstanding amount.
          amountRequiresDeposit = -(initialPaymentAmount - outstandingAmount);
          initialPaymentAmount -= outstandingAmount;
        } else {
          amountRequiresDeposit = outstandingAmount;
        }

        return {
          amount: amountRequiresDeposit > 0 ? amountRequiresDeposit : 0,
          bidderId: invoice.freelancerId,
          bidId: invoice.bidId,
          currencyId: invoice.currency.id,
          description: `Milestone for invoice ${invoice.id}`,
          projectId: invoice.projectId,
          projectOwnerId: invoice.employerId,
          timeCreated: Date.now(),
          invoiceId: invoice.id,
        };
      });

      this.submitPromise = Promise.all(
        milestoneDrafts.map(milestoneDraft =>
          this.datastore
            .createDocument<MilestoneDraftsCollection>(
              'milestoneDrafts',
              milestoneDraft,
            )
            .then(response => {
              if (response.status === 'error') {
                throw response;
              } else {
                return {
                  ...milestoneDraft,
                  id: response.id,
                };
              }
            }),
        ),
      )
        .then(milestoneDraftResponses =>
          this.cart.handle(
            milestoneDraftResponses.length === 1
              ? `Milestone for invoice`
              : `Milestones for invoices`,
            {
              destination: DestinationApi.PROJECT_VIEW_PAGE,
              payload: `${projectId}`,
            },
            milestoneDraftResponses.map((milestoneDraftResponse, idx) =>
              this.constructCartItem(invoices[idx], milestoneDraftResponse),
            ),
          ),
        )
        .then(response => {
          if (response.status === 'success') {
            this.modalRef.close();
            return undefined;
          }
          throw response;
        })
        .catch(errorResponse => errorResponse);
    }
  }

  constructCartItem(invoice: Invoice, milestoneDraftResponse: MilestoneDraft) {
    if (!invoice.currency) {
      throw new Error('Currency is missing from the invoice.');
    }

    return {
      contextType: ContextTypeApi.MILESTONE,
      contextId: `${milestoneDraftResponse.id}`,
      description: `Milestone for invoice ${invoice.id}`,
      currencyId: invoice.currency.id,
      amount: milestoneDraftResponse.amount,
      useBonus: true,
    };
  }

  aggregateInvoices(
    invoices: ReadonlyArray<Invoice>,
    bid: Bid,
  ): InvoiceAggregate {
    if (!invoices.length) {
      throw new Error(
        'Can not create an invoice aggregate from an empty array.',
      );
    }
    if (!invoices[0].currency) {
      throw new Error('Currency is missing from first invoice.');
    }

    const maxPeriodEnd = max(
      invoices.map(({ periodEnd }) => periodEnd).filter(isDefined),
    );
    const minPeriodStart = min(
      invoices.map(({ periodStart }) => periodStart).filter(isDefined),
    );
    const hoursAmount = invoices
      .map(
        ({ totalHoursAmount, totalMilestoneAmount }) =>
          totalHoursAmount - totalMilestoneAmount,
      )
      .reduce((a, b) => a + b);
    const hours = hoursAmount / bid.amount;
    return {
      invoices,
      periodEnd: isValid(maxPeriodEnd) ? maxPeriodEnd : undefined,
      periodStart: isValid(minPeriodStart) ? minPeriodStart : undefined,
      hoursAmount: toNumber(hoursAmount.toFixed(2)),
      hours: toNumber(hours.toFixed(2)),
      currency: invoices[0].currency,
      projectId: invoices[0].projectId,
    };
  }
}
