import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatastoreDocument } from '@freelancer/datastore';
import {
  Milestone,
  MilestonesCollection,
} from '@freelancer/datastore/collections';
import { Feature } from '@freelancer/feature-flags';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { InputSize } from '@freelancer/ui/input';
import { Margin } from '@freelancer/ui/margin';
import { FontType, FontWeight, TextSize } from '@freelancer/ui/text';
import { required } from '@freelancer/ui/validators';
import { MilestoneCancelRequestReasonApi } from 'api-typings/projects/projects';
import * as Rx from 'rxjs';

@Component({
  template: `
    <ng-container flTrackingSection="MilestoneCancelModal">
      <ng-container *flModalTitle i18n="Cancel milestone modal header">
        Milestone Cancellation Request
      </ng-container>
      <fl-heading
        i18n="Cancel milestone modal header"
        [size]="TextSize.MID"
        [headingType]="HeadingType.H4"
        [flHideMobile]="true"
        [flMarginBottom]="Margin.MID"
      >
        Milestone Cancellation Request
      </fl-heading>
      <fl-sticky-footer-wrapper>
        <fl-sticky-footer-body>
          <fl-bit class="MainBody" [flMarginBottom]="Margin.MID">
            <fl-text
              i18n="Cancel milestone modal body"
              [fontType]="FontType.SPAN"
            >
              In order to cancel a milestone, you need to send a cancellation
              request to your freelancer.
            </fl-text>
            <fl-text
              *flFeature="Feature.BILLING; else noFundsText"
              i18n="Cancel milestone modal body"
              [fontType]="FontType.SPAN"
            >
              Once they accept the request, the milestone will be cancelled and
              the funds will be returned to you.
            </fl-text>
            <ng-template #noFundsText>
              <fl-text
                i18n="Cancel milestone modal body"
                [fontType]="FontType.SPAN"
              >
                Once they accept the request, the milestone will be cancelled.
              </fl-text>
            </ng-template>
            <fl-text
              *flFeature="Feature.DISPUTE"
              i18n="Cancel milestone modal body"
              [fontType]="FontType.SPAN"
            >
              If the request is denied, you can initiate a dispute
              <fl-link
                flTrackingLabel="DisputeLink"
                [link]="'/dispute/disputeslist.php'"
                >here</fl-link
              >.
            </fl-text>
          </fl-bit>

          <fl-bit class="MilestoneInfo" [flMarginBottom]="Margin.SMALL">
            <fl-bit class="MilestoneInfoText">
              <fl-text
                [weight]="FontWeight.BOLD"
                i18n="Cancel milestone modal project name text"
              >
                Project Name
              </fl-text>
              <fl-text> {{ projectTitle }} </fl-text>
            </fl-bit>
            <fl-bit class="MilestoneInfoText">
              <fl-text
                [weight]="FontWeight.BOLD"
                i18n="Cancel milestone modal freelancer name text"
              >
                Freelancer Name
              </fl-text>
              <fl-text> {{ bidderName }} </fl-text>
            </fl-bit>
            <fl-bit class="MilestoneInfoText">
              <fl-text
                [weight]="FontWeight.BOLD"
                i18n="Cancel milestone modal description text"
              >
                Milestone Description
              </fl-text>
              <fl-text> {{ milestone.description }} </fl-text>
            </fl-bit>
            <fl-bit class="MilestoneInfoText">
              <fl-text
                [weight]="FontWeight.BOLD"
                i18n="Cancel milestone modal amount text"
              >
                Milestone Amount
              </fl-text>
              <fl-text>
                {{ milestone?.amount | flCurrency: milestone?.currency?.code }}
              </fl-text>
            </fl-bit>
            <fl-bit class="MilestoneInfoText">
              <fl-text
                [weight]="FontWeight.BOLD"
                i18n="Cancel milestone modal date text"
              >
                Date Created
              </fl-text>
              <fl-text> {{ milestone.timeCreated | date }} </fl-text>
            </fl-bit>
          </fl-bit>

          <fl-bit [flMarginBottom]="Margin.SMALL">
            <fl-heading
              [flMarginBottom]="Margin.XSMALL"
              [size]="TextSize.SMALL"
              [headingType]="HeadingType.H5"
              i18n="Cancel milestone modal reason heading"
            >
              Why do you want to cancel this milestone?
            </fl-heading>
            <fl-select
              flTrackingLabel="ReasonSelect"
              i18n-placeholder="Milestone cancel modal reason placeholder"
              placeholder="Please select a reason"
              [control]="selector"
              [options]="reasons"
            >
            </fl-select>
          </fl-bit>

          <fl-bit
            *ngIf="(selectedOption$ | async) === 'other'"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-heading
              [flMarginBottom]="Margin.XSMALL"
              [size]="TextSize.SMALL"
              [headingType]="HeadingType.H5"
              i18n="Cancel milestone modal other reason heading"
            >
              Why do you want to cancel it? (Shown to your Freelancer)
            </fl-heading>
            <fl-input
              flTrackingLabel="OtherReasonInput"
              [control]="otherTextControl"
              [placeholder]="
                'Please let your Freelancer know why you would like to cancel this milestone'
              "
              [size]="InputSize.LARGE"
            ></fl-input>
          </fl-bit>

          <fl-bit class="ButtonZone" [flHideMobile]="true">
            <fl-button
              flTrackingLabel="RequestCancellationButton"
              [color]="ButtonColor.SECONDARY"
              (click)="cancel()"
              i18n="Cancel milestone modal request button"
            >
              Request Cancellation
            </fl-button>
          </fl-bit>
        </fl-sticky-footer-body>
        <fl-sticky-footer [flShowMobile]="true">
          <fl-button
            flTrackingLabel="RequestCancellationButton"
            i18n="Cancel milestone modal request button"
            [color]="ButtonColor.SECONDARY"
            [display]="'block'"
            (click)="cancel()"
          >
            Request Cancellation
          </fl-button>
        </fl-sticky-footer>
      </fl-sticky-footer-wrapper>
    </ng-container>
  `,
  styleUrls: ['./milestone-cancel-modal.component.scss'],
})
export class MilestoneCancelModalComponent implements OnInit {
  ButtonColor = ButtonColor;
  TextSize = TextSize;
  HeadingType = HeadingType;
  InputSize = InputSize;
  Margin = Margin;
  FontWeight = FontWeight;
  Feature = Feature;
  FontType = FontType;

