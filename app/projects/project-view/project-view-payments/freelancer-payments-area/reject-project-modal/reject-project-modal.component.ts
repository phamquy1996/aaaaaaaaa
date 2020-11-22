import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  BackendUpdateResponse,
  DatastoreDocument,
} from '@freelancer/datastore';
import {
  BidsCollection,
  ProjectViewProject,
} from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { SelectItem } from '@freelancer/ui/select';
import { FontColor, TextSize } from '@freelancer/ui/text';
import {
  dirtyAndValidate,
  maxLength,
  pattern,
  required,
} from '@freelancer/ui/validators';
import { isFormControl } from '@freelancer/utils';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import {
  BidAwardStatusApi,
  BidDenyReasonApi,
} from 'api-typings/projects/projects';
import * as Rx from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  template: `
    <fl-bit flTrackingSection="RejectProjectModal">
      <fl-heading
        i18n="Reject project modal title"
        [headingType]="HeadingType.H1"
        [size]="TextSize.MID"
        [flMarginBottom]="Margin.SMALL"
      >
        Reject Project
      </fl-heading>
      <fl-text i18n="Reject project text" [flMarginBottom]="Margin.SMALL">
        Please let us know why you want to reject this project. If you are still
        interested in working on this project but require a different budget,
        you can make a counteroffer.
      </fl-text>
      <ng-container *ngIf="formGroup.get('reason') as control">
        <fl-select
          *ngIf="isFormControl(control)"
          i18n-placeholder="Select reason placeholder"
          placeholder="Select a reason"
          flTrackingLabel="RejectProjectReasonSelect"
          [options]="rejectReasonsList"
          [control]="control"
          [flMarginBottom]="Margin.MID"
        ></fl-select>
        <fl-bit
          *ngIf="control.value === BidDenyReasonApi.OTHER"
          [flMarginBottom]="Margin.MID"
        >
          <ng-container *ngIf="formGroup.get('otherFeedback') as otherControl">
            <fl-textarea
              *ngIf="isFormControl(otherControl)"
              flTrackingLabel="OtherFeedbackInput"
              placeholder="Why do you want to close the project?"
              i18n-placeholder="Close project reason placeholder"
              [rows]="5"
              [control]="otherControl"
            ></fl-textarea>
          </ng-container>
        </fl-bit>
      </ng-container>
      <ng-container *ngIf="rejectAwardPromise | async as response">
        <fl-text
          *ngIf="response.status !== 'success'"
          [color]="FontColor.ERROR"
          [flMarginBottom]="Margin.MID"
          [ngSwitch]="response.errorCode"
        >
          <ng-container
            *ngSwitchCase="ErrorCodeApi.BID_NOT_FOUND"
            i18n="Reject award bid not found error text"
          >
            Failed to reject award. Please try again or contact support with
            request ID: {{ response.requestId }}
          </ng-container>
          <ng-container
            *ngSwitchCase="ErrorCodeApi.FORBIDDEN"
            i18n="Reject award forbidden error text"
          >
            You do not have sufficient permissions to perform this request.
            Please contact support@freelancer.com with this request ID:
            {{ response.requestId }}
          </ng-container>
          <ng-container *ngSwitchDefault i18n="Reject award generic error text">
            Something went wrong. Please try again or contact support with
            request ID: {{ response.requestId }}
          </ng-container>
        </fl-text>
      </ng-container>
      <fl-bit class="RejectProjectActions">
        <fl-bit class="RejectProjectActions-link">
          <fl-link
            flTrackingLabel="CancelRejectLink"
            i18n="Cancel reject link"
            [disabled]="
              rejectAwardPromise && (rejectAwardPromise | async) === null
            "
            (click)="closeModal()"
          >
            Cancel
          </fl-link>
        </fl-bit>
        <fl-bit>
          <fl-button
            *ngIf="project.hireme"
            class="RejectProjectActions-button"
            flTrackingLabel="CounterOfferButton"
            i18n="Counteroffer button"
            [color]="ButtonColor.TRANSPARENT_DARK"
            [link]="detailsTabLink"
            [queryParams]="{ createCounterOffer: true }"
            [disabled]="
              rejectAwardPromise && (rejectAwardPromise | async) === null
            "
            [flMarginBottom]="Margin.SMALL"
            [flMarginBottomTablet]="Margin.NONE"
            [flMarginRight]="Margin.NONE"
            [flMarginRightTablet]="Margin.SMALL"
          >
            Counteroffer
          </fl-button>
          <fl-button
            class="RejectProjectActions-button"
            flTrackingLabel="RejectProjectButton"
            i18n="Reject project button"
            [color]="ButtonColor.SECONDARY"
            [busy]="rejectAwardPromise && (rejectAwardPromise | async) === null"
            [flMarginBottom]="Margin.SMALL"
            [flMarginBottomTablet]="Margin.NONE"
            (click)="rejectAward()"
          >
            Reject Project
          </fl-button>
        </fl-bit>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./reject-project-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RejectProjectModalComponent implements OnInit, OnDestroy {
  BidDenyReasonApi = BidDenyReasonApi;
  ButtonColor = ButtonColor;
  ErrorCodeApi = ErrorCodeApi;
  FontColor = FontColor;
  HeadingType = HeadingType;
  isFormControl = isFormControl;
  Margin = Margin;
  TextSize = TextSize;

  @Input() project: ProjectViewProject;
  @Input() bidDocument: DatastoreDocument<BidsCollection>;
  @Input() isFromNewsfeed = false;

  formGroup: FormGroup;
  rejectReasonsList: ReadonlyArray<SelectItem | string> = [
    '',
    {
      value: BidDenyReasonApi.EMPLOYER_SPAM,
      displayText: 'Project is spam or fraud',
    },
    {
      value: BidDenyReasonApi.EMPLOYER_UNCLEAR,
      displayText: 'The employer is unclear about what they want',
    },
    {
      value: BidDenyReasonApi.EMPLOYER_NOMILESTONE,
      displayText: 'The employer did not create a milestone',
    },
    {
      value: BidDenyReasonApi.BOTH_BUDGET,
      displayText: 'We do not agree on the budget',
    },
    {
      value: BidDenyReasonApi.FREELANCER_ENOUGHWORK,
      displayText: 'I already have enough work',
    },
    {
      value: BidDenyReasonApi.FREELANCER_NOSKILLS,
      displayText: 'I do not have the skills to do the project',
    },
    {
      value: BidDenyReasonApi.FREELANCER_NOTIME,
      displayText: 'I do not have time to take on the project',
    },
    {
      value: BidDenyReasonApi.OTHER,
      displayText: 'Other',
    },
  ];
  detailsTabLink: string;
  formSubscription?: Rx.Subscription;
  rejectAwardPromise: Promise<BackendUpdateResponse<BidsCollection>>;

  constructor(
    private fb: FormBuilder,
    private modalRef: ModalRef<RejectProjectModalComponent>,
    private router: Router,
  ) {}

  ngOnInit() {
    this.detailsTabLink = `/projects/${this.project.seoUrl}/details`;

    this.formGroup = this.fb.group({
      reason: ['', [required($localize`Please select a reason`)]],
      otherFeedback: '',
    });

    this.formSubscription = this.formGroup.controls.reason.valueChanges.subscribe(
      form => {
        const otherFeedbackControl = this.formGroup.controls.otherFeedback;
        otherFeedbackControl.setValidators([]);

        if (form === BidDenyReasonApi.OTHER) {
          otherFeedbackControl.setValidators([
            required('Please enter a reason'),
            pattern(/^(?!\s*$).+/, 'Please enter a reason'),
            maxLength(100, 'Please enter at most 100 characters'),
          ]);
        }
        otherFeedbackControl.updateValueAndValidity();
      },
    );
  }

  ngOnDestroy() {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  closeModal() {
    this.modalRef.close();
  }

  rejectAward() {
    if (this.formGroup.invalid) {
      dirtyAndValidate(this.formGroup);
      return;
    }

    const rejectReasonCode = this.formGroup.controls.reason.value;
    const otherFeedback =
      rejectReasonCode === BidDenyReasonApi.OTHER
        ? this.formGroup.controls.otherFeedback.value
        : '';

    this.rejectAwardPromise = this.bidDocument
      .valueChanges()
      .pipe(take(1))
      .toPromise()
      .then(_ =>
        this.bidDocument.update({
          awardStatus: BidAwardStatusApi.REJECTED,
          rejectReasonCode,
          otherFeedback,
        }),
      )
      .then(response => {
        if (response.status === 'success') {
          if (this.isFromNewsfeed) {
            this.modalRef.close(response);
            return response;
          }

          if (this.project.hireme) {
            this.router.navigate([this.detailsTabLink]);
          } else {
            this.router.navigate([this.detailsTabLink], {
              queryParams: {
                edit: true,
              },
            });
          }
        }

        return response;
      });
  }
}
