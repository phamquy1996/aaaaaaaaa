import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BackendPushResponse, Datastore } from '@freelancer/datastore';
import { ViolationReportsCollection } from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { HoverColor, IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';
import { required } from '@freelancer/ui/validators';
import { isFormControl } from '@freelancer/utils';
import { ViolationReportContextTypeApi } from 'api-typings/users/users';
import * as Rx from 'rxjs';
import {
  ReportStep,
  ViolationReportReasonText,
  VIOLATION_REASON_TEXT_MAPPING,
} from './violation-report-modal.types';

@Component({
  template: `
    <ng-container *ngIf="contextType === ViolationReportContextTypeApi.BID">
      <ng-container *flModalTitle i18n="Bid violation report header">
        Report bid
      </ng-container>
    </ng-container>
    <fl-bit flTrackingSection="ViolationReportModal">
      <ng-container *ngIf="currentReportStep$ | async as currentReportStep">
        <fl-sticky-footer-wrapper>
          <fl-sticky-footer-body>
            <fl-heading
              *ngIf="
                currentReportStep !== ReportStep.SUCCESS;
                else successHeader
              "
              class="ViolationReport-header"
              [size]="TextSize.MID"
              [headingType]="HeadingType.H1"
              [flMarginBottom]="Margin.SMALL"
            >
              <ng-container
                *ngIf="
                  contextType === ViolationReportContextTypeApi.BID;
                  else nonBidViolationReportHeader
                "
                i18n="Bid violation report header"
              >
                What is wrong with this bid?
              </ng-container>
              <ng-template #nonBidViolationReportHeader>
                <ng-container i18n="Non bid violation report header">
                  Help us understand what's happening
                </ng-container>
              </ng-template>
            </fl-heading>

            <ng-template #successHeader>
              <fl-bit
                class="SuccessHeaderContainer"
                [flMarginBottom]="Margin.SMALL"
              >
                <fl-icon
                  [name]="'ui-check-in-circle-v2'"
                  [size]="IconSize.MID"
                  [color]="IconColor.SUCCESS"
                  [flMarginRight]="Margin.XXSMALL"
                ></fl-icon>
                <fl-heading
                  class="ViolationReport-header"
                  [size]="TextSize.MID"
                  [headingType]="HeadingType.H1"
                >
                  <ng-container
                    *ngIf="
                      contextType === ViolationReportContextTypeApi.BID;
                      else nonBidViolationReportSuccessHeader
                    "
                    i18n="Bid violation report was sent confirmation text"
                  >
                    Thanks for the feedback
                  </ng-container>
                  <ng-template #nonBidViolationReportSuccessHeader>
                    <ng-container
                      i18n="Non bid violation report was sent confirmation text"
                    >
                      Thanks for letting us know about this
                    </ng-container>
                  </ng-template>
                </fl-heading>
              </fl-bit>
            </ng-template>

            <fl-bit
              *ngIf="responsePromise | async as response"
              [flMarginBottom]="Margin.SMALL"
            >
              <app-violation-report-error
                *ngIf="response.status === 'error'"
                [response]="response"
              ></app-violation-report-error>
            </fl-bit>

            <ng-container [ngSwitch]="currentReportStep">
              <ng-container *ngSwitchCase="ReportStep.REASON">
                <fl-heading
                  *ngIf="contextType !== ViolationReportContextTypeApi.BID"
                  i18n="Violation report reason header"
                  [size]="TextSize.SMALL"
                  [headingType]="HeadingType.H2"
                  [flMarginBottom]="Margin.XXSMALL"
                >
                  What's going on?
                </fl-heading>
                <ng-container
                  *ngIf="
                    formGroup.get(ReportStep[currentReportStep]) as control
                  "
                >
                  <fl-radio
                    *ngIf="isFormControl(control)"
                    flTrackingLabel="SelectReportReason"
                    [control]="control"
                    [options]="reasonOptions"
                  ></fl-radio>
                </ng-container>
              </ng-container>

              <ng-container *ngSwitchCase="ReportStep.DESCRIPTION">
                <fl-heading
                  *ngIf="contextType !== ViolationReportContextTypeApi.BID"
                  i18n="Violation report description header"
                  [size]="TextSize.SMALL"
                  [headingType]="HeadingType.H2"
                  [flMarginBottom]="Margin.XXSMALL"
                >
                  Please describe the issue
                </fl-heading>
                <ng-container
                  *ngIf="
                    formGroup.get(ReportStep[currentReportStep]) as control
                  "
                >
                  <fl-textarea
                    *ngIf="isFormControl(control)"
                    placeholder="Enter issue description"
                    i18n-placeholder="Enter description text"
                    flTrackingLabel="EnterIssueDescription"
                    [control]="control"
                    [rows]="6"
                    [flMarginBottom]="Margin.XSMALL"
                  >
                  </fl-textarea>
                </ng-container>
              </ng-container>

              <ng-container *ngSwitchCase="ReportStep.SUCCESS">
                <fl-heading
                  *ngIf="contextType !== ViolationReportContextTypeApi.BID"
                  i18n="Violation report successful header"
                  [size]="TextSize.SMALL"
                  [headingType]="HeadingType.H2"
                  [flMarginBottom]="Margin.XXSMALL"
                >
                  Good news!
                </fl-heading>
                <fl-text i18n="Reporting successful">
                  We have received your report and will investigate and take
                  action on it shortly.
                </fl-text>
              </ng-container>
            </ng-container>
          </fl-sticky-footer-body>
          <fl-sticky-footer>
            <ng-container
              *ngIf="
                formGroup.get(
                  ReportStep[currentReportStep]
                ) as currentFormControl;
                else doneButton
              "
            >
              <fl-bit class="ViolationReport-cta" [flHideMobile]="true">
                <fl-button
                  i18n="Cancel button"
                  flTrackingLabel="ClickCancelButton"
                  [color]="ButtonColor.DEFAULT"
                  [size]="ButtonSize.SMALL"
                  [flMarginRight]="Margin.SMALL"
                  (click)="handleCancelClick()"
                >
                  Cancel
                </fl-button>
                <fl-button
                  i18n="Continue button"
                  flTrackingLabel="ClickContinueButton"
                  [color]="ButtonColor.SECONDARY"
                  [size]="ButtonSize.SMALL"
                  [busy]="responsePromise && (responsePromise | async) === null"
                  [disabled]="!currentFormControl.valid"
                  (click)="handleContinueClick(currentReportStep)"
                >
                  Continue
                </fl-button>
              </fl-bit>
              <fl-bit class="ViolationReport-cta" [flShowMobile]="true">
                <fl-button
                  i18n="Cancel button"
                  flTrackingLabel="ClickCancelButton"
                  [color]="ButtonColor.DEFAULT"
                  [size]="ButtonSize.SMALL"
                  [flMarginRight]="Margin.SMALL"
                  [display]="'block'"
                  (click)="handleCancelClick()"
                >
                  Cancel
                </fl-button>
                <fl-button
                  i18n="Continue button"
                  flTrackingLabel="ClickContinueButton"
                  [color]="ButtonColor.SECONDARY"
                  [size]="ButtonSize.SMALL"
                  [busy]="responsePromise && (responsePromise | async) === null"
                  [disabled]="!currentFormControl.valid"
                  [display]="'block'"
                  (click)="handleContinueClick(currentReportStep)"
                >
                  Continue
                </fl-button>
              </fl-bit>
            </ng-container>

            <ng-template #doneButton>
              <fl-bit class="ViolationReport-cta" [flHideMobile]="true">
                <fl-button
                  *ngIf="currentReportStep === ReportStep.SUCCESS"
                  i18n="Done button"
                  flTrackingLabel="ClickDoneButton"
                  [color]="ButtonColor.SECONDARY"
                  [size]="ButtonSize.SMALL"
                  (click)="handleDoneClick()"
                >
                  Done
                </fl-button>
              </fl-bit>

              <fl-bit class="ViolationReport-cta" [flShowMobile]="true">
                <fl-button
                  *ngIf="currentReportStep === ReportStep.SUCCESS"
                  i18n="Done button"
                  flTrackingLabel="ClickDoneButton"
                  [color]="ButtonColor.SECONDARY"
                  [size]="ButtonSize.SMALL"
                  [display]="'block'"
                  (click)="handleDoneClick()"
                >
                  Done
                </fl-button>
              </fl-bit>
            </ng-template>
          </fl-sticky-footer>
        </fl-sticky-footer-wrapper>
      </ng-container>
    </fl-bit>
  `,
  styleUrls: ['./violation-report-modal.component.scss'],
})
export class ViolationReportModalComponent implements OnInit {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  HeadingType = HeadingType;
  HoverColor = HoverColor;
  IconColor = IconColor;
  IconSize = IconSize;
  isFormControl = isFormControl;
  Margin = Margin;
  ReportStep = ReportStep;
  TextSize = TextSize;
  ViolationReportContextTypeApi = ViolationReportContextTypeApi;

  @Input() contextType: ViolationReportContextTypeApi;
  @Input() contextId: number;
  @Input() violatorUserId: number;

  private currentReportStepSubject$ = new Rx.BehaviorSubject(ReportStep.REASON);
  currentReportStep$ = this.currentReportStepSubject$.asObservable();
  responsePromise: Promise<BackendPushResponse<ViolationReportsCollection>>;

  formGroup = new FormGroup({
    REASON: new FormControl(
      null,
      required($localize`You must choose a reason`),
    ),
    DESCRIPTION: new FormControl(
      null,
      required($localize`You must provide a description`),
    ),
  });

  reasonOptions: ReadonlyArray<ViolationReportReasonText>;

  constructor(
    private datastore: Datastore,
    private modalRef: ModalRef<ViolationReportModalComponent>,
    private router: Router,
  ) {}

  ngOnInit() {
    if (this.contextType === ViolationReportContextTypeApi.CONTEST_COMMENT) {
      this.reasonOptions = [
        ViolationReportReasonText.PUBLIC_DISPLAY_OF_COMMUNICATION_DETAILS,
        ViolationReportReasonText.INAPPROPRIATE_LANGUAGE,
        ViolationReportReasonText.OTHER,
      ];
    } else if (
      this.contextType === ViolationReportContextTypeApi.CONTEST_ENTRY
    ) {
      this.reasonOptions = [
        ViolationReportReasonText.COPIED_WORK_FROM_USER,
        ViolationReportReasonText.COPIED_WORK_FROM_SOMEONE_ELSE,
        ViolationReportReasonText.WORK_DOES_NOT_MATCH_REQUIREMENTS,
        ViolationReportReasonText.EXPLICIT_OR_INAPPROPRIATE_CONTENT,
        ViolationReportReasonText.LOW_QUALITY_WORK,
        ViolationReportReasonText.OTHER,
      ];
    } else if (this.contextType === ViolationReportContextTypeApi.BID) {
      this.reasonOptions = [
        ViolationReportReasonText.DOES_NOT_MATCH_PROJECT_DESCRIPTION,
        ViolationReportReasonText.DOES_NOT_PROVIDE_ENOUGH_INFORMATION,
        ViolationReportReasonText.CONTAINS_CONTACT_INFORMATION,
        ViolationReportReasonText.OTHER,
      ];
    } else if (this.contextType === ViolationReportContextTypeApi.PROJECT) {
      this.reasonOptions = [
        ViolationReportReasonText.CONTAINS_CONTACT_INFORMATION,
        ViolationReportReasonText.ADVERTISING_ANOTHER_WEBSITE,
        ViolationReportReasonText.FAKE_PROJECT_POSTED,
        ViolationReportReasonText.OBSCENITIES_OR_HARASSING_BEHAVIOUR,
        ViolationReportReasonText.NON_FULLTIME_PROJECT,
        ViolationReportReasonText.OTHER,
      ];
    } else {
      // FIXME: just show all right now but should be edited to support each product
      this.reasonOptions = [
        ViolationReportReasonText.PUBLIC_DISPLAY_OF_COMMUNICATION_DETAILS,
        ViolationReportReasonText.COPIED_WORK_FROM_USER,
        ViolationReportReasonText.COPIED_WORK_FROM_SOMEONE_ELSE,
        ViolationReportReasonText.WORK_DOES_NOT_MATCH_REQUIREMENTS,
        ViolationReportReasonText.EXPLICIT_OR_INAPPROPRIATE_CONTENT,
        ViolationReportReasonText.LOW_QUALITY_WORK,
        ViolationReportReasonText.OTHER,
      ];
    }
  }

  handleCancelClick() {
    this.closeModal();
  }

  handleDoneClick() {
    this.closeModal();
  }

  closeModal() {
    this.modalRef.close();
  }

  handleContinueClick(step: ReportStep) {
    if (step + 1 === ReportStep.SUCCESS) {
      this.submitReport();
    } else {
      this.goToStep(step + 1);
    }
  }

  goToStep(step: ReportStep) {
    this.currentReportStepSubject$.next(step);
  }

  submitReport() {
    const reasonControl: AbstractControl | null = this.formGroup.get(
      ReportStep[ReportStep.REASON],
    );
    if (!reasonControl) {
      throw new Error('No report reason selected');
    }

    const reasonText = reasonControl.value as ViolationReportReasonText;
    const { reason, additionalReason } = VIOLATION_REASON_TEXT_MAPPING[
      reasonText
    ];

    const commentControl = this.formGroup.get(
      ReportStep[ReportStep.DESCRIPTION],
    );
    const comments = commentControl ? (commentControl.value as string) : '';

    this.responsePromise = this.datastore
      .collection<ViolationReportsCollection>('violationReports')
      .push({
        contextId: this.contextId,
        contextType: this.contextType,
        reason,
        additionalReason,
        url: this.router.url,
        comments,
        violatorUserId: this.violatorUserId,
      });

    this.responsePromise.then(response =>
      response.status === 'success'
        ? this.goToStep(ReportStep.SUCCESS)
        : undefined,
    );
  }
}
