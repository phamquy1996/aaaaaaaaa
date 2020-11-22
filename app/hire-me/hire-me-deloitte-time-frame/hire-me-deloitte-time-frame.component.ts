import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HeadingColor, HeadingType } from '@freelancer/ui/heading';
import { HoverColor, IconColor, IconSize } from '@freelancer/ui/icon';
import { InputType } from '@freelancer/ui/input';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';
import { isFormControl } from '@freelancer/utils';

@Component({
  selector: 'app-hire-me-deloitte-time-frame',
  template: `
    <fl-hr [flMarginBottom]="Margin.SMALL"></fl-hr>
    <fl-bit class="TimeFrameHeadingWrapper">
      <fl-heading
        i18n="Time Frame Title"
        [color]="HeadingColor.LIGHT"
        [headingType]="HeadingType.H3"
        [size]="TextSize.SMALL"
        [flMarginBottom]="Margin.XSMALL"
      >
        Task timeframe
      </fl-heading>
      <fl-button flTrackingLabel="expandTimeFrame" (click)="handleExpand()">
        <fl-icon
          *ngIf="expanded"
          [color]="IconColor.LIGHT"
          [size]="IconSize.SMALL"
          [hoverColor]="HoverColor.PRIMARY"
          name="ui-chevron-down"
          i18n-label="Time frame collapse icon"
          label="Collapse"
        ></fl-icon>
        <fl-icon
          *ngIf="!expanded"
          [color]="IconColor.LIGHT"
          [size]="IconSize.SMALL"
          [hoverColor]="HoverColor.PRIMARY"
          name="ui-chevron-right"
          i18n-label="Time frame expand icon"
          label="Expand"
        ></fl-icon>
      </fl-button>
    </fl-bit>
    <fl-bit
      *ngIf="expanded"
      [ngClass]="{ ResponsiveContainer: isResponsive }"
      [flMarginBottom]="Margin.XSMALL"
    >
      <fl-bit class="ResponsiveField">
        <fl-text
          i18n="Hire Me project start date label"
          [weight]="FontWeight.BOLD"
          [color]="FontColor.LIGHT"
        >
          Expected start date
        </fl-text>
        <ng-container *ngIf="hireMeFormGroup.get('startDate') as control">
          <fl-input
            *ngIf="isFormControl(control)"
            flTrackingLabel="PostProjectTimeFrameStartDate"
            [control]="control"
            [flMarginBottom]="Margin.XSMALL"
            [type]="InputType.DATE"
          ></fl-input>
        </ng-container>
      </fl-bit>
      <fl-bit class="ResponsiveField">
        <fl-text
          i18n="Hire Me project end date label"
          [weight]="FontWeight.BOLD"
          [color]="FontColor.LIGHT"
        >
          Expected end date
        </fl-text>
        <ng-container *ngIf="hireMeFormGroup.get('completionDate') as control">
          <fl-input
            *ngIf="isFormControl(control)"
            flTrackingLabel="PostProjectTimeFrameCompletionDate"
            [control]="control"
            [flMarginBottom]="Margin.MID"
            [type]="InputType.DATE"
          ></fl-input>
        </ng-container>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./hire-me-deloitte-time-frame.component.scss'],
})
export class HireMeDeloitteTimeFrameComponent {
  FontColor = FontColor;
  FontWeight = FontWeight;
  HeadingColor = HeadingColor;
  HeadingType = HeadingType;
  HoverColor = HoverColor;
  IconColor = IconColor;
  IconSize = IconSize;
  InputType = InputType;
  isFormControl = isFormControl;
  Margin = Margin;
  TextSize = TextSize;

  expanded = true;

  @Input() isResponsive = false;
  @Input() hireMeFormGroup: FormGroup;

  handleExpand() {
    this.expanded = !this.expanded;
  }
}
