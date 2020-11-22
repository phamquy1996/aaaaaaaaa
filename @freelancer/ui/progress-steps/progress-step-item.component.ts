import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import { CalloutPlacement } from '@freelancer/ui/callout';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { ProgressOrientation } from '@freelancer/ui/progress-bar';
import { FontColor, FontType, FontWeight, TextSize } from '@freelancer/ui/text';
import { ProgressSubstepComponent } from './progress-substep.component';

@Component({
  selector: 'fl-progress-step-callout',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressStepCalloutComponent {}

@Component({
  selector: 'fl-progress-step-content',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressStepContentComponent {}

@Component({
  selector: 'fl-progress-step-item',
  template: `
    <ng-template #content>
      <fl-bit
        class="ProgressStepIndicator"
        [flMarginBottom]="
          orientation === ProgressOrientation.HORIZONTAL || !isLastStep
            ? Margin.MID
            : Margin.NONE
        "
        [flMarginBottomTablet]="
          orientation === ProgressOrientation.HORIZONTAL || !isLastStep
            ? Margin.LARGE
            : Margin.NONE
        "
        [attr.data-orientation]="orientation"
      >
        <fl-icon
          class="ProgressStepTick"
          [color]="IconColor.PRIMARY"
          [name]="'ui-check'"
          [ngClass]="{ IsActive: active }"
          [size]="
            orientation === ProgressOrientation.HORIZONTAL
              ? IconSize.XSMALL
              : IconSize.SMALL
          "
          [sizeTablet]="IconSize.SMALL"
        ></fl-icon>
      </fl-bit>
      <fl-bit class="ProgressStepText" [attr.data-orientation]="orientation">
        <fl-text
          class="ProgressStepTitle"
          [size]="
            orientation === ProgressOrientation.HORIZONTAL
              ? TextSize.XXSMALL
              : TextSize.XSMALL
          "
          [sizeTablet]="TextSize.XSMALL"
          [weight]="FontWeight.BOLD"
        >
          {{ stepTitle }}
        </fl-text>
        <ng-container *ngIf="showContent">
          <fl-text
            *ngIf="progressStepContent"
            class="ProgressStepDescription"
            [color]="FontColor.MID"
            [size]="
              orientation === ProgressOrientation.HORIZONTAL
                ? TextSize.XXSMALL
                : TextSize.XSMALL
            "
            [sizeTablet]="TextSize.XSMALL"
            [fontType]="FontType.CONTAINER"
            [flMarginBottom]="!isLastStep ? Margin.SMALL : Margin.NONE"
          >
            <ng-content select="fl-progress-step-content"></ng-content>
          </fl-text>
        </ng-container>
        <fl-bit
          *ngIf="
            progressSubsteps?.length > 0 &&
            orientation === ProgressOrientation.VERTICAL
          "
          class="ProgressSubStepContainer"
        >
          <ng-content select="fl-progress-substep"></ng-content>
        </fl-bit>
      </fl-bit>
    </ng-template>

    <ng-container *ngIf="progressStepCallout">
      <fl-callout [hover]="true" [placement]="CalloutPlacement.BOTTOM">
        <fl-callout-trigger
          class="ProgressStepCalloutTrigger"
          [attr.data-orientation]="orientation"
        >
          <ng-container *ngTemplateOutlet="content"></ng-container>
        </fl-callout-trigger>
        <fl-callout-content>
          <ng-content select="fl-progress-step-callout"></ng-content>
        </fl-callout-content>
      </fl-callout>
    </ng-container>

    <ng-container *ngIf="!progressStepCallout">
      <ng-container *ngTemplateOutlet="content"></ng-container>
    </ng-container>
  `,
  styleUrls: ['./progress-step-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressStepItemComponent implements OnChanges {
  CalloutPlacement = CalloutPlacement;
  IconColor = IconColor;
  IconSize = IconSize;
  FontColor = FontColor;
  TextSize = TextSize;
  FontType = FontType;
  FontWeight = FontWeight;
  Margin = Margin;
  ProgressOrientation = ProgressOrientation;

  completedSubstepPosition: number;
  isLastStep: boolean;

  @Input() stepTitle: string;
  @Input() active = false;
  @Input() showContent = false;
  @Input() completedSubstep = 0;

  @HostBinding('attr.data-orientation')
  @Input()
  orientation: ProgressOrientation = ProgressOrientation.HORIZONTAL;

  @ContentChild(ProgressStepCalloutComponent)
  progressStepCallout: ProgressStepCalloutComponent;

  @ContentChild(ProgressStepContentComponent)
  progressStepContent: ProgressStepContentComponent;

  @ContentChildren(ProgressSubstepComponent)
  progressSubsteps: QueryList<ProgressSubstepComponent>;

  @Output() substepChanged = new EventEmitter<void>();

  constructor(
    public elementRef: ElementRef,
    public changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      'completedSubstep' in changes &&
      this.progressSubsteps &&
      this.orientation === ProgressOrientation.VERTICAL
    ) {
      this.substepChanged.emit();
    }
  }
}
