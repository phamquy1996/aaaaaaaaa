import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  BackendUpdateResponse,
  DatastoreDocument,
} from '@freelancer/datastore';
import {
  Bid,
  Milestone,
  MilestonesCollection,
  Project,
  ProjectViewUser,
} from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import {
  FontColor,
  FontType,
  FontWeight,
  TextAlign,
  TextSize,
} from '@freelancer/ui/text';
import { AvatarSize } from '@freelancer/ui/user-avatar';
import { requiredTruthy } from '@freelancer/ui/validators';
import { toNumber } from '@freelancer/utils';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import { ProjectTypeApi } from 'api-typings/projects/projects';
import * as Rx from 'rxjs';
import { map, startWith } from 'rxjs/operators';

type ReleaseMilestoneRedirectSchema =
  | {
      type: 'COMPLETE';
      bidderId: number;
    }
  | {
      type: 'RELEASE';
    };

@Component({
  template: `
    <ng-container *flModalTitle i18n="Confirm release of payment modal title">
      Confirm payment release
    </ng-container>
    <fl-bit flTrackingSection="MilestoneReleaseModal">
      <fl-sticky-footer-wrapper>
        <fl-sticky-footer-body>
          <fl-bit class="MilestoneReleaseModal">
            <fl-bit class="MilestoneReleaseModal-heading">
              <fl-heading
                i18n="Confirm release of payment modal title"
                [size]="TextSize.MID"
                [headingType]="HeadingType.H3"
                [flMarginBottom]="Margin.MID"
                [flHideMobile]="true"
              >
                Confirm release of payment for {{ bidder?.displayName }}
              </fl-heading>
            </fl-bit>
            <fl-bit
              *ngIf="bidder"
              class="MilestoneReleaseModal-avatar"
              [flMarginBottom]="Margin.MID"
            >
              <fl-user-avatar
                [users]="[bidder]"
                [size]="AvatarSize.LARGE"
              ></fl-user-avatar>
            </fl-bit>
            <fl-bit [flMarginBottom]="Margin.MID">
              <fl-text [color]="FontColor.MID">
                {{ milestone.description }}
              </fl-text>
              <fl-text [weight]="FontWeight.BOLD" [size]="TextSize.SMALL">
                {{ milestone.amount | flCurrency: project.currency.code }}
              </fl-text>
            </fl-bit>
            <fl-bit [flMarginBottom]="Margin.MID">
              <fl-text
                class="MilestoneReleaseModal-description"
                i18n="Release milestone warning text"
                [textAlign]="TextAlign.CENTER"
                [flMarginBottom]="Margin.SMALL"
              >
                Please ensure that you are satisfied with the work
                <fl-text [weight]="FontWeight.BOLD" [fontType]="FontType.SPAN">
                  {{ bidder?.displayName }}
                </fl-text>
                has submitted, as Milestone Payments cannot be returned once
                released.
              </fl-text>
              <fl-bit class="MilestoneReleaseModal-checkbox">
                <fl-checkbox
                  flTrackingLabel="MilestoneReleaseModalCheckbox"
                  label="My freelancer has delivered satisfactory work."
                  i18n-label="Release milestone checkbox text"
                  [control]="checkControl"
                ></fl-checkbox>
              </fl-bit>
            </fl-bit>
            <ng-container
              *ngIf="submissionPromise | async as submissionResponse"
            >
              <fl-bit
                *ngIf="submissionResponse.status === 'error'"
                [ngSwitch]="submissionResponse.errorCode"
                [flMarginBottom]="Margin.MID"
              >
                <fl-text
                  *ngSwitchCase="'PROFILE_INCOMPLETE'"
                  [color]="FontColor.ERROR"
                  [textAlign]="TextAlign.CENTER"
                  i18n="
                     Releasing milestone error that indicates incomplete profile

                  "
                >
                  You need to
                  <fl-link
                    flTrackingLabel="MilestoneReleaseModalCompleteProfileLink"
                    [link]="'/support/Profile/how-to-edit-your-profile'"
                    [newTab]="true"
                    >complete your profile</fl-link
                  >
                  before releasing milestones.
                </fl-text>
                <fl-text
                  *ngSwitchCase="'PROJECT_NOT_ACCEPTED'"
                  [color]="FontColor.ERROR"
                  [textAlign]="TextAlign.CENTER"
                  i18n="
                     Releasing milestone error that indicates project not
                    accepted
                  "
                >
                  Your freelancer must accept the project before a Milestone
                  Payment can be released. Please remind your freelancer to
                  accept the project through messaging.
                </fl-text>
                <fl-text
                  *ngSwitchCase="'MILESTONE_DISPUTE_PENDING'"
                  [color]="FontColor.ERROR"
                  [textAlign]="TextAlign.CENTER"
                  i18n="
                     Releasing milestone error that indicates milestone is under
                    dispute
                  "
                >
                  This milestone cannot be released as it is currently under
                  dispute.
                </fl-text>
                <fl-text
                  *ngSwitchCase="'NOT_FOUND'"
                  [color]="FontColor.ERROR"
                  [textAlign]="TextAlign.CENTER"
                  i18n="
                     Releasing milestone error that indicates milestone not
                    found
                  "
                >
                  There was an error while trying to retrieve this milestone.
                  Please try again or contact support@freelancer.com
                  <ng-container *ngIf="submissionResponse.requestId">
                    with request_id: {{ submissionResponse.requestId }}.
                  </ng-container>
                </fl-text>
                <fl-text
                  *ngSwitchCase="'EMAIL_VERIFICATION_REQUIRED'"
                  [color]="FontColor.ERROR"
                  [textAlign]="TextAlign.CENTER"
                  i18n="
                     Releasing milestone error that indicates unverified email
                  "
                >
                  You need to
                  <fl-link
                    flTrackingLabel="MilestoneReleaseModalVerifyEmailLink"
                    [fragment]="'TrustSettings'"
                    [link]="'/users/settings.php'"
                    [newTab]="true"
                    >verify your email address</fl-link
                  >
                  before releasing milestones.
                </fl-text>
                <fl-text
                  *ngSwitchCase="'PHONE_VERIFICATION_REQUIRED'"
                  [color]="FontColor.ERROR"
                  [textAlign]="TextAlign.CENTER"
                  i18n="
                     Releasing milestone error that indicates unverified phone
                  "
                >
                  You need to
                  <fl-link
                    flTrackingLabel="MilestoneReleaseModalVerifyPhoneLink"
                    [fragment]="'TrustSettings'"
                    [link]="'/users/settings.php'"
                    [newTab]="true"
                    >verify your phone number</fl-link
                  >
                  before releasing milestones.
                </fl-text>
                <fl-text
                  *ngSwitchCase="ErrorCodeApi.IDENTITY_VERIFICATION_REQUIRED"
                  [color]="FontColor.ERROR"
                  [textAlign]="TextAlign.CENTER"
                  i18n="
                     Releasing milestone error that indicates unverified
                    identity
                  "
                >
                  Identity verification required for account security reasons.
                  You can continue to work and receive payments, but you won't
                  be able to transfer or withdraw funds. To verify your
                  identity, visit the
                  <fl-link
                    flTrackingLabel="VerificationCenterLink"
                    [link]="'/users/kyc/verification-center'"
                    [newTab]="true"
                  >
                    Verification Center
                  </fl-link>
                  .
                </fl-text>
                <fl-text
                  *ngSwitchCase="ErrorCodeApi.USER_ACCOUNT_LIMITED"
                  i18n="Limited account error on milestone release"
                  [color]="FontColor.ERROR"
                  [textAlign]="TextAlign.CENTER"
                >
                  Your account has been limited for account security reasons.
                  You can continue to work and receive payments, but you won't
                  be able to transfer or withdraw funds. To verify your
                  identity, visit the
                  <fl-link
                    flTrackingLabel="VerificationCenterLink"
                    [link]="'/users/kyc/verification-center'"
                    [newTab]="true"
                  >
                    Verification Center
                  </fl-link>
                  .
                </fl-text>
                <fl-text
                  *ngSwitchCase="ErrorCodeApi.USER_ACCOUNT_FULL_RESTRICTION"
                  i18n="Full restriction error on milestone release"
                  [color]="FontColor.ERROR"
                  [textAlign]="TextAlign.CENTER"
                >
                  A restriction on your account has been assigned as a penalty.
                  You can continue your project but you won't be able to
                  transfer or release funds.
                </fl-text>
                <fl-text
                  *ngSwitchDefault
                  [color]="FontColor.ERROR"
                  [textAlign]="TextAlign.CENTER"
                  i18n="General error message for releasing milestones"
                >
                  An unknown error occurred while trying to release the
                  milestone. Please try again or contact support@freelancer.com
                  <ng-container *ngIf="submissionResponse.requestId">
                    with request_id: {{ submissionResponse.requestId }}.
                  </ng-container>
                </fl-text>
              </fl-bit>
            </ng-container>
            <fl-bit class="MilestoneReleaseModal-actions" [flHideMobile]="true">
              <ng-container
                *ngTemplateOutlet="milestoneReleaseModalButtons"
              ></ng-container>
            </fl-bit>
          </fl-bit>
        </fl-sticky-footer-body>
        <fl-sticky-footer
          class="MilestoneReleaseModal-actions"
          [flShowMobile]="true"
        >
          <ng-container
            *ngTemplateOutlet="milestoneReleaseModalButtons"
          ></ng-container>
        </fl-sticky-footer>
      </fl-sticky-footer-wrapper>

      <ng-template #milestoneReleaseModalButtons>
        <fl-button
          flTrackingLabel="MilestoneReleaseModalCancelButton"
          i18n="Close release milestone modal"
          [color]="ButtonColor.DEFAULT"
          [flMarginRight]="Margin.SMALL"
          [disabled]="submissionPromise && (submissionPromise | async) === null"
          [size]="ButtonSize.SMALL"
          [display]="'block'"
          (click)="closeModal()"
        >
          Cancel
        </fl-button>
        <fl-button
          flTrackingLabel="MilestoneReleaseModalReleaseButton"
          i18n="Release milestone button"
          [busy]="submissionPromise && (submissionPromise | async) === null"
          [color]="ButtonColor.SECONDARY"
          [size]="ButtonSize.SMALL"
          [disabled]="!(canRelease$ | async)"
          [display]="'block'"
          (click)="releasePayment()"
        >
          Release Payment
        </fl-button>
      </ng-template>
    </fl-bit>
  `,
  styleUrls: ['./milestone-release-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MilestoneReleaseModalComponent implements OnInit {
  HeadingType = HeadingType;
  TextSize = TextSize;
  FontColor = FontColor;
  FontType = FontType;
  Margin = Margin;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  TextAlign = TextAlign;
  ErrorCodeApi = ErrorCodeApi;
  AvatarSize = AvatarSize;
  FontWeight = FontWeight;

  @Input() bid: Bid;
  @Input() escrowComInteractionRequired: boolean;
  @Input() project: Project;
  @Input() milestoneDoc: DatastoreDocument<MilestonesCollection>;
  @Input() milestone: Milestone;
  @Input() totalPaidMilestonesAmount: number;
  @Input() totalUnpaidMilestonesAmount: number;
  @Input() bidder?: ProjectViewUser;

  checkControl = new FormControl(false, requiredTruthy(''));
  canRelease$: Rx.Observable<boolean>;

  errorCode: string | undefined;
  requestId: string | undefined;
  submissionPromise: Promise<BackendUpdateResponse<MilestonesCollection>>;

  constructor(private modalRef: ModalRef<MilestoneReleaseModalComponent>) {}

  ngOnInit() {
    this.canRelease$ = this.checkControl.statusChanges.pipe(
      startWith(this.checkControl.status),
      map(status => status === 'VALID'),
    );
  }

  releasePayment() {
    this.submissionPromise = this.milestoneDoc
      .update(this.milestone)
      .then(response => {
        if (response.status === 'success') {
          // Milestone total amount >= bid amount and if all milestones are either cleared or cancelled
          // then we redirect user to review tab (only for fixed price project)
          let newTotalUnpaidMilestonesAmount =
            this.totalUnpaidMilestonesAmount - (this.milestone.amount || 0);

          newTotalUnpaidMilestonesAmount = toNumber(
            newTotalUnpaidMilestonesAmount.toFixed(2),
          );

          const newTotalPaidMilestonesAmount =
            this.totalPaidMilestonesAmount + (this.milestone.amount || 0);
          if (
            this.project.type === ProjectTypeApi.FIXED &&
            !this.escrowComInteractionRequired &&
            newTotalUnpaidMilestonesAmount === 0 &&
            newTotalPaidMilestonesAmount >= this.bid.amount
          ) {
            this.closeModal({ type: 'COMPLETE', bidderId: this.bid.bidderId });
            return response;
          }
          this.closeModal({ type: 'RELEASE' });
          return response;
        }
        return response;
      });
  }

  // undefined for close without releasing
  // 'Complete' for release and project complete
  // 'Release' for just releasing without side effects
  closeModal(param?: ReleaseMilestoneRedirectSchema) {
    this.modalRef.close(param);
  }
}
