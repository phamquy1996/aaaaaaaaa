import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BackendPushErrorResponse } from '@freelancer/datastore';
import { RecommendedMembershipCollection } from '@freelancer/datastore/collections';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { MembershipsExceptionCodesApi } from 'api-typings/memberships/memberships_types';

@Component({
  selector: 'app-skills-limit-reached-modal-errors',
  template: `
    <fl-banner-alert
      class="LimitReachedModal-footer-confirmationBanner"
      bannerTitle="Error"
      i18n-bannerTitle="Skills Limit Reached Modal Error Banner Alert Title"
      [closeable]="true"
      [type]="BannerAlertType.ERROR"
      (close)="close.emit()"
    >
      <ng-container [ngSwitch]="error.errorCode">
        <fl-text
          *ngSwitchCase="MembershipsExceptionCodesApi.PAYMENT_FAILURE"
          i18n="Skills Limit Reached Payment Failure Error"
        >
          Payment failure has occurred. Please try again or contact support with
          the following request ID: {{ error.requestId }}
        </fl-text>
        <fl-text *ngSwitchDefault i18n="Default Skills Limit Reached Error">
          An error has occurred while trying to subscribe. Please try again or
          contact support with the following request ID: {{ error.requestId }}
        </fl-text>
      </ng-container>
    </fl-banner-alert>
  `,
})
export class SkillsLimitReachedModalErrorsComponent {
  BannerAlertType = BannerAlertType;
  MembershipsExceptionCodesApi = MembershipsExceptionCodesApi;

  @Input() error: BackendPushErrorResponse<RecommendedMembershipCollection>;

  @Output() close = new EventEmitter();
}
