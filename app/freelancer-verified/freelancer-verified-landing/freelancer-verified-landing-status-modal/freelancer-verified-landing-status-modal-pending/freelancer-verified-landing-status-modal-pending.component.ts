import { Component, Input, OnInit } from '@angular/core';
import { UserStatus } from '@freelancer/datastore/collections';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-freelancer-verified-landing-status-modal-pending',
  template: `
    <fl-heading
      i18n="Freelancer Verified application header"
      [flMarginBottom]="Margin.SMALL"
      [headingType]="HeadingType.H3"
      [size]="TextSize.LARGE"
    >
      You are one step closer to being verified.
    </fl-heading>

    <fl-text
      i18n="Freelancer Verified application pending description text"
      [flMarginBottom]="Margin.XSMALL"
    >
      Your application has been received and our team will reach out to you
      shortly via chat. Typical response times are within 24 hours during
      weekdays. If you are submitting an application on a weekend, please expect
      a response on the next business day.
    </fl-text>

    <ng-container *ngIf="missingRequirements$ | async">
      <fl-banner-alert
        i18n="
           User missing requirements with pending Freelancer Verified
          application
        "
        [closeable]="false"
        [flMarginBottom]="Margin.LARGE"
        [type]="BannerAlertType.WARNING"
      >
        It looks like you are missing some requirements. Please complete any
        outstanding items while our team is getting started on your application.
      </fl-banner-alert>

      <app-freelancer-verified-landing-status-modal-requirements
        [requirementStatuses$]="requirementStatuses$"
      ></app-freelancer-verified-landing-status-modal-requirements>
    </ng-container>
  `,
})
export class FreelancerVerifiedLandingStatusModalPendingComponent
  implements OnInit {
  BannerAlertType = BannerAlertType;
  HeadingType = HeadingType;
  Margin = Margin;
  TextSize = TextSize;

  @Input() requirementStatuses$: Rx.Observable<UserStatus>;

  missingRequirements$: Rx.Observable<boolean>;

  ngOnInit(): void {
    this.missingRequirements$ = this.requirementStatuses$.pipe(
      map(
        requirementStatuses =>
          !(
            requirementStatuses.emailVerified &&
            requirementStatuses.phoneVerified &&
            requirementStatuses.paymentVerified &&
            requirementStatuses.identityVerified
          ),
      ),
    );
  }
}
