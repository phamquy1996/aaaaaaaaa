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
  BidAwardRevokeReasonService,
  BidAwardRevokeReasonsPushResultAjax,
} from '@freelancer/bid-award-revoke-reason-service';
import {
  BackendUpdateErrorResponse,
  Datastore,
  DatastoreDocument,
  ErrorResponseData,
  SuccessResponseData,
} from '@freelancer/datastore';
import {
  Bid,
  BidAwardRevokeReasonsCollection,
  BidsCollection,
  ProjectViewProject,
} from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { SelectItem } from '@freelancer/ui/select';
import { TextSize } from '@freelancer/ui/text';
import { maxLength, required } from '@freelancer/ui/validators';
import { isFormControl } from '@freelancer/utils';
import { BidAwardStatusApi } from 'api-typings/projects/projects';
import * as Rx from 'rxjs';
import { map, take, withLatestFrom } from 'rxjs/operators';

enum RevokeError {
  REVOKE_FAILED,
  REASON_SAVE_FAILED,
}

type RevokeModalResponseError = {
  errorType: RevokeError.REVOKE_FAILED;
} & BackendUpdateErrorResponse<BidsCollection>;

type RevokeReasonSaveFailed = {
  errorType: RevokeError.REASON_SAVE_FAILED;
} & ErrorResponseData<string>;

type RevokeResponse =
  | RevokeModalResponseError
  | RevokeReasonSaveFailed
  | SuccessResponseData<BidAwardRevokeReasonsPushResultAjax>;

