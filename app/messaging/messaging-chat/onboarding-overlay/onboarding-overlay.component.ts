import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  HourlyContract,
  Project,
  Thread,
  User,
} from '@freelancer/datastore/collections';
import { LocalStorage } from '@freelancer/local-storage';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { FontType } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { map, take } from 'rxjs/operators';
import { OverlayTemplateDiscussComponent } from './overlay-template-discuss.component';
import { OverlayTemplateIntroComponent } from './overlay-template-intro.component';
import { OverlayTemplateMilestoneComponent } from './overlay-template-milestone.component';
import { OverlayTemplateOffsiteComponent } from './overlay-template-offsite.component';

@Component({
  selector: 'app-onboarding-overlay',
  template: `
    <fl-bit
      class="OnboardingOverlay"
      *ngIf="steps && currentStep !== undefined && currentStep < steps.length"
    >
      <ng-container *ngIf="otherMembers?.length > 0; else spinner">
        <fl-bit [ngSwitch]="currentStep">
          <app-overlay-template-intro
            *ngSwitchCase="0"
            [otherUser]="otherMembers[0]"
            [project]="project"
            [thread]="thread"
          ></app-overlay-template-intro>
          <app-overlay-template-offsite
            *ngSwitchCase="1"
          ></app-overlay-template-offsite>
          <app-overlay-template-discuss
            *ngSwitchCase="2"
            [otherUser]="otherMembers[0]"
          ></app-overlay-template-discuss>
          <app-overlay-template-milestone
            *ngSwitchCase="3"
            [hourlyContracts]="hourlyContracts"
            [project]="project"
            [otherUser]="otherMembers[0]"
          ></app-overlay-template-milestone>
        </fl-bit>
      </ng-container>
      <ng-template #spinner>
        <fl-spinner flTrackingLabel="ChatboxUserLoadingSpinner"></fl-spinner>
      </ng-template>
      <fl-bit
        class="Footer"
        *ngIf="showFullFlow$ | async"
        flTrackingSection="FullFlow"
        [flMarginBottom]="Margin.LARGE"
      >
        <!-- always display this for spacing -->
        <fl-bit class="LeftButton">
          <fl-button
            *ngIf="!isAtStart()"
            (click)="handleBackClicked()"
            flTrackingLabel="previousStep"
            [size]="ButtonSize.SMALL"
          >
            <fl-icon
              [name]="'ui-chevron-left'"
              [size]="IconSize.XSMALL"
            ></fl-icon>
            <fl-text
              [fontType]="FontType.SPAN"
              i18n="Chatbox overlay control button"
            >
              Back
            </fl-text>
          </fl-button>
        </fl-bit>
        <fl-progress-bar
          class="Progress"
          label="Onboarding progress"
          i18n-label="Onboarding progress bar label"
          *ngIf="currentStep !== undefined"
          [progressPercentage]="(100 * currentStep) / (steps.length - 1)"
        ></fl-progress-bar>
        <fl-bit class="RightButton">
          <fl-button
            *ngIf="!isAtEnd()"
            (click)="handleNextClicked()"
            flTrackingLabel="nextStep"
            [size]="ButtonSize.MINI"
          >
            <fl-text
              [fontType]="FontType.SPAN"
              i18n="Chatbox overlay control button"
            >
              Next
            </fl-text>
            <fl-icon
              [name]="'ui-chevron-right'"
              [size]="IconSize.XSMALL"
            ></fl-icon>
          </fl-button>
          <fl-button
            *ngIf="isAtEnd()"
            (click)="handleEndClicked()"
            flTrackingLabel="nextStep"
            [color]="ButtonColor.DEFAULT"
            [size]="ButtonSize.MINI"
            i18n="Chatbox overlay control button"
          >
            Chat
          </fl-button>
        </fl-bit>
      </fl-bit>
      <fl-bit
        class="Footer Footer--nonFullFlow"
        *ngIf="(showFullFlow$ | async) === false"
        flTrackingSection="OneStepOnly"
        [flMarginBottom]="Margin.LARGE"
      >
        <fl-button
          (click)="handleEndClicked()"
          flTrackingLabel="dismissOneStep"
          [color]="ButtonColor.SECONDARY"
          [size]="ButtonSize.SMALL"
          i18n="Chatbox overlay control button"
        >
          Start Chatting
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['onboarding-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingOverlayComponent implements OnInit {
  Margin = Margin;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  IconSize = IconSize;
  FontType = FontType;

  @Output() closeOverlay = new EventEmitter<undefined>();
  @Input() otherMembers: ReadonlyArray<User>;
  @Input() project: Project;
  @Input() thread: Thread;
  @Input() hourlyContracts: ReadonlyArray<HourlyContract>;

  readonly steps = [
    OverlayTemplateIntroComponent,
    OverlayTemplateOffsiteComponent,
    OverlayTemplateDiscussComponent,
    OverlayTemplateMilestoneComponent,
  ] as const;
  currentStep?: number;
  showFullFlow$: Rx.Observable<boolean>;

  constructor(
    private localStorage: LocalStorage,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.showFullFlow$ = this.localStorage
      .get('projectOverlayFullFlowComplete')
      .pipe(map(value => value !== true));

    // show from start, or pick a random slide in the middle to show
    this.showFullFlow$
      .pipe(take(1))
      .toPromise()
      .then(value => {
        if (value) {
          this.currentStep = 0;
        } else {
          this.currentStep = Math.floor(
            Math.random() * (this.steps.length - 1) + 1,
          );
        }
        this.changeDetectorRef.markForCheck();
      });
  }

  handleBackClicked() {
    if (this.currentStep !== undefined && !this.isAtStart()) {
      this.currentStep--;
      this.changeDetectorRef.markForCheck();
    }
  }

  handleNextClicked() {
    if (this.currentStep !== undefined && !this.isAtEnd()) {
      this.currentStep++;
      this.changeDetectorRef.markForCheck();
    }
  }

  handleEndClicked() {
    this.localStorage
      .get('projectOverlayThreadComplete')
      .pipe(take(1))
      .toPromise()
      .then(entry => {
        const threadMap = {
          ...entry,
          [this.thread.id]: true,
        };
        this.localStorage.set('projectOverlayThreadComplete', threadMap);
      });

    this.localStorage.set('projectOverlayFullFlowComplete', true);
    this.closeOverlay.emit();
  }

  isAtStart() {
    return this.currentStep !== undefined && this.currentStep === 0;
  }

  isAtEnd() {
    return (
      this.currentStep !== undefined &&
      this.currentStep >= this.steps.length - 1
    );
  }
}
