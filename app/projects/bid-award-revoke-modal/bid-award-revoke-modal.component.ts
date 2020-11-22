import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  BidAwardRevokeReasonService,
  BidAwardRevokeReasonsPushResultAjax,
} from '@freelancer/bid-award-revoke-reason-service';
import {
  Datastore,
  DatastoreDocument,
  ErrorResponseData,
  SuccessResponseData,
} from '@freelancer/datastore';
import {
  Bid,
  BidAwardRevokeReasonsCollection,
  BidsCollection,
} from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';
import { maxLength, required } from '@freelancer/ui/validators';
import { isFormControl } from '@freelancer/utils';
import { BidAwardStatusApi } from 'api-typings/projects/projects';
import * as Rx from 'rxjs';
import { map, take, withLatestFrom } from 'rxjs/operators';

enum RevokeModalError {
  REVOKE_FAILED,
  REVOKE_REASON_FAILED,
}

@Component({
  selector: `app-bid-award-revoke-modal`,
  template: `
    <ng-container flTrackingSection="AwardRevokeModal">
      <fl-spinner
        *ngIf="!(revokeReasonOptions$ | async)"
        flTrackingLabel="BidAwardRevokeModalInitialisationSpinner"
        [overlay]="true"
      ></fl-spinner>
      <fl-heading
        i18n="Revoke awarded bid."
        [size]="TextSize.MID"
        [headingType]="HeadingType.H4"
        [flMarginBottom]="Margin.SMALL"
      >
        Please let us know why you are revoking award
      </fl-heading>

      <ng-container *ngIf="formGroup.get('reason') as control">
        <ng-container *ngIf="isFormControl(control)">
          <fl-bit [flMarginBottom]="Margin.MID">
            <fl-radio
              flTrackingLabel="ReasonRadio"
              [control]="control"
              [options]="revokeReasonOptions$ | async"
            ></fl-radio>
          </fl-bit>

          <fl-bit
            *ngIf="control.value === OTHER_REASON"
            [flMarginBottom]="Margin.MID"
          >
            <fl-label
              [for]="'otherRevokeReasons'"
              i18n="other reasons for revoking bid"
            >
              Why are you revoking this award?
            </fl-label>

            <ng-container *ngIf="formGroup.get('otherReason') as otherControl">
              <fl-input
                *ngIf="isFormControl(otherControl)"
                flTrackingLabel="OtherRevokeReasonInput"
                [id]="'otherRevokeReasons'"
                [control]="otherControl"
              ></fl-input>
            </ng-container>
          </fl-bit>
        </ng-container>
      </ng-container>

      <ng-container *ngIf="submissionPromise | async as error">
        <fl-banner-alert
          *ngIf="error.status !== 'success'"
          [type]="BannerAlertType.ERROR"
          [closeable]="false"
        >
          <ng-container [ngSwitch]="error.errorType">
            <ng-container
              *ngSwitchCase="RevokeModalError.REVOKE_FAILED"
              i18n="revoke request failed"
            >
              An unknown error occurred while trying to revoke the award.
            </ng-container>
            <ng-container
              *ngSwitchCase="RevokeModalError.REVOKE_REASON_FAILED"
              i18n="revoke reason request failed"
            >
              The award is revoked, but an unknown error occurred while trying
              to submit the revoke reason.
            </ng-container>
            <ng-container *ngSwitchDefault i18n="Generic error">
              Something went wrong.
            </ng-container>
          </ng-container>
          <ng-container *ngIf="error?.requestId" i18n="contact support">
            Please contact support@freelancer.com with this request ID:
            {{ error.requestId }}
          </ng-container>
        </fl-banner-alert>
      </ng-container>
      <fl-bit class="ButtonsContainer">
        <fl-button
          i18n="Button to cancel revoke bid"
          flTrackingLabel="BackButton"
          [color]="ButtonColor.DEFAULT"
          [flMarginRight]="Margin.XXSMALL"
          [size]="ButtonSize.SMALL"
          [disabled]="submissionPromise && !(submissionPromise | async)"
          (click)="handleGoBack()"
        >
          Go Back
        </fl-button>

        <fl-button
          i18n="Button to submit bid reovke"
          flTrackingLabel="RevokeAwardButton"
          [color]="ButtonColor.SECONDARY"
          [size]="ButtonSize.SMALL"
          [busy]="submissionPromise && !(submissionPromise | async)"
          [disabled]="!formGroup.valid"
          [submit]="true"
          (click)="handleRevokeAward()"
        >
          Revoke Award
        </fl-button>
      </fl-bit>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./bid-award-revoke-modal.component.scss'],
})
export class BidAwardRevokeModalComponent implements OnInit, OnDestroy {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  HeadingType = HeadingType;
  isFormControl = isFormControl;
  TextSize = TextSize;
  Margin = Margin;
  BannerAlertType = BannerAlertType;
  RevokeModalError = RevokeModalError;

  readonly OTHER_REASON = 'Other';
  readonly MAX_OTHER_REASON_LEN = 100;

  @Input() bidId: number;

  formGroup: FormGroup;

  submissionPromise: Promise<
    | SuccessResponseData<BidAwardRevokeReasonsPushResultAjax>
    | (ErrorResponseData<string> & { errorType: RevokeModalError })
  >;

  revokeReasonOptions$: Rx.Observable<ReadonlyArray<string>>;
  revokeReasonMap$: Rx.Observable<Record<string, number>>;

  bidDocument: DatastoreDocument<BidsCollection>;

  private _isRevoked = false;
  private _reasonChangeSub?: Rx.Subscription;

  constructor(
    private datastore: Datastore,
    private modalRef: ModalRef<BidAwardRevokeModalComponent>,
    private fb: FormBuilder,
    private revokeReasonService: BidAwardRevokeReasonService,
  ) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      reason: ['', [required($localize`Please choose a revoke reason`)]],
      otherReason: [
        {
          value: '',
          disabled: true,
        },
        [
          required($localize`Please enter revoke reason`),
          maxLength(100, $localize`Please enter at most 100 characters`),
        ],
      ],
    });

    const revokeReaons$ = this.datastore
      .collection<BidAwardRevokeReasonsCollection>('bidAwardRevokeReasons')
      .valueChanges();

    this.revokeReasonMap$ = revokeReaons$.pipe(
      map(reasons =>
        reasons.reduce((acc: Record<string, number>, reason) => {
          acc[reason.reason] = reason.id;
          return acc;
        }, {}),
      ),
    );

    this.revokeReasonOptions$ = revokeReaons$.pipe(
      map(reasons => reasons.map(reason => reason.reason)),
    );

    this.bidDocument = this.datastore.document<BidsCollection>(
      'bids',
      this.bidId,
    );

    this._reasonChangeSub = this.formGroup.controls.reason.valueChanges.subscribe(
      (reasonRadioValue: string) => {
        if (reasonRadioValue === this.OTHER_REASON) {
          this.formGroup.controls.otherReason.enable();
        } else {
          this.formGroup.controls.otherReason.disable();
        }
      },
    );
  }

  ngOnDestroy() {
    if (this._reasonChangeSub) {
      this._reasonChangeSub.unsubscribe();
    }
  }

  handleGoBack() {
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
          if (bidRevokeReasonResponse.status === 'error') {
            return {
              errorType: RevokeModalError.REVOKE_REASON_FAILED,
              ...bidRevokeReasonResponse,
            };
          }

          this.modalRef.close();

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
              errorType: RevokeModalError.REVOKE_FAILED,
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
          if (bidRevokeReasonResponse.status === 'error') {
            return {
              errorType: RevokeModalError.REVOKE_REASON_FAILED,
              ...bidRevokeReasonResponse,
            };
          }

          this.modalRef.close();

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
