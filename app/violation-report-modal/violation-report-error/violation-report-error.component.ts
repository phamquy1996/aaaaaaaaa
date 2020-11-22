import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BackendPushErrorResponse } from '@freelancer/datastore';
import { ViolationReportsCollection } from '@freelancer/datastore/collections';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ErrorCodeApi } from 'api-typings/errors/errors';

@Component({
  selector: 'app-violation-report-error',
  template: `
    <fl-banner-alert
      bannerTitle="Report Failed"
      i18n-bannerTitle="Violation report error title"
      [type]="BannerAlertType.ERROR"
      [closeable]="false"
      [ngSwitch]="response?.errorCode"
    >
      <ng-container
        *ngSwitchCase="ErrorCodeApi.NOT_FOUND"
        i18n="Error text for when user reports an object that no longer exists"
      >
        The object you're trying to report does not exist. Please refresh the
        page.
      </ng-container>
      <ng-container *ngSwitchDefault i18n="generic error text">
        We encountered a problem while submitting the report. Please try again.
      </ng-container>
    </fl-banner-alert>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViolationReportErrorComponent {
  BannerAlertType = BannerAlertType;
  ErrorCodeApi = ErrorCodeApi;

  @Input() response: BackendPushErrorResponse<ViolationReportsCollection>;
}
