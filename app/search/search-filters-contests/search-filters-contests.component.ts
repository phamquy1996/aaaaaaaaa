import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FilterArrayItem } from '@freelancer/search-filters';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { FontWeight, TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { ChecklistOption } from '../search-checklist-filter/search-checklist-filter.component';

@Component({
  selector: 'app-search-filters-contests',
  template: `
    <fl-sticky-footer-wrapper flTrackingSection="SearchContestsFilters">
      <fl-sticky-footer-body>
        <ng-container
          *flModalTitle
          i18n="Heading for search contests filters on mobile"
        >
          Filters
        </ng-container>
        <fl-bit
          class="FilterLabel"
          [flHideMobile]="true"
          [flMarginBottom]="Margin.SMALL"
        >
          <fl-heading
            i18n="Heading for search contests filters"
            [headingType]="HeadingType.H2"
            [size]="TextSize.MID"
          >
            Filters
          </fl-heading>
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
      </fl-sticky-footer-body>
      <fl-sticky-footer [flShowMobile]="true">
        <fl-bit class="FiltersFooter">
          <fl-button
            flTrackingLabel="SeeResultsButton"
            i18n="See results button"
            [color]="ButtonColor.SECONDARY"
            [display]="'block'"
            (click)="hideFilters.emit()"
          >
            See results
          </fl-button>
        </fl-bit>
      </fl-sticky-footer>
    </fl-sticky-footer-wrapper>
  `,
  styleUrls: ['./search-filters-contests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFiltersContestsComponent {
  ButtonColor = ButtonColor;
  FontWeight = FontWeight;
  HeadingType = HeadingType;
  Margin = Margin;
  TextSize = TextSize;

  @Input() filters: FormGroup;
  @Input() skillsChecklistFormGroup: FormGroup;
  @Input() skillsChecklistOptions$: Rx.Observable<
    ReadonlyArray<ChecklistOption>
  >;
  @Input() skillsDropdownOptions$: Rx.Observable<
    ReadonlyArray<ChecklistOption>
  >;

  @Output() hideFilters = new EventEmitter<void>();
  @Output() skillsDropdownSelect = new EventEmitter<FilterArrayItem['value']>();
}
