import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FilterArrayItem } from '@freelancer/search-filters';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { SliderLabelPosition } from '@freelancer/ui/slider';
import { FontWeight, TextSize } from '@freelancer/ui/text';
import { isFormControl } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { ChecklistOption } from '../search-checklist-filter/search-checklist-filter.component';
import { ProjectFilters } from '../search.model';

@Component({
  selector: 'app-search-filters-projects',
  template: `
    <fl-sticky-footer-wrapper flTrackingSection="SearchProjectsFilters">
      <fl-sticky-footer-body>
        <ng-container
          *flModalTitle
          i18n="Heading for search projects filters on mobile"
        >
          Filters
        </ng-container>
        <fl-heading
          i18n="Heading for search projects filters"
          [flHideMobile]="true"
          [flMarginBottom]="Margin.SMALL"
          [headingType]="HeadingType.H2"
          [size]="TextSize.MID"
        >
          Filters
        </fl-heading>
        <fl-bit [flMarginBottom]="Margin.MID">
          <fl-bit class="FilterLabel" [flMarginBottom]="Margin.XXSMALL">
            <fl-text
              i18n="Project type label"
              [size]="TextSize.SMALL"
              [weight]="FontWeight.BOLD"
            >
              Project type
            </fl-text>
          </fl-bit>
          <app-search-checklist
            [formGroup]="projectTypesChecklistFormGroup"
            [options$]="projectTypesChecklistOptions$"
          >
          </app-search-checklist>
        </fl-bit>
        <fl-bit [flMarginBottom]="Margin.MID">
          <fl-bit class="FilterLabel" [flMarginBottom]="Margin.XXSMALL">
            <fl-text
              i18n="Skills label"
              [size]="TextSize.SMALL"
              [weight]="FontWeight.BOLD"
            >
              Skills
            </fl-text>
          </fl-bit>
          <app-search-checklist-filter
            i18n-placeholder="Skills filter placeholder"
            placeholder="Search skills"
            [checklistOptions$]="skillsChecklistOptions$"
            [dropdownOptions$]="skillsDropdownOptions$"
            [formGroup]="skillsChecklistFormGroup"
            (dropdownSelect)="skillsDropdownSelect.emit($event)"
          ></app-search-checklist-filter>
        </fl-bit>
        <fl-bit [flMarginBottom]="Margin.MID">
          <fl-bit class="FilterLabel" [flMarginBottom]="Margin.XXSMALL">
            <fl-text
              i18n="Listing type label"
              [size]="TextSize.SMALL"
              [weight]="FontWeight.BOLD"
            >
              Listing type
            </fl-text>
          </fl-bit>
          <app-search-checklist
            [formGroup]="upgradesChecklistFormGroup"
            [options$]="upgradesChecklistOptions$"
          ></app-search-checklist>
        </fl-bit>
        <fl-bit [flMarginBottom]="Margin.MID">
          <fl-bit class="FilterLabel" [flMarginBottom]="Margin.XXSMALL">
            <fl-text
              i18n="Location label"
              [size]="TextSize.SMALL"
              [weight]="FontWeight.BOLD"
            >
              Location
            </fl-text>
          </fl-bit>
          <ng-container *ngIf="filters.get(ProjectFilters.LOCATION) as control">
            <fl-location-input
              *ngIf="isFormControl(control)"
              flTrackingLabel="LocationFilter"
              [control]="control"
              [detectLocation]="true"
            ></fl-location-input>
          </ng-container>
        </fl-bit>
        <fl-bit class="FilterLabel" [flMarginBottom]="Margin.XXSMALL">
          <fl-text
            i18n="Languages label"
            [size]="TextSize.SMALL"
            [weight]="FontWeight.BOLD"
          >
            Languages
          </fl-text>
        </fl-bit>
        <app-search-checklist-filter
          i18n-placeholder="Languages filter placeholder"
          placeholder="Search languages"
          [checklistOptions$]="languagesChecklistOptions$"
          [dropdownOptions$]="languagesDropdownOptions$"
          [formGroup]="languagesChecklistFormGroup"
          (dropdownSelect)="languagesDropdownSelect.emit($event)"
        ></app-search-checklist-filter>
      </fl-sticky-footer-body>
      <fl-sticky-footer [flShowMobile]="true">
        <fl-bit class="FiltersFooter">
          <fl-button
            flTrackingLabel="SeeResultsButton"
            i18n="See results button"
            [color]="ButtonColor.SECONDARY"
            [display]="'block'"
            (click)="handleHideFilters()"
          >
            See results
          </fl-button>
        </fl-bit>
      </fl-sticky-footer>
    </fl-sticky-footer-wrapper>
  `,
  styleUrls: ['./search-filters-projects.component.scss'],
})
export class SearchFiltersProjectsComponent {
  ButtonColor = ButtonColor;
  FontWeight = FontWeight;
  HeadingType = HeadingType;
  isFormControl = isFormControl;
  Margin = Margin;
  ProjectFilters = ProjectFilters;
  SliderLabelPosition = SliderLabelPosition;
  TextSize = TextSize;

  @Input() filters: FormGroup;
  @Input() languagesChecklistFormGroup: FormGroup;
  @Input() languagesChecklistOptions$: Rx.Observable<
    ReadonlyArray<ChecklistOption>
  >;
  @Input() languagesDropdownOptions$: Rx.Observable<
    ReadonlyArray<ChecklistOption>
  >;
  @Input() projectTypesChecklistFormGroup: FormGroup;
  @Input() projectTypesChecklistOptions$: Rx.Observable<
    ReadonlyArray<ChecklistOption>
  >;
  @Input() skillsChecklistFormGroup: FormGroup;
  @Input() skillsChecklistOptions$: Rx.Observable<
    ReadonlyArray<ChecklistOption>
  >;
  @Input() skillsDropdownOptions$: Rx.Observable<
    ReadonlyArray<ChecklistOption>
  >;
  @Input() upgradesChecklistFormGroup: FormGroup;
  @Input() upgradesChecklistOptions$: Rx.Observable<
    ReadonlyArray<ChecklistOption>
  >;

  @Output() hideFilters = new EventEmitter<void>();
  @Output() languagesDropdownSelect = new EventEmitter<
    FilterArrayItem['value']
  >();
  @Output() skillsDropdownSelect = new EventEmitter<FilterArrayItem['value']>();

  handleHideFilters() {
    this.hideFilters.emit();
  }
}
