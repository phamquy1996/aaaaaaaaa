import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BackendPushErrorResponse } from '@freelancer/datastore';
import { CartsCollection, UserStatus } from '@freelancer/datastore/collections';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-freelancer-verified-landing-status-modal-not-joined',
  template: `
    <fl-heading
      i18n="Freelancer Verified application header"
      [flMarginBottom]="Margin.SMALL"
      [headingType]="HeadingType.H3"
      [size]="TextSize.LARGE"
    >
      You are one step closer to being verified.
    </fl-heading>

    <fl-bit [flMarginBottom]="Margin.LARGE">
      <fl-text
        i18n="Freelancer Verified application process description text"
        [flMarginBottom]="Margin.XSMALL"
      >
        The Verified process includes examining your verification documents,
        your Freelancer profile and possibly a video call with our team.
        <br />
        We will reach out via chat once your application has been submitted.
      </fl-text>

      <fl-banner-alert
        *ngIf="cartError$ | async as cartError; else noError"
        [closeable]="false"
        [ngSwitch]="cartError.errorCode"
        [type]="BannerAlertType.ERROR"
      >
        <ng-container
          *ngSwitchCase="ErrorCodeApi.BAD_REQUEST"
          i18n="Error when trying to go to cart when user has already applied"
        >
          You have already applied to get verified. Please refresh the page. If
          this error persists, please contact support with the following request
          ID: {{ cartError.requestId }}
        </ng-container>

        <ng-container
          *ngSwitchDefault
          i18n="Generic error when trying to go to cart to checkout"
        >
          Something went wrong. Please refresh the page and try again. You can
          also contact support with the following request ID:
          {{ cartError.requestId }}
        </ng-container>
      </fl-banner-alert>

      <ng-template #noError>
        <fl-banner-alert
          *ngIf="(verifiedEligible$ | async) === false"
          i18n="
             User missing needed requirements to submit application for
            Freelancer Verified
          "
          [closeable]="false"
          [type]="BannerAlertType.ERROR"
        >
          It looks like you are missing some of the requirements to continue the
          Verified process. Please complete these to proceed.
        </fl-banner-alert>

        <fl-banner-alert
          *ngIf="missingRequirementsVerifiedEligible$ | async"
          i18n="
             User missing optional requirements for Freelancer Verified and can
            submit application
          "
          [closeable]="false"
          [type]="BannerAlertType.WARNING"
        >
          You are missing some requirements. You may submit your application,
          but you will have to complete any outstanding requirements afterwards.
        </fl-banner-alert>
      </ng-template>
    </fl-bit>

    <app-freelancer-verified-landing-status-modal-requirements
      [hideActions$]="verifiedEligible$"
      [requirementStatuses$]="requirementStatuses$"
      [showCompletedRequirements$]="fullyVerifiedEligible$"
    ></app-freelancer-verified-landing-status-modal-requirements>

    <fl-button
      *ngIf="verifiedEligible$ | async"
      i18n="Proceed to cart to pay for Freelancer Verified button"
      flTrackingLabel="ProceedToCartButton"
      [color]="ButtonColor.PRIMARY"
      [busy]="isBusy$ | async"
      [size]="ButtonSize.LARGE"
      (click)="handleVerifiedCart()"
    >
      Proceed to cart
    </fl-button>
  `,
})
export class FreelancerVerifiedLandingStatusModalNotJoinedComponent
  implements OnInit {
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  ErrorCodeApi = ErrorCodeApi;
  HeadingType = HeadingType;
  Margin = Margin;
  TextSize = TextSize;

  // TODO: T170201 - Update error handling in this component to use custom exceptions
  @Input() cartError$: Rx.Observable<BackendPushErrorResponse<CartsCollection>>;
  @Input() requirementStatuses$: Rx.Observable<UserStatus>;

  @Output() verifiedCartClicked = new EventEmitter<void>();

  private isBusySubject$ = new Rx.BehaviorSubject<boolean>(false);
  isBusy$ = this.isBusySubject$.asObservable();

  fullyVerifiedEligible$: Rx.Observable<boolean>;
  missingRequirementsVerifiedEligible$: Rx.Observable<boolean>;
  verifiedEligible$: Rx.Observable<boolean>;

  ngOnInit(): void {
    this.verifiedEligible$ = this.requirementStatuses$.pipe(
      map(
        requirementStatuses =>
          requirementStatuses.emailVerified &&
          requirementStatuses.phoneVerified,
      ),
    );

    this.fullyVerifiedEligible$ = this.requirementStatuses$.pipe(
      map(
        requirementStatuses =>
          requirementStatuses.emailVerified &&
          requirementStatuses.phoneVerified &&
          requirementStatuses.paymentVerified &&
          requirementStatuses.identityVerified,
      ),
    );

    this.missingRequirementsVerifiedEligible$ = this.requirementStatuses$.pipe(
      map(
        requirementStatuses =>
          requirementStatuses.emailVerified &&
          requirementStatuses.phoneVerified &&
          !(
            requirementStatuses.paymentVerified &&
            requirementStatuses.identityVerified
          ),
      ),
    );
  }

  handleVerifiedCart() {
    this.isBusySubject$.next(true);
    this.verifiedCartClicked.emit();
  }
}