@Component({
  template: `
    <fl-bit flTrackingSection="CloseProjectModal">
      <fl-heading
        i18n="Close project modal title"
        [headingType]="HeadingType.H1"
        [size]="TextSize.MID"
        [flMarginBottom]="Margin.SMALL"
      >
        Close Project
      </fl-heading>
      <fl-text i18n="Close project text" [flMarginBottom]="Margin.XSMALL">
        Are you sure you want to close this project? Please let us know why.
        Information will be kept private.
      </fl-text>
      <fl-text i18n="Close project text" [flMarginBottom]="Margin.SMALL">
        This action cannot be undone.
      </fl-text>
      <ng-container *ngIf="formGroup.get('reason') as control">
        <fl-select
          *ngIf="isFormControl(control)"
          i18n-placeholder="Select reason placeholder"
          placeholder="Select a reason"
          flTrackingLabel="CloseProjectReasonSelect"
          [options]="closeProjectReasons$ | async"
          [control]="formGroup.get('reason')"
          [flMarginBottom]="Margin.MID"
        ></fl-select>
        <fl-bit
          *ngIf="control.value === OTHER_REASON"
          [flMarginBottom]="Margin.MID"
        >
          <ng-container *ngIf="formGroup.get('otherReason') as otherControl">
            <fl-textarea
              *ngIf="isFormControl(otherControl)"
              flTrackingLabel="OtherReasonInput"
              placeholder="Why do you want to close the project?"
              i18n-placeholder="Close project reason placeholder"
              [rows]="5"
              [control]="otherControl"
            ></fl-textarea>
          </ng-container>
        </fl-bit>
      </ng-container>
      <fl-banner-alert
        *ngIf="submissionPromise | async as error"
        [type]="BannerAlertType.ERROR"
        [closeable]="false"
        [flMarginBottom]="Margin.MID"
      >
        <ng-container *ngIf="error.status === 'error'">
          <ng-container [ngSwitch]="error.errorType">
            <ng-container
              *ngSwitchCase="RevokeError.REVOKE_FAILED"
              i18n="revoke request failed"
            >
              An unknown error occurred while trying to close the project.
            </ng-container>
            <ng-container *ngSwitchDefault i18n="Generic error">
              Something went wrong.
            </ng-container>
          </ng-container>
        </ng-container>
        <ng-container *ngIf="error?.requestId" i18n="contact support">
          Please contact support@freelancer.com with this request ID:
          {{ error.requestId }}
        </ng-container>
      </fl-banner-alert>
      <fl-bit class="CloseProjectButtons" [flHideMobile]="true">
        <fl-button
          flTrackingLabel="CloseProjectButton"
          i18n="CloseProjectButton"
          [color]="ButtonColor.TRANSPARENT_DARK"
          [flMarginRight]="Margin.SMALL"
          [busy]="submissionPromise && (submissionPromise | async) === null"
          [disabled]="!formGroup.valid"
          (click)="handleRevokeAward()"
        >
          Close Project
        </fl-button>
        <fl-button
          flTrackingLabel="GoBackButton"
          i18n="GoBackButton"
          [color]="ButtonColor.SECONDARY"
          [disabled]="submissionPromise && (submissionPromise | async) === null"
          (click)="closeModal()"
        >
          Go Back
        </fl-button>
      </fl-bit>
      <fl-bit [flHideDesktop]="true" [flHideTablet]="true">
        <fl-button
          flTrackingLabel="CloseProjectButton"
          i18n="CloseProjectButton"
          [color]="ButtonColor.TRANSPARENT_DARK"
          [display]="'block'"
          [flMarginBottom]="Margin.SMALL"
          [busy]="submissionPromise && (submissionPromise | async) === null"
          [disabled]="!formGroup.valid"
          (click)="handleRevokeAward()"
        >
          Close Project
        </fl-button>
        <fl-button
          flTrackingLabel="GoBackButton"
          i18n="GoBackButton"
          [color]="ButtonColor.SECONDARY"
          [display]="'block'"
          [disabled]="submissionPromise && (submissionPromise | async) === null"
          (click)="closeModal()"
        >
          Go Back
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./close-project-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloseProjectModalComponent implements OnInit, OnDestroy {
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  HeadingType = HeadingType;
  isFormControl = isFormControl;
  Margin = Margin;
  RevokeError = RevokeError;
  TextSize = TextSize;

  closeProjectReasons$: Rx.Observable<ReadonlyArray<SelectItem | string>>;
  formGroup: FormGroup;
  submissionPromise: Promise<RevokeResponse>;
  bidDocument: DatastoreDocument<BidsCollection>;
  revokeReasonMap$: Rx.Observable<Record<string, number>>;

  readonly OTHER_REASON = 'Other';
  private _isRevoked = false;
  private formSubscription?: Rx.Subscription;

  @Input() bidId: number;
  @Input() project: ProjectViewProject;

  constructor(
    private datastore: Datastore,
    private fb: FormBuilder,
    private modalRef: ModalRef<CloseProjectModalComponent>,
    private revokeReasonService: BidAwardRevokeReasonService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      reason: ['', [required($localize`Please select a reason`)]],
      otherReason: '',
    });

    const revokeReasons$ = this.datastore
      .collection<BidAwardRevokeReasonsCollection>('bidAwardRevokeReasons')
      .valueChanges();

    this.closeProjectReasons$ = revokeReasons$.pipe(
      map(reasons => [
        '',
        ...reasons.map(reason => ({
          displayText: reason.reason,
          value: reason.reason,
        })),
      ]),
    );

    this.revokeReasonMap$ = revokeReasons$.pipe(
      map(reasons =>
        reasons.reduce((acc: Record<string, number>, reason) => {
          acc[reason.reason] = reason.id;
          return acc;
        }, {}),
      ),
    );

    this.bidDocument = this.datastore.document<BidsCollection>(
      'bids',
      this.bidId,
    );

    this.formSubscription = this.formGroup.controls.reason.valueChanges.subscribe(
      form => {
        const otherReasonControl = this.formGroup.controls.otherReason;
        otherReasonControl.setValidators([]);
        otherReasonControl.reset();

        if (form === this.OTHER_REASON) {
          otherReasonControl.setValidators([
            required('Please enter a reason'),
            maxLength(100, 'Please enter at most 100 characters'),
          ]);
        }
        otherReasonControl.updateValueAndValidity();
      },
    );
  }

  ngOnDestroy() {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  isRevokeModalResponseError(
    error:
      | SuccessResponseData<BidAwardRevokeReasonsPushResultAjax>
      | RevokeModalResponseError
      | ErrorResponseData<string>,
  ): error is RevokeModalResponseError {
    return error.status !== 'success' && 'errorType' in error;
  }

  closeModal() {
    this.modalRef.close();
  }

  /**
   *
   * Two separate API calls
   * 1. Revoke the bid award
   * 2. Save the revoke reason
   *
   * The first request is more important, so we only send the second request
   * if the first one is successful.
   *
   */
  handleRevokeAward() {
    // allow employer to only re-submit revoke reason if the request failed
    if (this._isRevoked) {
      this.submissionPromise = this.bidDocument
        .valueChanges()
        .pipe(take(1), withLatestFrom(this.revokeReasonMap$))
        .toPromise()
        .then(([bid, reasonMap]) =>
          this.createBidAwardRevokeReasonRecord(bid, this.formGroup, reasonMap),
        )
        .then(bidRevokeReasonResponse => {
          this.closeModal();
          if (bidRevokeReasonResponse.status === 'error') {
            return {
              errorType: RevokeError.REASON_SAVE_FAILED,
              ...bidRevokeReasonResponse,
            };
          }
          return bidRevokeReasonResponse;
        });
    } else {
      let reasonMap: Record<string, number>;
      let bid: Bid;

      this.submissionPromise = this.bidDocument
        .valueChanges()
        .pipe(take(1), withLatestFrom(this.revokeReasonMap$))
        .toPromise()
        .then(([bidTemp, reasonMapTemp]) => {
          reasonMap = reasonMapTemp;
          bid = bidTemp;

          return this.bidDocument.update({
            awardStatus: BidAwardStatusApi.REVOKED,
          });
        })
        .then(bidRevokeResponse => {
          if (bidRevokeResponse.status === 'error') {
            return {
              errorType: RevokeError.REVOKE_FAILED,
              ...bidRevokeResponse,
            };
          }

          this._isRevoked = true;

          return this.createBidAwardRevokeReasonRecord(
            bid,
            this.formGroup,
            reasonMap,
          );
        })
        .then(bidRevokeReasonResponse => {
          this.router.navigate([`/projects/${this.project.seoUrl}/details`]);

          if (bidRevokeReasonResponse.status === 'error') {
            return {
              errorType: RevokeError.REASON_SAVE_FAILED,
              ...bidRevokeReasonResponse,
            };
          }
          return bidRevokeReasonResponse;
        });
    }
  }

  createBidAwardRevokeReasonRecord(
    bid: Bid,
    formGroup: FormGroup,
    reasonMap: Record<string, number>,
  ) {
    const reasonId = reasonMap[formGroup.controls.reason.value];
    const otherFeedback =
      formGroup.controls.reason.value === this.OTHER_REASON
        ? formGroup.controls.otherReason.value
        : '';

    return this.revokeReasonService.saveBidAwardRevokeReason({
      projectId: bid.projectId,
      freelancerId: bid.bidderId,
      reasonId,
      otherFeedback,
    });
  }
}
