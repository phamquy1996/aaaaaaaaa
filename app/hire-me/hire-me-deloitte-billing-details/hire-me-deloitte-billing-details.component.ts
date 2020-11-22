import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DeloitteProjectPostField } from '@freelancer/datastore/collections';
import { HeadingColor, HeadingType } from '@freelancer/ui/heading';
import { HoverColor, IconColor, IconSize } from '@freelancer/ui/icon';
import { InputType } from '@freelancer/ui/input';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';
import { isFormControl } from '@freelancer/utils';
@Component({
  selector: 'app-hire-me-deloitte-billing-details',
  template: `
    <fl-hr [flMarginBottom]="Margin.SMALL"></fl-hr>
    <fl-bit class="BillingDetailsHeadingWrapper">
      <fl-heading
        i18n="Billing Details Title"
        [color]="HeadingColor.LIGHT"
        [headingType]="HeadingType.H3"
        [size]="TextSize.SMALL"
        [flMarginBottom]="Margin.XSMALL"
      >
        Billing details
      </fl-heading>
      <fl-button
        flTrackingLabel="expandProjectDetails"
        (click)="handleExpand()"
      >
        <fl-icon
          *ngIf="expanded"
          [color]="IconColor.LIGHT"
          [size]="IconSize.SMALL"
          [hoverColor]="HoverColor.PRIMARY"
          name="ui-chevron-down"
          i18n-label="Billing details collapse icon"
          label="Collapse"
        ></fl-icon>
        <fl-icon
          *ngIf="!expanded"
          [color]="IconColor.LIGHT"
          [size]="IconSize.SMALL"
          [hoverColor]="HoverColor.PRIMARY"
          name="ui-chevron-right"
          i18n-label="Billing details expand icon"
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
        <ng-container
          *ngIf="
            hireMeFormGroup.get(
              DeloitteProjectPostField.BILLING_CODE
            ) as control
          "
        >
          <app-deloitte-project-billing-code-input
            *ngIf="isFormControl(control)"
            [control]="control"
            [isHireMe]="true"
          ></app-deloitte-project-billing-code-input>
        </ng-container>
      </fl-bit>
      <fl-bit class="ResponsiveField">
        <fl-text
          i18n="Hire Me project billable hours label"
          [weight]="FontWeight.BOLD"
          [color]="FontColor.LIGHT"
        >
          Expected hours
        </fl-text>
        <ng-container *ngIf="hireMeFormGroup.get('billableHours') as control">
          <fl-input
            *ngIf="isFormControl(control)"
            i18n-afterLabel="Hrs label"
            afterLabel="Hrs"
            flTrackingLabel="PostProjectBillableHours"
            [control]="control"
            [flMarginBottom]="Margin.XSMALL"
          ></fl-input>
        </ng-container>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./hire-me-deloitte-billing-details.component.scss'],
})
export class HireMeDeloitteBillingDetailsComponent {
  TextSize = TextSize;
  HeadingType = HeadingType;
  HeadingColor = HeadingColor;
  FontColor = FontColor;
  FontWeight = FontWeight;
  InputType = InputType;
  Margin = Margin;
  IconColor = IconColor;
  IconSize = IconSize;
  isFormControl = isFormControl;
  HoverColor = HoverColor;
  DeloitteProjectPostField = DeloitteProjectPostField;

  expanded = true;

  @Input() isResponsive = false;
  @Input() hireMeFormGroup: FormGroup;

  handleExpand() {
    this.expanded = !this.expanded;
  }
}
