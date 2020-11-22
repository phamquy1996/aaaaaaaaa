import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BackendUpdateResponse, Datastore } from '@freelancer/datastore';
import {
  Bid,
  BidAwardDraftsCollection,
  BidsCollection,
  HourlyProjectMilestoneFeesCollection,
  ProjectViewProject,
  ProjectViewUser,
} from '@freelancer/datastore/collections';
import { PaymentsCart } from '@freelancer/payments-cart';
import { TimeUtils } from '@freelancer/time-utils';
import { toNumber } from '@freelancer/utils';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import {
  ContextTypeApi,
  DestinationApi,
  ProjectFeeTypeApi,
} from 'api-typings/payments/payments';
import {
  BidAwardStatusApi,
  HourlyContractBillingCycleApi,
  ProjectTypeApi,
} from 'api-typings/projects/projects';
import { transformProjectFeeToCartItem } from 'app/projects/shared/cart.helper';
import { take } from 'rxjs/operators';
import { HourlyAwardModalErrorType } from '../hourly-award-modal-error/hourly-award-modal-error.component';

@Component({
  selector: 'app-hourly-hourly-award-modal',
  template: `
    <app-hourly-award-layout>
      <app-hourly-award-as-hourly-form
        HourlyAwardLayout="body"
        [bid]="bid"
        [employer]="employer"
        [freelancer]="freelancer"
        [project]="project"
        [submissionPromise]="submissionPromise"
        [showInitialPayment]="eligibleForInitialPayment"
        (awardBid)="award($event)"
        (paymentVerifyAndAward)="navigateToPaymentVerifyPage($event)"
        (switchAwardType)="switchToFixed()"
        (close)="handleModalClose($event)"
      ></app-hourly-award-as-hourly-form>
      <app-hourly-hourly-award-sidebar
        HourlyAwardLayout="sidebar"
      ></app-hourly-hourly-award-sidebar>
    </app-hourly-award-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HourlyAwardAsHourlyComponent {
  @Input() bid: Bid;
  @Input() project: ProjectViewProject;
  @Input() employer: ProjectViewUser;
  @Input() freelancer: ProjectViewUser;
  @Input() eligibleForInitialPayment: boolean;
  @Output() switchAwardType = new EventEmitter<ProjectTypeApi>();
  @Output() close = new EventEmitter<boolean>();

  submissionPromise: Promise<
    BackendUpdateResponse<BidsCollection> & {
      errorType?: HourlyAwardModalErrorType;
    }
  >;

  constructor(
    private cart: PaymentsCart,
    private datastore: Datastore,
    private router: Router,
    private timeUtility: TimeUtils,
  ) {}

  switchToFixed() {
    this.switchAwardType.emit(ProjectTypeApi.FIXED);
  }

  handleModalClose(result: boolean) {
    this.close.emit(result);
  }

  award(awardForm: FormGroup) {
    const initialPaymentAmount =
      (this.bid.amount * awardForm.controls.weeklyLimit.value) / 2;
    this.submissionPromise = (this.eligibleForInitialPayment
      ? Promise.all([
          this.datastore.createDocument<BidAwardDraftsCollection>(
            'bidAwardDrafts',
            {
              bidId: this.bid.id,
              workLimit: toNumber(awardForm.controls.weeklyLimit.value),
              billingCycle: HourlyContractBillingCycleApi.WEEKLY,
              skipHourlyContract: false,
              timeCreated: Date.now(),
            },
          ),
          this.datastore
            .collection<HourlyProjectMilestoneFeesCollection>(
              'hourlyProjectMilestoneFees',
              query =>
                query
                  .where('projectId', '==', this.project.id)
                  .where('milestoneAmount', '==', initialPaymentAmount),
            )
            .valueChanges()
            .pipe(take(1))
            .toPromise(),
        ]).then(([response, fees]) => {
          const { fee } = fees[0];
          if (response.status === 'success') {
            return this.cart.handle(
              `Create initial payment for bid ${this.bid.id}`,
              {
                destination: DestinationApi.PROJECT_VIEW_PAGE,
                payload: `${this.project.id}`,
              },
              [
                {
                  contextType: ContextTypeApi.HOURLY_INITIAL_PAYMENT,
                  contextId: `${response.id}`,
                  description: `Initial payment for bid (ID: ${this.bid.id})`,
                  currencyId: this.project.currency.id,
                  amount: initialPaymentAmount,
                },
                transformProjectFeeToCartItem(
                  response.id,
                  this.project.currency.id,
                  fee,
                  ProjectFeeTypeApi.HOURLY_INITIAL_PAYMENT,
                ),
              ],
            );
          }
          return response;
        })
      : this.datastore.document<BidsCollection>('bids', this.bid.id).update({
          awardStatus: BidAwardStatusApi.PENDING,
          extraForUpdate: {
            workLimit: awardForm.controls.weeklyLimit.value,
            billingCycle: HourlyContractBillingCycleApi.WEEKLY, // Always weekly
            skipHourlyContract: false, // Or can just don't pass this field
          },
        })
    ).then(bidAwardResponse => {
      if (bidAwardResponse.status === 'error') {
        switch (bidAwardResponse.errorCode) {
          case ErrorCodeApi.PAYMENT_VERIFICATION_REQUIRED: {
            // Redirect the user to the payment verification page
            // after displaying the error message.
            this.navigateToPaymentVerifyPage(
              true, // With delay.
            );
            return {
              errorType:
                HourlyAwardModalErrorType.PAYMENT_VERIFICATION_REQUIRED,
              ...bidAwardResponse,
            };
          }
          case ErrorCodeApi.FREELANCER_ACCOUNT_UNDER_REVIEW: {
            return {
              errorType:
                HourlyAwardModalErrorType.FREELANCER_ACCOUNT_UNDER_REVIEW,
              ...bidAwardResponse,
            };
          }
          case ErrorCodeApi.MAXIMUM_AWARDED_BIDDERS_REACHED: {
            return {
              errorType:
                HourlyAwardModalErrorType.MAXIMUM_AWARDED_BIDDERS_REACHED,
              ...bidAwardResponse,
            };
          }
          case ErrorCodeApi.FREELANCER_ALREADY_AWARDED: {
            return {
              errorType: HourlyAwardModalErrorType.FREELANCER_ALREADY_AWARDED,
              ...bidAwardResponse,
            };
          }
          default: {
            return {
              errorType: HourlyAwardModalErrorType.AWARD_FAILED,
              ...bidAwardResponse,
            };
          }
        }
      }

      this.close.emit(true);
      return bidAwardResponse;
    });
  }

  navigateToPaymentVerifyPage(redirectWithDelay = false) {
    const bidId = this.bid.id;
    const projectId = this.project.id;

    const redirectToPaymentVerify = () => {
      this.router.navigate(['/verify'], {
        queryParams: {
          ref: 'hourly',
          bidId,
          projectId,
          awardBid: true,
        },
      });
    };

    if (redirectWithDelay) {
      this.timeUtility.setTimeout(redirectToPaymentVerify, 5000);
    } else {
      redirectToPaymentVerify();
    }
  }
}
