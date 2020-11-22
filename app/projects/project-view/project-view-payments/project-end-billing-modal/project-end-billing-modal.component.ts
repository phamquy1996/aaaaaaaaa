import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  BackendSuccessResponse,
  BackendUpdateErrorResponse,
  DatastoreCollection,
} from '@freelancer/datastore';
import {
  HourlyContract,
  HourlyContractsCollection,
} from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { FontType, FontWeight, TextSize } from '@freelancer/ui/text';
import { ErrorCodeApi } from 'api-typings/errors/errors';

@Component({
  template: `
    <fl-bit flTrackingSection="ProjectEndBillingModal">
      <fl-heading
        *ngIf="!isTokenProject; else endAutoApprovalHeading"
        i18n="End billing modal heading"
        [size]="TextSize.MID"
        [headingType]="HeadingType.H4"
        [flMarginBottom]="Margin.SMALL"
      >
        Are you sure you want to end Automatic Billing?
      </fl-heading>
      <ng-template #endAutoApprovalHeading>
        <fl-heading
          i18n="End Automatic Approval modal heading"
          [size]="TextSize.MID"
          [headingType]="HeadingType.H4"
          [flMarginBottom]="Margin.SMALL"
        >
          End Automatic Approval?
        </fl-heading>
      </ng-template>
      <fl-text
        *ngIf="!isTokenProject; else submitForApprovalText"
        i18n="End billing modal information text"
        [size]="TextSize.XSMALL"
        [fontType]="FontType.PARAGRAPH"
        [flMarginBottom]="Margin.SMALL"
      >
        <fl-text [fontType]="FontType.SPAN" [weight]="FontWeight.BOLD">
          {{ freelancerDisplayName }}
        </fl-text>
        will not be able to track any more hours. You will also be immediately
        charged for any unpaid time tracked by
        <fl-text [fontType]="FontType.SPAN" [weight]="FontWeight.BOLD">
          {{ freelancerDisplayName }}.
        </fl-text>
      </fl-text>
      <ng-template #submitForApprovalText>
        <fl-text
          i18n="End auto approval modal information text"
          [size]="TextSize.XSMALL"
          [fontType]="FontType.PARAGRAPH"
          [flMarginBottom]="Margin.SMALL"
        >
          {{ freelancerDisplayName }} will not be able to track any more hours.
          Any remaining hours will be submitted for your approval right away.
        </fl-text>
      </ng-template>

      <fl-banner-alert
        *ngIf="(endBillingPromise | async)?.status === 'error'"
        [type]="BannerAlertType.ERROR"
        [flMarginBottom]="Margin.SMALL"
        [ngSwitch]="(endBillingPromise | async)?.errorCode"
      >
        <ng-container
          *ngSwitchCase="ErrorCodeApi.AUTOBILLING_ALREADY_DISABLED"
          i18n="Error message for auto billing is already disabled"
        >
          Auto billing is already disabled. Please refresh the page.
        </ng-container>

        <ng-container *ngSwitchDefault i18n="End billing error">
          Something went wrong when ending the billing. Please contact
          support@freelancer.com
          <ng-container *ngIf="(endBillingPromise | async)?.requestId">
            with requestId: {{ (endBillingPromise | async)?.requestId }}
          </ng-container>
        </ng-container>
      </fl-banner-alert>

      <fl-bit class="Buttons">
        <fl-button
          flTrackingLabel="EndBillingModalEndButton"
          [busy]="endBillingPromise && (endBillingPromise | async) === null"
          [color]="ButtonColor.SECONDARY"
          [flMarginRight]="Margin.XSMALL"
          [size]="ButtonSize.SMALL"
          (click)="endBilling()"
        >
          <ng-container
            *ngIf="!isTokenProject; else endAutoApprovalButton"
            i18n="End billing save button"
          >
            Save
          </ng-container>
          <ng-template #endAutoApprovalButton>
            <ng-container i18n="End auto approval button">
              End Automatic Approval
            </ng-container>
          </ng-template>
        </fl-button>

        <fl-button
          flTrackingLabel="EndBillingModalCancelButton"
          i18n="Close modal button"
          [color]="ButtonColor.DEFAULT"
          [size]="ButtonSize.SMALL"
          (click)="close()"
        >
          Cancel
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./project-end-billing-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectEndBillingModalComponent {
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  ErrorCodeApi = ErrorCodeApi;
  TextSize = TextSize;
  FontType = FontType;
  FontWeight = FontWeight;
  HeadingType = HeadingType;
  Margin = Margin;

  @Input() freelancerDisplayName: string;
  @Input() hourlyContractsCollection: DatastoreCollection<
    HourlyContractsCollection
  >;
  @Input() hourlyContract: HourlyContract;
  @Input() isTokenProject: boolean;

  endBillingPromise: Promise<
    BackendUpdateErrorResponse<HourlyContractsCollection> | undefined
  >;

  constructor(private modalRef: ModalRef<ProjectEndBillingModalComponent>) {}

  endBilling() {
    if (this.hourlyContract && this.hourlyContractsCollection) {
      this.endBillingPromise = this.hourlyContractsCollection
        .update(this.hourlyContract.id, {
          // this modal should only be used to turn off auto billing.
          timeTrackingStopped: undefined,
        })
        .then(res => {
          if (res.status === 'success') {
            this.close(res);
            return undefined;
          }

          return res;
        });
    }
  }

  close(res?: BackendSuccessResponse) {
    this.modalRef.close(res);
  }
}
