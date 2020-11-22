import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackendUpdateResponse } from '@freelancer/datastore';
import {
  Bid,
  BidsCollection,
  ProjectViewProject,
  ProjectViewUser,
} from '@freelancer/datastore/collections';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { IconSize } from '@freelancer/ui/icon';
import { InputSize, InputType } from '@freelancer/ui/input';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontType, TextSize } from '@freelancer/ui/text';
import { TooltipPosition } from '@freelancer/ui/tooltip';
import {
  maxValue,
  minValue,
  required,
  wholeNumber,
} from '@freelancer/ui/validators';
import { isFormControl } from '@freelancer/utils';
import { ProjectTypeApi } from 'api-typings/projects/projects';
import * as Rx from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HourlyAwardModalErrorType } from '../../hourly-award-modal-error/hourly-award-modal-error.component';

@Component({
  selector: 'app-hourly-award-as-hourly-form',
  template: `
    <app-hourly-award-form-layout [withSeparator]="true">
      <fl-bit HourlyAwardForm="body">
        <app-hourly-award-heading
          title="Set up your Hourly Project"
          i18n-title="Hourly award as hourly form title"
          subtitle="Review your billing details to award this project."
          i18n-subtitle="Hourly award as hourly form description"
        ></app-hourly-award-heading>

        <app-hourly-award-error
          [errorMessage]="submissionPromise | async"
        ></app-hourly-award-error>

        <fl-list [flMarginBottom]="Margin.LARGE">
          <fl-list-item>
            <fl-bit class="BidAwardForm-item">
              <fl-bit class="BidAwardForm-item-field">
                <fl-text
                  i18n="Hourly award weekly limit label"
                  [flMarginRight]="Margin.XXSMALL"
                  [fontType]="FontType.STRONG"
                >
                  Weekly Limit
                </fl-text>
                <fl-tooltip
                  i18n-message="Hourly award weekly limit explainer"
                  message="
                    This is the maximum number of hours your freelancer will be able to track each week.
                  "
                  [position]="TooltipPosition.BOTTOM_START"
                >
                  <fl-icon
                    [name]="'ui-info-v2'"
                    [size]="IconSize.SMALL"
                  ></fl-icon>
                </fl-tooltip>
              </fl-bit>

              <ng-container *ngIf="awardForm.controls.weeklyLimit as control">
                <fl-input
                  *ngIf="isFormControl(control)"
                  class="BidAwardForm-item-inputBox"
                  i18n-afterLabel="Weekly limit hours"
                  afterLabel="hours/week"
                  flTrackingLabel="PeriodInput"
                  [control]="control"
                  [type]="InputType.NUMBER"
                  [size]="InputSize.MID"
                ></fl-input>
              </ng-container>
            </fl-bit>
          </fl-list-item>

          <fl-list-item>
            <fl-bit class="BidAwardForm-item">
              <fl-bit class="BidAwardForm-item-field">
                <fl-text
                  i18n="Hourly award hourly rate label"
                  [flMarginRight]="Margin.XXSMALL"
                  [fontType]="FontType.STRONG"
                >
                  Hourly Rate
                </fl-text>
                <fl-tooltip
                  i18n-message="Hourly award hourly rate explainer"
                  message="
                    The amount you will be billed for every hour your freelancer tracks on your project.
                  "
                  [position]="TooltipPosition.BOTTOM_START"
                >
                  <fl-icon
                    [name]="'ui-info-v2'"
                    [size]="IconSize.SMALL"
                  ></fl-icon>
                </fl-tooltip>
              </fl-bit>

              <fl-text>
                {{ bid.amount | flCurrency: project.currency.code }}
              </fl-text>
            </fl-bit>
          </fl-list-item>

          <fl-list-item>
            <fl-bit class="BidAwardForm-item">
              <fl-bit class="BidAwardForm-item-field">
                <fl-text
                  i18n="Hourly award maximum weekly bill amount label"
                  [flMarginRight]="Margin.XXSMALL"
                  [fontType]="FontType.STRONG"
                >
                  Maximum Weekly Bill
                </fl-text>
                <fl-tooltip
                  i18n-message="Hourly award maximum weekly bill explainer"
                  message="
                    The maximum amount you will be charged each week, if your freelancer tracks up to the weekly limit.
                  "
                  [position]="TooltipPosition.BOTTOM_START"
                >
                  <fl-icon
                    [name]="'ui-info-v2'"
                    [size]="IconSize.SMALL"
                  ></fl-icon>
                </fl-tooltip>
              </fl-bit>

              <fl-text>
                {{ weeklyBill$ | async | flCurrency: project.currency.code }}
              </fl-text>
            </fl-bit>
          </fl-list-item>

          <fl-hr></fl-hr>
        </fl-list>

        <ng-container *ngIf="showInitialPayment">
          <app-hourly-award-modal-initial-payment-explainer
            [freelancerPublicName]="freelancer.displayName"
            [initialPaymentAmount]="initialPaymentAmount$ | async"
            [currency]="project.currency"
            [initialPaymentRate]="INITIAL_PAYMENT_RATE"
          >
          </app-hourly-award-modal-initial-payment-explainer>
          <fl-hr></fl-hr>
        </ng-container>
      </fl-bit>

      <fl-bit HourlyAwardForm="cta">
        <ng-container *ngIf="!showInitialPayment">
          <fl-text
            *ngIf="employer.status.paymentVerified === false"
            i18n="Hourly award as hourly payment method notice"
            [flMarginBottom]="Margin.XSMALL"
            [color]="FontColor.MID"
          >
            You will NOT be charged right now, a payment method needs to be set
            up so that you are prepared to pay your freelancer when they deliver
            their work.
          </fl-text>
          <app-hourly-award-cta-layout>
            <fl-link
              HourlyAwardCTA="switchAwardTypeButton"
              i18n="Switch Pay fixed price button"
              flTrackingLabel="HourlyFixedModalLink"
              (click)="switchToFixed()"
            >
              I prefer to pay a Fixed Price
            </fl-link>
            <fl-bit HourlyAwardCTA="awardButton">
              <fl-button
                *ngIf="
                  employer.status.paymentVerified === true;
                  else paymentVerifyButton
                "
                i18n="Award bid button"
                flTrackingLabel="AwardBidButton"
                [color]="ButtonColor.SUCCESS"
                [disabled]="!(formValid$ | async)"
                [busy]="submissionPromise && !(submissionPromise | async)"
                (click)="awardBid.emit(this.awardForm)"
              >
                Award
              </fl-button>
              <ng-template #paymentVerifyButton>
                <fl-button
                  i18n="Payment verify button"
                  flTrackingLabel="PaymentVerifyButton"
                  [color]="ButtonColor.SUCCESS"
                  [disabled]="!(formValid$ | async)"
                  (click)="paymentVerifyAndAward.emit()"
                >
                  Add Payment Method and Award
                </fl-button>
              </ng-template>
            </fl-bit>
          </app-hourly-award-cta-layout>
        </ng-container>

        <ng-container *ngIf="showInitialPayment">
          <app-hourly-award-cta-layout>
            <fl-link
              HourlyAwardCTA="switchAwardTypeButton"
              i18n="Switch to paying fixed price button"
              flTrackingLabel="HourlyFixedModalLink"
              (click)="switchToFixed()"
            >
              I prefer to pay a Fixed Price
            </fl-link>
            <fl-bit HourlyAwardCTA="awardButton">
              <fl-button
                i18n="Award bid with initial payment button"
                flTrackingLabel="AwardBidWithInitialPaymentButton"
                [color]="ButtonColor.PRIMARY_PINK"
                [disabled]="!(formValid$ | async)"
                [busy]="submissionPromise && !(submissionPromise | async)"
                (click)="awardBid.emit(this.awardForm)"
              >
                Create
                {{
                  initialPaymentAmount$
                    | async
                    | flCurrency: project.currency.code
                }}
                Initial Payment and Award
              </fl-button>
            </fl-bit>
          </app-hourly-award-cta-layout>
        </ng-container>
      </fl-bit>
    </app-hourly-award-form-layout>
  `,
  styleUrls: ['./hourly-award-as-hourly-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HourlyAwardAsHourlyFormComponent implements OnInit {
  Margin = Margin;
  TextSize = TextSize;
  HeadingType = HeadingType;
  IconSize = IconSize;
  isFormControl = isFormControl;
  TooltipPosition = TooltipPosition;
  InputType = InputType;
  InputSize = InputSize;
  ButtonColor = ButtonColor;
  FontType = FontType;
  FontColor = FontColor;

  readonly HOURS_IN_A_WEEK = 24 * 7;
  // Initial payment amount is 50% of the maximum weekly bill
  readonly INITIAL_PAYMENT_RATE = 0.5;

  @Input() bid: Bid;
  @Input() employer: ProjectViewUser;
  @Input() freelancer: ProjectViewUser;
  @Input() project: ProjectViewProject;
  @Input() submissionPromise: Promise<
    BackendUpdateResponse<BidsCollection> & {
      errorType?: HourlyAwardModalErrorType;
    }
  >;
  @Input() showInitialPayment: boolean;
  @Output() switchAwardType = new EventEmitter<ProjectTypeApi>();
  @Output() close = new EventEmitter<boolean>();
  @Output() awardBid = new EventEmitter<FormGroup>();
  @Output() paymentVerifyAndAward = new EventEmitter<boolean>();

  awardForm: FormGroup;
  weeklyBill$: Rx.Observable<number>;
  initialPaymentAmount$: Rx.Observable<number>;
  formValid$: Rx.Observable<boolean>;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.awardForm = this.fb.group({
      weeklyLimit: [
        this.bid.period,
        Validators.compose([
          required($localize`Please enter a weekly limit.`),
          minValue(1, $localize`The minimum weekly limit allowed is 1 hour.`),
          maxValue(
            this.HOURS_IN_A_WEEK,
            $localize`The maximum weekly limit allowed is ${this.HOURS_IN_A_WEEK} hours.`,
          ),
          wholeNumber($localize`Please enter a whole number.`),
        ]),
      ],
    });

    this.weeklyBill$ = this.awardForm.controls.weeklyLimit.valueChanges.pipe(
      startWith(this.awardForm.controls.weeklyLimit.value),
      map(hours => hours * this.bid.amount),
    );

    this.formValid$ = this.awardForm.statusChanges.pipe(
      startWith(this.awardForm.status),
      map(status => status === 'VALID'),
    );

    this.initialPaymentAmount$ = this.weeklyBill$.pipe(
      map(maxWeeklyPayment => maxWeeklyPayment * this.INITIAL_PAYMENT_RATE),
    );
  }

  switchToFixed() {
    this.switchAwardType.emit(ProjectTypeApi.FIXED);
  }
}
