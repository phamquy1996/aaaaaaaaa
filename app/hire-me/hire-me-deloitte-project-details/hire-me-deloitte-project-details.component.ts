import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  BUSINESS_LINE_OPTIONS,
  DeloitteProjectPostField,
  DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP,
  DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP,
  INDUSTRY_GROUP_OPTIONS,
  OFFERING_OPTIONS,
  PRACTICE_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  UTILIZATION_OPTIONS,
} from '@freelancer/datastore/collections';
import { HeadingColor, HeadingType } from '@freelancer/ui/heading';
import { HoverColor, IconColor, IconSize } from '@freelancer/ui/icon';
import { InputType } from '@freelancer/ui/input';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';
import { isFormControl } from '@freelancer/utils';
import {
  DeloitteIndustryGroupApi,
  DeloitteOfferingPortfolioApi,
} from 'api-typings/projects/deloitte';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-hire-me-deloitte-project-details',
  template: `
    <fl-hr [flMarginBottom]="Margin.SMALL"></fl-hr>
    <fl-bit class="ProjectDetailsHeadingWrapper">
      <fl-heading
        i18n="Project Details title"
        [color]="HeadingColor.LIGHT"
        [headingType]="HeadingType.H3"
        [size]="TextSize.SMALL"
        [flMarginBottom]="Margin.XSMALL"
      >
        Project details
      </fl-heading>
      <fl-button
        flTrackingLabel="expandBillingDetails"
        (click)="handleExpand()"
      >
        <fl-icon
          *ngIf="expanded"
          name="ui-chevron-down"
          label="Collapse"
          i18n-label="Project details collapse icon"
          [color]="IconColor.MID"
          [size]="IconSize.SMALL"
          [hoverColor]="HoverColor.PRIMARY"
        ></fl-icon>
        <fl-icon
          *ngIf="!expanded"
          name="ui-chevron-right"
          label="Expand"
          i18n-label="Projects details expand icon"
          [color]="IconColor.MID"
          [size]="IconSize.SMALL"
          [hoverColor]="HoverColor.PRIMARY"
        ></fl-icon>
      </fl-button>
    </fl-bit>
    <fl-bit *ngIf="expanded" [ngClass]="{ ResponsiveContainer: isResponsive }">
      <fl-bit class="ResponsiveField">
        <fl-text
          i18n="Hire Me project type label"
          [weight]="FontWeight.BOLD"
          [color]="FontColor.LIGHT"
        >
          Project type
        </fl-text>
        <ng-container
          *ngIf="
            hireMeFormGroup.get(
              DeloitteProjectPostField.PROJECT_TYPE
            ) as control
          "
        >
          <fl-select
            *ngIf="isFormControl(control)"
            i18n-placeholder="Project Type"
            flTrackingLabel="ProjectType"
            placeholder="Please select project type"
            [flMarginBottom]="Margin.XSMALL"
            [control]="control"
            [options]="PROJECT_TYPE_OPTIONS"
          ></fl-select>
        </ng-container>
      </fl-bit>
      <fl-bit class="ResponsiveField">
        <fl-text
          i18n="Hire Me project utilization label"
          [weight]="FontWeight.BOLD"
          [color]="FontColor.LIGHT"
        >
          Utilization
        </fl-text>
        <ng-container
          *ngIf="
            hireMeFormGroup.get(DeloitteProjectPostField.UTILIZATION) as control
          "
        >
          <fl-select
            *ngIf="isFormControl(control)"
            i18n-placeholder="Project Utilization"
            flTrackingLabel="ProjectUtilization"
            placeholder="Please select utilization"
            [flMarginBottom]="Margin.XSMALL"
            [control]="control"
            [options]="UTILIZATION_OPTIONS"
          ></fl-select>
        </ng-container>
      </fl-bit>
      <fl-bit class="ResponsiveField">
        <fl-text
          i18n="Hire Me business line label"
          [weight]="FontWeight.BOLD"
          [color]="FontColor.LIGHT"
        >
          Business line
        </fl-text>
        <ng-container
          *ngIf="
            hireMeFormGroup.get(
              DeloitteProjectPostField.BUSINESS_LINE
            ) as control
          "
        >
          <fl-select
            *ngIf="isFormControl(control)"
            i18n-placeholder="Project Business line"
            flTrackingLabel="ProjectBusinessLine"
            placeholder="Please select business line"
            [flMarginBottom]="Margin.XSMALL"
            [control]="control"
            [options]="BUSINESS_LINE_OPTIONS"
          ></fl-select>
        </ng-container>
      </fl-bit>
      <fl-bit class="ResponsiveField">
        <fl-text
          i18n="Hire Me project practice label"
          [weight]="FontWeight.BOLD"
          [color]="FontColor.LIGHT"
        >
          Practice
        </fl-text>
        <ng-container
          *ngIf="
            hireMeFormGroup.get(DeloitteProjectPostField.PRACTICE) as control
          "
        >
          <fl-select
            *ngIf="isFormControl(control)"
            i18n-placeholder="Project Practice"
            flTrackingLabel="ProjectPractice"
            placeholder="Please select project practice"
            [flMarginBottom]="Margin.XSMALL"
            [control]="control"
            [options]="PRACTICE_OPTIONS"
          ></fl-select>
        </ng-container>
      </fl-bit>
      <fl-bit class="ResponsiveField">
        <fl-bit class="PortfolioWrapper">
          <fl-text
            i18n="Hire Me project industry label"
            [weight]="FontWeight.BOLD"
            [color]="FontColor.LIGHT"
          >
            Industry
          </fl-text>
          <fl-text
            *ngIf="selectedIndustryGroup$ | async as selectedIndustryParent"
            i18n="Industry"
            [color]="FontColor.LIGHT"
          >
            {{ selectedIndustryParent }}
          </fl-text>
        </fl-bit>
        <ng-container
          *ngIf="
            hireMeFormGroup.get(
              DeloitteProjectPostField.INDUSTRY_SECTOR
            ) as control
          "
        >
          <fl-select
            *ngIf="isFormControl(control)"
            i18n-placeholder="Project Industry"
            flTrackingLabel="ProjectIndustry"
            placeholder="Please select project industry"
            [flMarginBottom]="Margin.XSMALL"
            [control]="control"
            [options]="INDUSTRY_GROUP_OPTIONS"
          ></fl-select>
        </ng-container>
      </fl-bit>
      <fl-bit class="ResponsiveField">
        <fl-bit class="PortfolioWrapper">
          <fl-text
            i18n="Hire Me project offering label"
            [weight]="FontWeight.BOLD"
            [color]="FontColor.LIGHT"
          >
            Offering
          </fl-text>
          <fl-text
            *ngIf="
              selectedOfferingPortfolio$ | async as selectedOfferingPortfolio
            "
            i18n="Offering portfolio"
            [color]="FontColor.LIGHT"
          >
            {{ selectedOfferingPortfolio }}
          </fl-text>
        </fl-bit>
        <ng-container
          *ngIf="
            hireMeFormGroup.get(
              DeloitteProjectPostField.MARKET_OFFERING
            ) as control
          "
        >
          <fl-select
            *ngIf="isFormControl(control)"
            i18n-placeholder="Select your offering"
            flTrackingLabel="SelectOffering"
            placeholder="Please select project offering"
            [flMarginBottom]="Margin.XSMALL"
            [control]="control"
            [options]="OFFERING_OPTIONS"
          ></fl-select>
        </ng-container>
      </fl-bit>
      <fl-bit class="FixedField">
        <ng-container
          *ngIf="
            hireMeFormGroup.get(
              DeloitteProjectPostField.IS_CLEARANCE_REQUIRED
            ) as clearanceRequiredControl
          "
        >
          <fl-bit [flMarginBottom]="Margin.XSMALL">
            <fl-checkbox
              *ngIf="isFormControl(clearanceRequiredControl)"
              i18n-label="Is clearance required label"
              label="Is a clearance required to complete this specific deliverable (please refer to your work breakdown structure)?"
              flTrackingLabel="isClearanceRequiredCheckbox"
              [control]="clearanceRequiredControl"
            >
            </fl-checkbox>
          </fl-bit>
          <ng-container *ngIf="clearanceRequiredControl.value">
            <ng-container
              *ngIf="
                hireMeFormGroup.get(
                  DeloitteProjectPostField.CLEARANCE
                ) as clearanceControl
              "
            >
              <fl-input
                *ngIf="isFormControl(clearanceControl)"
                placeholder="Specify clearance"
                i18n-placeholder="specify project clearance"
                flTrackingLabel="isClearanceRequiredInput"
                [flMarginBottom]="Margin.XSMALL"
                [control]="clearanceControl"
              ></fl-input>
            </ng-container>
          </ng-container>
        </ng-container>
      </fl-bit>
      <fl-bit
        *ngIf="
          hireMeFormGroup.get(
            DeloitteProjectPostField.IS_SUBJECT_TO_ITAR
          ) as control
        "
        class="FixedField"
        [flMarginBottom]="Margin.MID"
      >
        <fl-checkbox
          *ngIf="isFormControl(control)"
          i18n-label="Is project subject to ITAR label"
          label="
              Is this project subject to the International Traffic in Arms Regulations (ITAR)?
            "
          flTrackingLabel="isSubjectToItarCheckbox"
          [control]="control"
        >
        </fl-checkbox>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./hire-me-deloitte-project-details.component.scss'],
})
export class HireMeDeloitteProjectDetailsComponent implements OnInit {
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
  BUSINESS_LINE_OPTIONS = BUSINESS_LINE_OPTIONS;
  PROJECT_TYPE_OPTIONS = PROJECT_TYPE_OPTIONS;
  PRACTICE_OPTIONS = PRACTICE_OPTIONS;
  INDUSTRY_GROUP_OPTIONS = INDUSTRY_GROUP_OPTIONS;
  OFFERING_OPTIONS = OFFERING_OPTIONS;
  UTILIZATION_OPTIONS = UTILIZATION_OPTIONS;
  DeloitteProjectPostField = DeloitteProjectPostField;

  expanded = true;

  @Input() isResponsive = false;
  @Input() hireMeFormGroup: FormGroup;
  selectedOfferingPortfolio$: Rx.Observable<string | undefined>;
  selectedIndustryGroup$: Rx.Observable<string | undefined>;

  ngOnInit() {
    this.selectedOfferingPortfolio$ = this.hireMeFormGroup.controls[
      DeloitteProjectPostField.OFFERING_PORTFOLIO
    ].valueChanges.pipe(
      map(
        (offeringPortfolio: DeloitteOfferingPortfolioApi) =>
          DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[offeringPortfolio],
      ),
    );

    this.selectedIndustryGroup$ = this.hireMeFormGroup.controls[
      DeloitteProjectPostField.INDUSTRY_GROUP
    ].valueChanges.pipe(
      map(
        (industryGroup: DeloitteIndustryGroupApi) =>
          DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP[industryGroup],
      ),
    );
  }

  handleExpand() {
    this.expanded = !this.expanded;
  }
}
