import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AmountRange } from '@freelancer/pipes';
import { FilterArrayItem } from '@freelancer/search-filters';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { IconSize } from '@freelancer/ui/icon';
import { InputType } from '@freelancer/ui/input';
import { Margin } from '@freelancer/ui/margin';
import { SliderLabelPosition } from '@freelancer/ui/slider';
import { FontWeight, TextAlign, TextSize } from '@freelancer/ui/text';
import { ToggleSize } from '@freelancer/ui/toggle';
import { TooltipPosition } from '@freelancer/ui/tooltip';
import { isFormControl, isNumeric } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { ChecklistOption } from '../search-checklist-filter/search-checklist-filter.component';
import {
  HourlyRateFilterRange,
  ReviewCountFilterRange,
  UserFilters,
} from '../search.model';

@Component({
  selector: 'app-search-filters-users',
  template: `
    <fl-sticky-footer-wrapper flTrackingSection="SearchUsersFilters">
      <fl-sticky-footer-body>
        <ng-container
          *flModalTitle
          i18n="Heading for search users filters on mobile"
        >
          Filters
        </ng-container>
        <fl-heading
          i18n="Heading for search users filters"
          [flHideMobile]="true"
          [flMarginBottom]="Margin.SMALL"
          [headingType]="HeadingType.H2"
          [size]="TextSize.MID"
        >
          Filters
        </fl-heading>
        <fl-bit *ngIf="skillsChecklistOptions$" [flMarginBottom]="Margin.SMALL">
          <fl-text
            i18n="Skills label"
            [flMarginBottom]="Margin.XXSMALL"
            [size]="TextSize.SMALL"
            [weight]="FontWeight.BOLD"
          >
            Skills
          </fl-text>
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
          <fl-text
            i18n="Hourly rate label"
            [flMarginBottom]="Margin.XXSMALL"
            [size]="TextSize.SMALL"
            [weight]="FontWeight.BOLD"
          >
            Hourly rate
          </fl-text>
          <ng-container
            *ngIf="filters.get(UserFilters.HOURLY_RATE_MAX) as maxControl"
          >
            <ng-container
              *ngIf="filters.get(UserFilters.HOURLY_RATE_MIN) as minControl"
            >
              <fl-slider
                *ngIf="isFormControl(maxControl) && isFormControl(minControl)"
                class="SearchFiltersContent-slider"
                [currencyCode]="'USD'"
                [labelPosition]="SliderLabelPosition.NONE"
                [maxControl]="maxControl"
                [maxValue]="HourlyRateFilterRange.MAXIMUM"
                [minControl]="minControl"
                [minValue]="HourlyRateFilterRange.MINIMUM"
              >
              </fl-slider>
            </ng-container>
          </ng-container>
          <fl-text
            *ngIf="hourlyRate$ | async as hourlyRate"
            [textAlign]="TextAlign.CENTER"
          >
            <ng-container
              *ngIf="
                hourlyRate.maximum < HourlyRateFilterRange.MAXIMUM;
                else showPlusSign
              "
            >
              {{ hourlyRate | flCurrency: 'USD':false:false }}
            </ng-container>
            <ng-template #showPlusSign>
              {{ hourlyRate | flCurrency: 'USD':false:false }}+
            </ng-template>
          </fl-text>
        </fl-bit>
        <fl-bit [flMarginBottom]="Margin.MID">
          <fl-text
            i18n="Location label"
            [flMarginBottom]="Margin.XXSMALL"
            [size]="TextSize.SMALL"
            [weight]="FontWeight.BOLD"
          >
            Location
          </fl-text>
          <ng-container *ngIf="filters.get(UserFilters.LOCATION) as control">
            <fl-location-input
              *ngIf="isFormControl(control)"
              flTrackingLabel="LocationFilter"
              [control]="control"
              [detectLocation]="true"
            ></fl-location-input>
          </ng-container>
        </fl-bit>
        <fl-bit *ngIf="isLoggedIn$ | async" [flMarginBottom]="Margin.MID">
          <fl-text
            i18n="Online freelancers label"
            [flMarginBottom]="Margin.XXSMALL"
            [size]="TextSize.SMALL"
            [weight]="FontWeight.BOLD"
          >
            Online
          </fl-text>
          <fl-bit class="SearchFiltersContent-onlineGroup">
            <ng-container *ngIf="filters.get(UserFilters.ONLINE) as control">
              <fl-toggle
                *ngIf="isFormControl(control)"
                flTrackingLabel="OnlineToggle"
                [control]="control"
                [size]="ToggleSize.MID"
              ></fl-toggle>
            </ng-container>
            <fl-text i18n="Online freelancers label">
              Online freelancers only
            </fl-text>
          </fl-bit>
        </fl-bit>
        <ng-container>
          <fl-text
            i18n="Rating label"
            [flMarginBottom]="Margin.XXSMALL"
            [size]="TextSize.SMALL"
            [weight]="FontWeight.BOLD"
          >
            Rating
          </fl-text>
          <fl-bit
            class="SearchFiltersContent-ratingGroup"
            [flMarginBottom]="Margin.MID"
          >
            <ng-container *ngIf="filters.get(UserFilters.RATING) as control">
              <fl-rating
                *ngIf="isFormControl(control)"
                flTrackingLabel="RatingFilter"
                [control]="control"
                [flMarginRight]="Margin.XSMALL"
                [hideValue]="true"
                (hoverValueChange)="handleHoverValueChange($event)"
              ></fl-rating>
            </ng-container>
            <ng-container
              *ngIf="
                ratingHoverValue ||
                filters.get(UserFilters.RATING)?.value as labelValue
              "
            >
              <fl-text
                *ngIf="labelValue < 5"
                i18n="Star rating label for 1 to 4 stars"
              >
                {{ labelValue }} and up
              </fl-text>
              <fl-text
                *ngIf="labelValue === 5"
                i18n="Star rating label for 5 stars"
              >
                5 stars
              </fl-text>
            </ng-container>
          </fl-bit>
        </ng-container>
        <fl-bit [flMarginBottom]="Margin.SMALL">
          <fl-text
            i18n="Review count label"
            [flMarginBottom]="Margin.XXSMALL"
            [size]="TextSize.SMALL"
            [weight]="FontWeight.BOLD"
          >
            Reviews
          </fl-text>
          <ng-container
            *ngIf="filters.get(UserFilters.REVIEW_COUNT_MAX) as maxControl"
          >
            <ng-container
              *ngIf="filters.get(UserFilters.REVIEW_COUNT_MIN) as minControl"
            >
              <fl-slider
                *ngIf="isFormControl(maxControl) && isFormControl(minControl)"
                class="SearchFiltersContent-slider"
                [labelPosition]="SliderLabelPosition.NONE"
                [maxControl]="maxControl"
                [maxValue]="ReviewCountFilterRange.MAXIMUM"
                [minControl]="minControl"
                [minValue]="ReviewCountFilterRange.MINIMUM"
              >
              </fl-slider>
            </ng-container>
          </ng-container>
          <fl-text
            *ngIf="reviewCount$ | async as reviewCount"
            [textAlign]="TextAlign.CENTER"
          >
            <ng-container
              *ngIf="reviewCount.maximum < ReviewCountFilterRange.MAXIMUM"
              i18n="
                 Review count range when the range maximum is less than 500
                reviews
              "
            >
              {{ reviewCount.minimum }} - {{ reviewCount.maximum }} reviews
            </ng-container>
            <ng-container
              *ngIf="reviewCount.maximum === ReviewCountFilterRange.MAXIMUM"
              i18n="
                 Review count range when the range maximum amounts to 500
                reviews
              "
            >
              {{ reviewCount.minimum }} - {{ reviewCount.maximum }}+ reviews
            </ng-container>
          </fl-text>
        </fl-bit>
        <ng-container>
          <fl-bit
            class="SearchFiltersContent-examsLabel"
            [flMarginBottom]="Margin.XXSMALL"
          >
            <fl-text
              i18n="Exams label"
              [size]="TextSize.SMALL"
              [weight]="FontWeight.BOLD"
            >
              Exams
            </fl-text>
            <fl-tooltip
              class="SearchFiltersContent-examsLabel-tooltip"
              i18n-message="Exams filter tooltip message"
              message="Certified by Freelancer to pass competency tests in these topics"
              [position]="TooltipPosition.END_CENTER"
            >
              <fl-icon [name]="'ui-help'" [size]="IconSize.SMALL"></fl-icon>
            </fl-tooltip>
          </fl-bit>
          <app-search-checklist-filter
            i18n-placeholder="Exams filter placeholder"
            placeholder="Search exams"
            [checklistOptions$]="examsChecklistOptions$"
            [dropdownOptions$]="examsDropdownOptions$"
            [flMarginBottom]="Margin.XXXXLARGE"
            [flMarginBottomTablet]="Margin.NONE"
            [formGroup]="examsChecklistFormGroup"
            (dropdownSelect)="examsDropdownSelect.emit($event)"
          ></app-search-checklist-filter>
        </ng-container>
      </fl-sticky-footer-body>
      <fl-sticky-footer [flShowMobile]="true">
        <fl-bit class="SearchFiltersContent-mobileFooter">
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
  styleUrls: ['./search-filters-users.component.scss'],
})
export class SearchFiltersUsersComponent implements OnInit {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  FontWeight = FontWeight;
  HeadingType = HeadingType;
  HourlyRateFilterRange = HourlyRateFilterRange;
  IconSize = IconSize;
  InputType = InputType;
  isFormControl = isFormControl;
  Margin = Margin;
  ReviewCountFilterRange = ReviewCountFilterRange;
  SliderLabelPosition = SliderLabelPosition;
  TextAlign = TextAlign;
  TextSize = TextSize;
  ToggleSize = ToggleSize;
  TooltipPosition = TooltipPosition;
  UserFilters = UserFilters;

  defaultExamsFilterOptions$: Rx.Observable<ReadonlyArray<ChecklistOption>>;
  defaultSkillIds: ReadonlyArray<string>;
  defaultSkillsFilterOptions$: Rx.Observable<ReadonlyArray<ChecklistOption>>;
  examsFilterOptions$: Rx.Observable<ReadonlyArray<ChecklistOption>>;
  hourlyRate$: Rx.Observable<Required<AmountRange>>;
  ratingHoverValue: number;
  reviewCount$: Rx.Observable<Required<AmountRange>>;
  skillsFilterOptions$: Rx.Observable<ReadonlyArray<ChecklistOption>>;

  @Input() examsChecklistFormGroup: FormGroup;
  @Input() examsChecklistOptions$: Rx.Observable<
    ReadonlyArray<ChecklistOption>
  >;
  @Input() examsDropdownOptions$: Rx.Observable<ReadonlyArray<ChecklistOption>>;
  @Input() filters: FormGroup;
  @Input() isLoggedIn$: Rx.Observable<boolean>;
  @Input() skillsChecklistFormGroup?: FormGroup;
  @Input() skillsChecklistOptions$?: Rx.Observable<
    ReadonlyArray<ChecklistOption>
  >;
  @Input() skillsDropdownOptions$?: Rx.Observable<
    ReadonlyArray<ChecklistOption>
  >;

  @Output() examsDropdownSelect = new EventEmitter<FilterArrayItem['value']>();
  @Output() hideFilters = new EventEmitter<void>();
  @Output() skillsDropdownSelect = new EventEmitter<FilterArrayItem['value']>();

  ngOnInit() {
    this.hourlyRate$ = Rx.combineLatest([
      this.filters.controls[UserFilters.HOURLY_RATE_MAX].valueChanges.pipe(
        startWith(this.filters.controls[UserFilters.HOURLY_RATE_MAX].value),
        filter(isNumeric),
      ),
      this.filters.controls[UserFilters.HOURLY_RATE_MIN].valueChanges.pipe(
        startWith(this.filters.controls[UserFilters.HOURLY_RATE_MIN].value),
        filter(isNumeric),
      ),
    ]).pipe(
      map(([maximum, minimum]) => ({ maximum, minimum })),
      distinctUntilChanged(),
    );

    this.reviewCount$ = Rx.combineLatest([
      this.filters.controls[UserFilters.REVIEW_COUNT_MAX].valueChanges.pipe(
        startWith(this.filters.controls[UserFilters.REVIEW_COUNT_MAX].value),
        filter(isNumeric),
      ),
      this.filters.controls[UserFilters.REVIEW_COUNT_MIN].valueChanges.pipe(
        startWith(this.filters.controls[UserFilters.REVIEW_COUNT_MIN].value),
        filter(isNumeric),
      ),
    ]).pipe(
      map(([maximum, minimum]) => ({ maximum, minimum })),
      distinctUntilChanged(),
    );
  }

  handleHideFilters() {
    this.hideFilters.emit();
  }

  handleHoverValueChange(value: number) {
    this.ratingHoverValue = value;
  }
}
