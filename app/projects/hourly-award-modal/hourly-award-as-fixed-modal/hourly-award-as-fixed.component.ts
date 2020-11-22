import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  BackendPushErrorResponse,
  BackendUpdateErrorResponse,
  Datastore,
} from '@freelancer/datastore';
import {
  Bid,
  BidsCollection,
  CartsCollection,
  MilestoneDraftsCollection,
  Project,
  ProjectViewProject,
  ProjectViewUser,
} from '@freelancer/datastore/collections';
import {
  PartialPaymentsCartItem,
  PaymentsCart,
} from '@freelancer/payments-cart';
import { toNumber } from '@freelancer/utils';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import { ContextTypeApi, DestinationApi } from 'api-typings/payments/payments';
import {
  BidAwardStatusApi,
  ProjectTypeApi,
} from 'api-typings/projects/projects';
import { HourlyAwardModalErrorType } from '../hourly-award-modal-error/hourly-award-modal-error.component';

export interface AwardForm {
  withMilestone: boolean;
  milestoneAmount: number;
  milestoneDescription: string;
}

@Component({
  selector: 'app-hourly-fixed-award-modal',
  template: `
    <app-hourly-award-layout>
      <app-hourly-award-as-fixed-form
        HourlyAwardLayout="body"
        [projectCurrency]="project?.currency"
        [bid]="bid"
        [allowMilestoneCreation]="allowMilestoneCreation"
        [submissionPromise]="submissionPromise"
        (switchToHourly)="switchToHourly()"
        (award)="award($event)"
      ></app-hourly-award-as-fixed-form>
      <app-award-modal-sidebar
        HourlyAwardLayout="sidebar"
      ></app-award-modal-sidebar>
    </app-hourly-award-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HourlyAwardAsFixedComponent {
  @Input() bid: Bid;
  @Input() project: ProjectViewProject;
  @Input() user: ProjectViewUser;
  @Input() allowMilestoneCreation: boolean;
  @Output() switchAwardType = new EventEmitter<ProjectTypeApi>();
  @Output() close = new EventEmitter<boolean>();

  submissionPromise: Promise<
    (
      | BackendUpdateErrorResponse<BidsCollection>
      | BackendPushErrorResponse<MilestoneDraftsCollection>
      | BackendPushErrorResponse<CartsCollection>
    ) & {
      errorType: HourlyAwardModalErrorType;
    }
  >;
  isAwardSuccess = false;

  constructor(
    private datastore: Datastore,
    private paymentsCart: PaymentsCart,
  ) {}

  switchToHourly() {
    this.switchAwardType.emit(ProjectTypeApi.HOURLY);
  }

  award(awardForm: AwardForm) {
    // Keep the same logic as the old pvp that
    // when the freelancer is awarded then navigate to payments tab
    // if the button is clicked again.
    if (this.isAwardSuccess) {
      this.navigateToPaymentTab();
      return;
    }

    this.submissionPromise = this.datastore
      .document<BidsCollection>('bids', this.bid.id)
      .update({
        awardStatus: BidAwardStatusApi.PENDING,
        extraForUpdate: {
          skipHourlyContract: true,
        },
      })
      .then(awardResponse => {
        if (awardResponse.status !== 'success') {
          switch (awardResponse.errorCode) {
            case ErrorCodeApi.FREELANCER_ACCOUNT_UNDER_REVIEW: {
              const e = {
                ...awardResponse,
                errorType:
                  HourlyAwardModalErrorType.FREELANCER_ACCOUNT_UNDER_REVIEW,
              };
              throw e;
            }
            case ErrorCodeApi.MAXIMUM_AWARDED_BIDDERS_REACHED: {
              const e = {
                ...awardResponse,
                errorType:
                  HourlyAwardModalErrorType.MAXIMUM_AWARDED_BIDDERS_REACHED,
              };
              throw e;
            }
            case ErrorCodeApi.FREELANCER_ALREADY_AWARDED: {
              const e = {
                ...awardResponse,
                errorType: HourlyAwardModalErrorType.FREELANCER_ALREADY_AWARDED,
              };
              throw e;
            }
            default: {
              const e = {
                ...awardResponse,
                errorType: HourlyAwardModalErrorType.AWARD_FAILED,
              };
              throw e;
            }
          }
        }

        this.isAwardSuccess = true;

        if (awardForm.withMilestone) {
          return this.createMilestoneDraft(awardForm, this.project, this.bid);
        }

        this.navigateToPaymentTab();
        // // skip following 'then'
        return Promise.reject();
      })
      .then(milestoneDraftResponse => {
        if (milestoneDraftResponse.status !== 'success') {
          throw milestoneDraftResponse;
        }
        const cartItem = this.createCartItem(
          awardForm,
          this.project,
          milestoneDraftResponse.id,
        );
        const description = `Milestones of project ${this.project.id}`;
        return this.paymentsCart.handle(
          description,
          {
            destination: DestinationApi.PROJECT_VIEW_PAGE,
            payload: `${this.project.id}`,
          },
          [cartItem],
          () => this.close.emit(false),
        );
      })
      .catch(e => ({
        errorType: HourlyAwardModalErrorType.MILESTONE_FAILED,
        ...e, // in case of AWARD_FAILED it overwrites the MILESTONE_FAILED
      }));
  }

  createMilestoneDraft(
    awardForm: AwardForm,
    project: ProjectViewProject,
    bid: Bid,
  ) {
    return this.datastore.createDocument<MilestoneDraftsCollection>(
      'milestoneDrafts',
      {
        amount: Number(awardForm.milestoneAmount),
        bidderId: bid.bidderId,
        bidId: bid.id,
        currencyId: project.currency.id,
        description: awardForm.milestoneDescription,
        milestoneRequestId: undefined,
        projectId: project.id,
        projectOwnerId: project.ownerId,
        timeCreated: Date.now(),
        transactionId: undefined,
      },
    );
  }

  createCartItem(
    awardForm: AwardForm,
    project: Project,
    milestoneDraftId: number,
  ): PartialPaymentsCartItem {
    return {
      contextType: ContextTypeApi.MILESTONE,
      contextId: `${milestoneDraftId}`,
      description: awardForm.milestoneDescription,
      currencyId: project.currency.id,
      amount: toNumber(awardForm.milestoneAmount),
      useBonus: true,
    };
  }

  navigateToPaymentTab() {
    // close modal and navigate to payment tab
    this.close.emit(true);
  }
}
