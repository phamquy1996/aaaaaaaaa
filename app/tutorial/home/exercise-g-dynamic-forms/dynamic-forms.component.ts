import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Auth } from '@freelancer/auth';
import { TimeUtils } from '@freelancer/time-utils';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { CardLevel, CardSize } from '@freelancer/ui/card';
import { HeadingType } from '@freelancer/ui/heading';
import { InputSize } from '@freelancer/ui/input';
import { ListItemType } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';
import { minLength, required } from '@freelancer/ui/validators';
import { assertNever, isFormControl } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

// FIXME don't export this in stub
export interface ProjectSubmission {
  userId: string;
  name: string;
  description: string;
  type: 'project' | 'contest';
}

@Component({
  selector: 'app-dynamic-forms',
  template: `
    <fl-bit class="Body">
      <fl-heading
        i18n="Tutorial form title"
        [headingType]="HeadingType.H2"
        [flMarginBottom]="Margin.SMALL"
        [size]="TextSize.XLARGE"
      >
        Tell us what you need done
      </fl-heading>
      <form [formGroup]="formGroup">
        <fl-heading
          i18n="Tutorial form label"
          [headingType]="HeadingType.H3"
          [flMarginBottom]="Margin.XXXSMALL"
          [size]="TextSize.MID"
        >
          Choose a name for your project
        </fl-heading>
        <ng-container *ngIf="formGroup.get('name') as control">
          <fl-input
            *ngIf="isFormControl(control)"
            placeholder="eg. Build me a website"
            i18n-placeholder="Tutorial form placeholder"
            [control]="control"
            [flMarginBottom]="Margin.LARGE"
            [size]="InputSize.LARGE"
            [flTrackingLabel]="'ProjectName'"
          ></fl-input>
        </ng-container>

        <fl-heading
          i18n="Tutorial form label"
          [headingType]="HeadingType.H3"
          [flMarginBottom]="Margin.XXSMALL"
          [size]="TextSize.MID"
        >
          Tell us more about your project
        </fl-heading>
        <fl-text
          i18n="Tutorial form description label"
          [flMarginBottom]="Margin.SMALL"
        >
          Start with a bit about yourself or your business, and include an
          overview of what you need done.
        </fl-text>
        <ng-container *ngIf="formGroup.get('description') as control">
          <fl-textarea
            *ngIf="isFormControl(control)"
            placeholder="Describe your project here..."
            i18n-placeholder="Tutorial form placeholder"
            [control]="control"
            [flMarginBottom]="Margin.SMALL"
            [rows]="4"
            [flTrackingLabel]="'ProjectDescription'"
          ></fl-textarea>
        </ng-container>

        <fl-heading
          i18n="Tutorial form label"
          [headingType]="HeadingType.H3"
          [flMarginBottom]="Margin.XXSMALL"
          [size]="TextSize.MID"
        >
          How do you want to pay?
        </fl-heading>
        <ng-container *ngIf="formGroup.get('type') as control">
          <fl-bit
            *ngIf="isFormControl(control)"
            [flMarginBottom]="Margin.LARGE"
          >
            <fl-grid>
              <fl-col [col]="12" [colTablet]="6">
                <fl-card [edgeToEdge]="true">
                  <fl-list-item
                    [flTrackingLabel]="'ProjectPaymentType'"
                    [control]="control"
                    [radioValue]="'project'"
                    [selectable]="true"
                    [type]="ListItemType.RADIO"
                  >
                    <fl-text
                      i18n="Tutorial form radio label"
                      [weight]="FontWeight.BOLD"
                    >
                      Post a project
                    </fl-text>
                    <fl-text i18n="Tutorial form radio description label">
                      Receive free quotes, best for when you have a specific
                      idea, the project is not visual in nature or the project
                      is complex.
                    </fl-text>
                  </fl-list-item>
                </fl-card>
              </fl-col>
              <fl-col [col]="12" [colTablet]="6">
                <fl-card [edgeToEdge]="true">
                  <fl-list-item
                    [flTrackingLabel]="'ContestPaymentType'"
                    [control]="control"
                    [radioValue]="'contest'"
                    [selectable]="true"
                    [type]="ListItemType.RADIO"
                  >
                    <fl-text
                      i18n="Tutorial form radio label"
                      [weight]="FontWeight.BOLD"
                    >
                      Start a contest
                    </fl-text>
                    <fl-text i18n="Tutorial form radio description label">
                      Crowdsource ideas. Post a prize and get competing entries
                      which you can iterate on with feedback. Great for visual
                      designs.
                    </fl-text>
                  </fl-list-item>
                </fl-card>
              </fl-col>
            </fl-grid>
          </fl-bit>
        </ng-container>

        <fl-bit
          *ngIf="formGroup.get('type')?.valid"
          [flMarginBottom]="Margin.LARGE"
        >
          <fl-heading
            i18n="Tutorial form label"
            [headingType]="HeadingType.H3"
            [flMarginBottom]="Margin.XXSMALL"
            [size]="TextSize.MID"
          >
            What is your budget?
          </fl-heading>
          <ng-container *ngIf="formGroup.get('range') as control">
            <ng-container *ngIf="isFormControl(control)">
              <fl-select
                *ngIf="control.enabled"
                placeholder="Select a budget..."
                i18n-placeholder="Tutorial form placeholder"
                [control]="control"
                [options]="budgetOptions"
                [flTrackingLabel]="'ProjectBudget'"
              ></fl-select>
            </ng-container>
          </ng-container>
          <ng-container *ngIf="formGroup.get('amount') as control">
            <ng-container *ngIf="isFormControl(control)">
              <fl-slider
                *ngIf="control.enabled"
                [minValue]="10"
                [maxValue]="1750"
                [maxControl]="control"
              ></fl-slider>
            </ng-container>
          </ng-container>
        </fl-bit>

        <fl-banner-alert
          *ngIf="!isBusy && error"
          i18n="Tutorial form error alert"
          [closeable]="false"
          [type]="BannerAlertType.ERROR"
          [flMarginBottom]="Margin.XXSMALL"
        >
          Sorry, contests canot be posted yet.
        </fl-banner-alert>

        <fl-banner-alert
          *ngIf="!isBusy && !error && (submission$ | async); let submission"
          i18n="Tutorial form success alert"
          [closeable]="true"
          [type]="BannerAlertType.SUCCESS"
          [flMarginBottom]="Margin.XXSMALL"
        >
          Submission success!
          <fl-text> {{ submission | json }} </fl-text>
        </fl-banner-alert>

        <fl-button
          i18n="Tutorial form button label"
          [busy]="isBusy"
          [color]="ButtonColor.PRIMARY"
          [disabled]="!formGroup.valid"
          [size]="ButtonSize.LARGE"
          [flTrackingLabel]="'SubmitButton'"
          (click)="handleSubmit()"
        >
          Post My Project
        </fl-button>
      </form>
    </fl-bit>
  `,
  styleUrls: ['./dynamic-forms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormsComponent implements OnInit, OnDestroy {
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  CardLevel = CardLevel;
  CardSize = CardSize;
  FontColor = FontColor;
  FontWeight = FontWeight;
  HeadingType = HeadingType;
  InputSize = InputSize;
  isFormControl = isFormControl;
  ListItemType = ListItemType;
  Margin = Margin;
  TextSize = TextSize;

  readonly budgetOptions = [
    '',
    'Micro Project ($10 - 30 AUD)',
    'Simple Project ($30 - 250 AUD)',
    'Very Small Project ($250 - 750 AUD)',
    'Small Project ($750 - 1500 AUD)',
    'Medium Project ($1500 - 3000 AUD)',
  ] as const;

  formGroup = this.fb.group({
    name: [
      '',
      [
        required($localize`Please enter a project name.`),
        minLength(10, $localize`Please enter at least 10 characters.`),
      ],
    ],
    description: [
      '',
      [
        required($localize`Please enter a project description.`),
        minLength(30, $localize`Please enter at least 30 characters.`),
      ],
    ],
    type: ['', required($localize`Please choose a project type.`)],
    amount: [
      { value: 30, disabled: true },
      required($localize`Please pick a contest budget`),
    ],
    range: [
      { value: '', disabled: true },
      required($localize`Please pick a budget range.`),
    ],
  });

  isBusy = false;
  error = false;
  submission$: Rx.Observable<ProjectSubmission>;

  // FIXME: Remove this for stub?
  @Output() formSubmitted = new EventEmitter<ProjectSubmission>();

  private _clickSubject$ = new Rx.Subject<void>();
  private submissionSubscription?: Rx.Subscription;
  private formTypeSubscription?: Rx.Subscription;

  constructor(
    private auth: Auth,
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private timeUtils: TimeUtils,
  ) {}

  handleSubmit() {
    this._clickSubject$.next();
  }

  ngOnInit() {
    this.formTypeSubscription = this.formGroup.controls.type.valueChanges.subscribe(
      // Angular Reactive Forms are not type-safe, so we set a type here
      (type: ProjectSubmission['type']) => {
        const amountControl = this.formGroup.controls.amount;
        const rangeControl = this.formGroup.controls.range;
        switch (type) {
          case 'project':
            amountControl.disable();
            rangeControl.enable();
            break;
          case 'contest':
            rangeControl.disable();
            amountControl.enable();
            break;
          default:
            // type can only take two values, so we assertNever here for completeness
            // if it ever gains more options, this will become a compile error.
            assertNever(type);
        }
      },
    );

    this.submission$ = this._clickSubject$.pipe(
      withLatestFrom(this.auth.getUserId(), this.formGroup.valueChanges),
      map(([_, userId, submission]) => ({ userId, ...submission })),
    );

    /**
     * Because we use an async pipe with submissions$, we could tack this onto the above pipe in a tap.
     * If we did that, though, removing the async pipe would cause this code to no longer run.
     * Thus, we manually subscribe here to guarantee consistency.
     */
    this.submissionSubscription = this.submission$.subscribe(submission => {
      this.isBusy = true;
      this.changeDetectorRef.markForCheck();
      this.submitProject(submission)
        .then(() => {
          this.isBusy = false;
          this.error = false;
          this.changeDetectorRef.markForCheck();
          this.formSubmitted.next(submission);
        })
        .catch(() => {
          this.isBusy = false;
          this.error = true;
          this.changeDetectorRef.markForCheck();
        });
    });
  }

  ngOnDestroy() {
    if (this.formTypeSubscription) {
      this.formTypeSubscription.unsubscribe();
    }
    if (this.submissionSubscription) {
      this.submissionSubscription.unsubscribe();
    }
  }

  /**
   * This code is for display purposes only! Normally you would do a datastore.push or similar call.
   * All we do here is wait one second before resolving/rejecting to showcase the button busy-ness.
   */
  submitProject(submission: ProjectSubmission): Promise<boolean> {
    return new Promise(resolve => {
      this.timeUtils.setTimeout(() => {
        resolve();
      }, 1000);
    });
  }
}
