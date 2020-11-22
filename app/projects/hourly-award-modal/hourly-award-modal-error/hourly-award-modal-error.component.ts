import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  BackendPushErrorResponse,
  BackendUpdateErrorResponse,
} from '@freelancer/datastore';
import {
  BidsCollection,
  CartsCollection,
  MilestoneDraftsCollection,
} from '@freelancer/datastore/collections';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { Margin } from '@freelancer/ui/margin';

export enum HourlyAwardModalErrorType {
  AWARD_FAILED = 'AWARD_FAILED',
  FREELANCER_ACCOUNT_UNDER_REVIEW = 'FREELANCER_ACCOUNT_UNDER_REVIEW',
  FREELANCER_ALREADY_AWARDED = 'FREELANCER_ALREADY_AWARDED',
  MAXIMUM_AWARDED_BIDDERS_REACHED = 'MAXIMUM_AWARDED_BIDDERS_REACHED',
  MILESTONE_FAILED = 'MILESTONE_FAILED',
  PAYMENT_VERIFICATION_REQUIRED = 'PAYMENT_VERIFICATION_REQUIRED',
}

@Component({
  selector: 'app-hourly-award-error',
  template: `
    <fl-banner-alert
      *ngIf="errorMessage"
      [ngSwitch]="errorMessage.errorType"
      [type]="BannerAlertType.ERROR"
      [closeable]="false"
      [flMarginBottom]="Margin.XXSMALL"
    >
      <ng-container
        *ngSwitchCase="HourlyAwardModalErrorType.PAYMENT_VERIFICATION_REQUIRED"
        i18n="Payment method requires verification."
      >
        You must verify your payment method before you award a freelancer. You
        are now being redirected.
      </ng-container>
      <ng-container
        *ngSwitchCase="
          HourlyAwardModalErrorType.FREELANCER_ACCOUNT_UNDER_REVIEW
        "
        i18n="Freelancer account is under review"
      >
        The freelancer you are trying to award is currently under review. Please
        choose another freelancer.
      </ng-container>
      <ng-container
        *ngSwitchCase="
          HourlyAwardModalErrorType.MAXIMUM_AWARDED_BIDDERS_REACHED
        "
        i18n="Project has reached maximum number of bidders"
      >
        This project has already reached the maximum number of awarded bidders.
        You can only award a maximum of 25 freelancers on your project.
      </ng-container>
      <ng-container
        *ngSwitchCase="HourlyAwardModalErrorType.FREELANCER_ALREADY_AWARDED"
        i18n="Freelancer has already been awarded"
      >
        You have already awarded the project to this freelancer.
      </ng-container>
      <ng-container
        *ngSwitchCase="HourlyAwardModalErrorType.AWARD_FAILED"
        i18n="Awarding freelancer failed"
      >
        An unknown error occurred while trying to award the freelancer. Please
        try again or contact support@freelancer.com with request_id:
        {{ errorMessage?.requestId }}
      </ng-container>
      <ng-container
        *ngSwitchCase="HourlyAwardModalErrorType.MILESTONE_FAILED"
        i18n="Milestone creation failed."
      >
        An unknown error occurred while trying to create the milestone. Please
        try again or contact support@freelancer.com with request_id:
        {{ errorMessage?.requestId }}
      </ng-container>
      <ng-container *ngSwitchDefault i18n="Hourly Award modal error message">
        Something went wrong!
      </ng-container>
    </fl-banner-alert>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HourlyAwardModalErrorComponent {
  BannerAlertType = BannerAlertType;
  Margin = Margin;
  HourlyAwardModalErrorType = HourlyAwardModalErrorType;

  @Input() errorMessage: (
    | BackendUpdateErrorResponse<BidsCollection>
    | BackendPushErrorResponse<MilestoneDraftsCollection>
    | BackendPushErrorResponse<CartsCollection>
  ) & {
    errorType: HourlyAwardModalErrorType;
  };
}
