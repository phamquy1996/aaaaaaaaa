import { Component, QueryList, ViewChildren } from '@angular/core';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { ProgressOrientation, ProgressSize } from '@freelancer/ui/progress-bar';
import { FontType, TextSize } from '@freelancer/ui/text';
import { ArrowOnboardingModalStepComponent } from './arrow-onboarding-modal-step.component';

@Component({
  template: `
    <fl-bit [flMarginBottom]="Margin.LARGE">
      <app-arrow-onboarding-modal-step
        #step
        [flHide]="currentStep !== 0"
        [videoUrl]="'/job-post/onboarding/video/onboarding-step-1.mp4'"
        (videoCanPlay)="firstVideoCanPlay()"
        heading="Welcome to ArrowPlus powered by Freelancer!"
        description="We're excited you've joined the world's largest online on-demand engineering marketplace. Let's help you get started with just a few steps."
        i18n-heading="Employer onboarding modal step title"
        i18n-description="Employer onboarding modal step description"
      ></app-arrow-onboarding-modal-step>
      <app-arrow-onboarding-modal-step
        #step
        [flHide]="currentStep !== 1"
        [videoUrl]="'/job-post/onboarding/video/onboarding-step-2.mp4'"
        heading="Get it done with Arrow Engineers"
        description="Tell us about your engineering project or task, and we'll match you with top engineering companies from around the world."
        i18n-heading="Employer onboarding modal step title"
        i18n-description="Employer onboarding modal step description"
      ></app-arrow-onboarding-modal-step>
      <app-arrow-onboarding-modal-step
        #step
        [flHide]="currentStep !== 2"
        [videoUrl]="'/job-post/onboarding/video/onboarding-step-3.mp4'"
        heading="Have peace of mind"
        description="Your ideas are protected! All engineers must sign a Non-Disclosure Agreement (NDA) before they can see any private details of your project."
        i18n-heading="Employer onboarding modal step title"
        i18n-description="Employer onboarding modal step description"
      ></app-arrow-onboarding-modal-step>
    </fl-bit>

    <fl-bit class="ControlsWrapper" [flMarginBottom]="Margin.MID">
      <fl-bit class="Controls">
        <fl-button
          *ngIf="!onFirstStep()"
          (click)="previousStep()"
          flTrackingLabel="previousStep"
          [size]="ButtonSize.SMALL"
        >
          <fl-icon
            [name]="'ui-chevron-left'"
            [size]="IconSize.XSMALL"
          ></fl-icon>
          <fl-text
            [fontType]="FontType.SPAN"
            i18n="Button to go to the previous step for employer onboarding"
          >
            Back
          </fl-text>
        </fl-button>

        <fl-progress-bar
          class="ProgressBar"
          label="Onboarding progress"
          i18n-label="Onboarding progress bar label"
          [progressPercentage]="(100 * (currentStep + 1)) / NUMBER_OF_STEPS"
        ></fl-progress-bar>

        <fl-button
          *ngIf="!onLastStep()"
          (click)="nextStep()"
          class="NextButton"
          flTrackingLabel="nextStep"
          [size]="ButtonSize.MINI"
        >
          <fl-text
            [fontType]="FontType.SPAN"
            i18n="Button to go to the next step for employer onboarding"
          >
            Next
          </fl-text>
          <fl-icon
            [name]="'ui-chevron-right'"
            [size]="IconSize.XSMALL"
          ></fl-icon>
        </fl-button>
        <fl-button
          *ngIf="onLastStep()"
          (click)="closeModal()"
          flTrackingLabel="nextStep"
          [size]="ButtonSize.MINI"
        >
          <fl-text
            [fontType]="FontType.SPAN"
            i18n="Button to complete the employer onboarding steps"
          >
            Get Started
          </fl-text>
          <fl-icon
            [name]="'ui-chevron-right'"
            [size]="IconSize.XSMALL"
          ></fl-icon>
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./arrow-onboarding-modal.component.scss'],
})
export class ArrowOnboardingModalComponent {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  IconSize = IconSize;
  FontType = FontType;
  TextSize = TextSize;
  Margin = Margin;
  ProgressSize = ProgressSize;
  ProgressOrientation = ProgressOrientation;
  HeadingType = HeadingType;

  readonly NUMBER_OF_STEPS = 3;
  currentStep = 0;

  @ViewChildren('step') steps: QueryList<ArrowOnboardingModalStepComponent>;

  constructor(private modalRef: ModalRef<ArrowOnboardingModalComponent>) {}

  firstVideoCanPlay() {
    this.playVideoByStep(0);
  }

  previousStep() {
    if (!this.onFirstStep()) {
      this.currentStep--;
    }
  }

  nextStep() {
    if (!this.onLastStep()) {
      this.currentStep++;

      // Play step video
      this.playVideoByStep(this.currentStep);
    }
  }

  onFirstStep() {
    return this.currentStep === 0;
  }

  onLastStep() {
    return this.currentStep >= this.NUMBER_OF_STEPS - 1;
  }

  closeModal() {
    this.modalRef.close();
  }

  playVideoByStep(stepIndex: number) {
    const step = this.steps.find((item, index) => index === stepIndex);
    if (step) {
      step.playVideo();
    }
  }
}
