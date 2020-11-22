import { Component, Input, OnInit } from '@angular/core';
import { UserStatus } from '@freelancer/datastore/collections';
import { Margin } from '@freelancer/ui/margin';
import { FontWeight, TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-freelancer-verified-landing-status-modal-requirements',
  template: `
    <fl-grid [flMarginBottom]="Margin.MID">
      <fl-col [col]="12" [flMarginBottom]="Margin.XSMALL">
        <fl-grid>
          <fl-col [col]="(hideActionColumn$ | async) ? 12 : 6">
            <fl-text
              i18n="Freelancer Verified Requirement title"
              [size]="TextSize.SMALL"
              [weight]="FontWeight.MEDIUM"
            >
              Requirement
            </fl-text>
          </fl-col>
          <fl-col *ngIf="hideActionColumn$ | async" [col]="6"> </fl-col>
        </fl-grid>
      </fl-col>

      <fl-col
        *ngIf="
          (showCompletedRequirements$ | async) ||
          !(requirementStatuses$ | async)?.emailVerified
        "
        [col]="12"
        [flMarginBottom]="Margin.XXXSMALL"
      >
        <app-freelancer-verified-landing-status-modal-requirement
          actionText="Complete email verification"
          i18n-actionText="Complete email verification"
          name="Email Verified"
          i18n-name="Email verified requirement name"
          [actionLink]="'/users/settings.php'"
          [actionFragment]="'EmailSettings'"
          [hideActionColumn]="hideActionColumn$ | async"
          [isCompleted]="(requirementStatuses$ | async)?.emailVerified"
        ></app-freelancer-verified-landing-status-modal-requirement>
      </fl-col>
      <fl-col
        *ngIf="
          (showCompletedRequirements$ | async) ||
          !(requirementStatuses$ | async)?.phoneVerified
        "
        [col]="12"
        [flMarginBottom]="Margin.XXXSMALL"
      >
        <app-freelancer-verified-landing-status-modal-requirement
          actionText="Complete phone verification"
          i18n-actionText="Complete phone verification"
          name="Phone Verified"
          i18n-name="Phone verified requirement name"
          [actionLink]="'/users/settings.php'"
          [actionFragment]="'TrustSettings'"
          [hideActionColumn]="hideActionColumn$ | async"
          [isCompleted]="(requirementStatuses$ | async)?.phoneVerified"
        ></app-freelancer-verified-landing-status-modal-requirement>
      </fl-col>
      <fl-col
        *ngIf="
          (showCompletedRequirements$ | async) ||
          !(requirementStatuses$ | async)?.paymentVerified
        "
        [col]="12"
        [flMarginBottom]="Margin.XXXSMALL"
      >
        <app-freelancer-verified-landing-status-modal-requirement
          actionText="Complete payment verification"
          i18n-actionText="Complete payment verification"
          name="Payment Verified"
          i18n-name="Payment verified requirement name"
          [actionLink]="'/payments/verify.php'"
          [hideActionColumn]="hideActionColumn$ | async"
          [isCompleted]="(requirementStatuses$ | async)?.paymentVerified"
        ></app-freelancer-verified-landing-status-modal-requirement>
      </fl-col>
      <fl-col
        *ngIf="
          (showCompletedRequirements$ | async) ||
          !(requirementStatuses$ | async)?.identityVerified
        "
        [col]="12"
        [flMarginBottom]="Margin.XXXSMALL"
      >
        <app-freelancer-verified-landing-status-modal-requirement
          actionText="Complete your KYC"
          i18n-actionText="Complete KYC process"
          name="Identity (KYC) Verified"
          i18n-name="Identity KYC completion requirement name"
          [actionLink]="'/users/kyc/verification-center-home'"
          [hideActionColumn]="hideActionColumn$ | async"
          [isCompleted]="(requirementStatuses$ | async)?.identityVerified"
        ></app-freelancer-verified-landing-status-modal-requirement>
      </fl-col>
    </fl-grid>
  `,
})
export class FreelancerVerifiedLandingStatusModalRequirementsComponent
  implements OnInit {
  FontWeight = FontWeight;
  Margin = Margin;
  TextSize = TextSize;

  @Input() showCompletedRequirements$: Rx.Observable<boolean>;
  @Input() hideActions$: Rx.Observable<boolean>;
  @Input() requirementStatuses$: Rx.Observable<UserStatus>;

  hideActionColumn$: Rx.Observable<boolean>;

  ngOnInit(): void {
    this.hideActionColumn$ = Rx.combineLatest([
      this.hideActions$,
      this.requirementStatuses$,
    ]).pipe(
      map(
        ([hideActions, requirementStatuses]) =>
          hideActions ||
          (requirementStatuses.emailVerified &&
            requirementStatuses.phoneVerified &&
            requirementStatuses.paymentVerified &&
            requirementStatuses.identityVerified),
      ),
    );
  }
}