  @Input() bidderName: string;
  @Input() milestone: Milestone;
  @Input() projectTitle: string;
  @Input() milestoneDoc: DatastoreDocument<MilestonesCollection>;

  reasons: ReadonlyArray<{
    displayText: string;
    value: MilestoneCancelRequestReasonApi;
  }> = [
    {
      displayText: "The Freelancer didn't meet the deadline",
      value: MilestoneCancelRequestReasonApi.FREELANCER_DID_NOT_MEET_DEADLINE,
    },
    {
      displayText: 'The milestone was created accidentally',
      value: MilestoneCancelRequestReasonApi.ACCIDENTALLY_CREATED,
    },
    {
      displayText: "The Freelancer couldn't complete the task",
      value: MilestoneCancelRequestReasonApi.FREELANCER_DID_NOT_COMPLETE_TASK,
    },
    {
      displayText: 'The milestone is no longer needed',
      value: MilestoneCancelRequestReasonApi.NO_LONGER_NEEDED,
    },
    {
      displayText: 'Other',
      value: MilestoneCancelRequestReasonApi.OTHER,
    },
  ];
  selector = new FormControl(this.reasons[0].value, [
    required($localize`Please select a reason`),
  ]);
  otherTextControl = new FormControl('', [
    required($localize`Please provide feedback`),
  ]);
  selectedOption$: Rx.Observable<string>; // tracks the selected dropdown option
  bidder: string;

  constructor(
    private modalRef: ModalRef<MilestoneCancelModalComponent>,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.selectedOption$ = this.selector.valueChanges;
  }

  cancel() {
    this.milestoneDoc
      .update({
        ...this.milestone,
        action: 'request_cancel',
        actionReason: this.selector.value,
        actionReasonText:
          this.selector.value === 'other' ? this.otherTextControl.value : '',
        cancellationRequested: true,
      })
      .then(() => {
        this.changeDetectorRef.markForCheck();
      });
    this.modalRef.close(false);
  }
}
