import { isPlatformBrowser } from '@angular/common';
import {
  AfterContentInit,
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FreelancerBreakpointValues } from '@freelancer/ui/breakpoints';
import {
  ProgressFill,
  ProgressOrientation,
  ProgressSize,
} from '@freelancer/ui/progress-bar';
import * as Rx from 'rxjs';
import { ProgressStepItemComponent } from './progress-step-item.component';

@Component({
  selector: 'fl-progress-steps',
  template: `
    <fl-bit
      #progressStepBar
      class="ProgressStepBar"
      [attr.data-orientation]="orientation"
    >
      <fl-progress-bar
        [fill]="fill"
        [progressPercentage]="currentStepPercentage"
        [size]="
          orientation === ProgressOrientation.HORIZONTAL
            ? ProgressSize.SMALL
            : ProgressSize.LARGE
        "
        [sizeTablet]="ProgressSize.LARGE"
        [orientation]="orientation"
      ></fl-progress-bar>
    </fl-bit>
    <fl-bit class="ProgressStepRow" [attr.data-orientation]="orientation">
      <ng-content select="fl-progress-step-item"></ng-content>
    </fl-bit>
  `,
  styleUrls: ['./progress-steps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressStepsComponent
  implements OnChanges, AfterContentInit, OnDestroy, OnInit, AfterViewChecked {
  ProgressFill = ProgressFill;
  ProgressOrientation = ProgressOrientation;
  ProgressSize = ProgressSize;

  currentStepPercentage = 0;
  height: number;

  @Input() currentStep = 1;
  @Input() fill: ProgressFill = ProgressFill.GRADIENT;

  @Input()
  orientation: ProgressOrientation = ProgressOrientation.HORIZONTAL;

  @ContentChildren(ProgressStepItemComponent)
  progressStepItem: QueryList<ProgressStepItemComponent>;

  @ViewChild('progressStepBar', { read: ElementRef })
  progressStepBar: ElementRef<HTMLDivElement>;

  private previousOffsetTop: number;
  private subscriptions: ReadonlyArray<Rx.Subscription> = [];
  private windowResize: () => void;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private changeDetector: ChangeDetectorRef,
    private renderer: Renderer2,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if ('currentStep' in changes && this.progressStepItem) {
      this.setChildrenProperties();
    }

    if ('orientation' in changes && this.progressStepItem) {
      this.setChildrenOrientation();
      this.setChildrenProperties();
    }
  }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Adjust progress bar when window is resized
    this.windowResize = this.renderer.listen('window', 'resize', () => {
      this.recalculateProgressBar();
    });
  }

  ngAfterContentInit() {
    this.setChildrenOrientation();
    this.setChildrenProperties();
    this.setSubstepSubscription();
  }

  /**
   * Adjust progress bar whenever the view changes
   */
  ngAfterViewChecked() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.recalculateProgressBar();
  }

  setProgressPercentage() {
    if (this.orientation === ProgressOrientation.HORIZONTAL) {
      this.setHorizontalPercentage();
    } else {
      this.setVerticalPercentage();
    }
  }

  setHorizontalPercentage() {
    const stepPercentage =
      (this.currentStep - 1) / (this.progressStepItem.length - 1);
    this.currentStepPercentage = Math.min(Math.max(stepPercentage, 0), 1) * 100;
  }

  setVerticalPercentage() {
    // FIXME: We can't calculate the height of progress on the server.
    if (isPlatformBrowser(this.platformId) && this.currentStep > 0) {
      const progressStepItems = this.progressStepItem.toArray();

      // Current step should not exceed number of steps
      const step =
        this.currentStep > progressStepItems.length
          ? progressStepItems.length
          : this.currentStep;

      const stepItem = progressStepItems[step - 1];
      const subStepPosition = this.getSubstepPosition(stepItem);

      const progressHeight =
        parseInt(stepItem.elementRef.nativeElement.offsetTop, 10) +
        subStepPosition;

      this.currentStepPercentage = (progressHeight / this.height) * 100;
    } else {
      this.currentStepPercentage = 0;
    }
  }

  setProgressBarHeight() {
    const { nativeElement } = this.progressStepBar;

    if (this.orientation === ProgressOrientation.VERTICAL) {
      this.height = this.progressStepItem.last.elementRef.nativeElement.offsetTop;

      this.renderer.setStyle(nativeElement, 'height', `${this.height}px`);
    } else {
      this.renderer.removeStyle(nativeElement, 'height');
    }
  }

  setChildrenProperties() {
    this.progressStepItem.forEach((component, index) => {
      this.setChildrenActiveState(component, index);
      this.toggleChildrenDescription(component, index);

      component.isLastStep = index === this.progressStepItem.length - 1;
      component.changeDetectorRef.detectChanges();
    });

    setTimeout(() => {
      this.setProgressBarHeight();
      this.setProgressPercentage();
      this.changeDetector.markForCheck();
    });
  }

  setSubstepSubscription() {
    this.progressStepItem.forEach((component, index) => {
      this.subscriptions = [
        ...this.subscriptions,
        component.substepChanged.subscribe(() => {
          if (index === this.currentStep - 1) {
            this.handleSubstepChanges();
          }
        }),
      ];
    });
  }

  setChildrenOrientation() {
    this.progressStepItem.forEach(component => {
      component.orientation = this.orientation;
    });
  }

  setChildrenActiveState(component: ProgressStepItemComponent, index: number) {
    if (index < this.currentStep - 1) {
      component.active = true;
    } else {
      component.active = false;
    }
  }

  toggleChildrenDescription(
    component: ProgressStepItemComponent,
    index: number,
  ) {
    if (
      index === this.currentStep - 1 &&
      this.orientation === ProgressOrientation.VERTICAL
    ) {
      component.showContent = true;
    } else {
      component.showContent = false;
    }
  }

  handleSubstepChanges() {
    this.changeDetector.markForCheck();
    this.setProgressPercentage();
    this.changeDetector.detectChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());

    if (this.windowResize) {
      this.windowResize();
    }
  }

  private getSubstepPosition(stepItem: ProgressStepItemComponent) {
    // Takes text's line height into account
    const subStepOffsetPosition = 12;
    const subStepOffsetPositionLarge = 16;

    const progressSubstepItems = stepItem.progressSubsteps.toArray();

    // Current substep should not exceed number of substeps
    const substep =
      stepItem.completedSubstep > progressSubstepItems.length
        ? progressSubstepItems.length
        : stepItem.completedSubstep;

    const substepItem = progressSubstepItems[substep - 1];

    if (this.currentStep !== 0 && substepItem) {
      const substepOffset =
        window.innerWidth < parseInt(FreelancerBreakpointValues.TABLET, 10)
          ? subStepOffsetPosition
          : subStepOffsetPositionLarge;

      return (
        parseInt(substepItem.elementRef.nativeElement.offsetTop, 10) +
        substepOffset
      );
    }

    return 0;
  }

  /**
   * Recalculate progress bar only when the last step changes position
   */
  private recalculateProgressBar() {
    const lastItemOffsetTop = this.progressStepItem.last.elementRef
      .nativeElement.offsetTop;

    if (this.previousOffsetTop !== lastItemOffsetTop) {
      setTimeout(() => {
        this.setProgressBarHeight();
        this.setProgressPercentage();
        this.changeDetector.markForCheck();
      });
      this.previousOffsetTop = lastItemOffsetTop;
    }
  }
}
