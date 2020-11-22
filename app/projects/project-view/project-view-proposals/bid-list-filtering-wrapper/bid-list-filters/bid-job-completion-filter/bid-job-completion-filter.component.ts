import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ProjectViewProject } from '@freelancer/datastore/collections';
import { LinkColor, LinkUnderline } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { SliderLabelPosition } from '@freelancer/ui/slider';
import { FontWeight, TextAlign, TextSize } from '@freelancer/ui/text';
import { isFormControl } from '@freelancer/utils';
import { ProjectTypeApi } from 'api-typings/projects/projects';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';
import { BidListFilters } from '../../bid-list-filtering-wrapper.types';

@Component({
  selector: 'app-bid-job-completion-filter',
  template: `
    <fl-dropdown-filter
      *ngIf="isProjectHourly && !project.local && !isModal"
      buttonText="Jobs Completed"
      buttonTextApplied="{{ minControl.value }}% Jobs Completed"
      i18n-buttonText="Bid list project completion filter"
      i18n-buttonTextApplied="Bid list project completion filter"
      [edgeToEdge]="true"
      [filterApplied]="filterApplied$ | async"
      [flHideMobile]="true"
      [flMarginRight]="Margin.XXSMALL"
      [hideDropdownIcon]="true"
      [iconLabel]="'ui-percentage'"
    >
      <fl-bit class="JobCompletionDropdownContent">
        <fl-bit
          class="JobCompletionDropdownContent-header"
          [flMarginBottom]="Margin.XXSMALL"
        >
          <fl-text
            i18n="Project completion filter title"
            [size]="TextSize.SMALL"
            [weight]="FontWeight.MEDIUM"
          >
            Jobs completed rate
          </fl-text>
          <fl-link
            class="ClearCta"
            flTrackingLabel="ProjectCompletionFilterClear"
            i18n="Clear project completion filter"
            [size]="TextSize.SMALL"
            [disabled]="!(filterApplied$ | async)"
            [underline]="LinkUnderline.NEVER"
            [weight]="FontWeight.BOLD"
            (click)="clear()"
          >
            Clear
          </fl-link>
        </fl-bit>
        <fl-text class="JobCompletionDropdownContent-subtext">
          <fl-icon
            [flMarginRight]="Margin.XXSMALL"
            [name]="'ui-percentage'"
          ></fl-icon>
          <ng-container
            *ngIf="minControl.value > 0; else anyLabel"
            i18n="Jobs completed filter subtext"
          >
            <ng-container *ngIf="minControl.value !== 100">
              At least
            </ng-container>
            {{ minControl.value }}% jobs completed
          </ng-container>
        </fl-text>
        <fl-slider
          *ngIf="isFormControl(minControl)"
          class="JobCompletionSlider"
          flTrackingLabel="BidProjectCompletionFilterSlider"
          [labelPosition]="SliderLabelPosition.NONE"
          [minValue]="sliderMinValue"
          [maxValue]="sliderMaxValue"
          [minControl]="minControl"
          (mousedown)="filterChanged.emit()"
        ></fl-slider>
        <fl-text [textAlign]="TextAlign.CENTER">
          <ng-container
            *ngIf="minControl.value > 0; else anyLabel"
            i18n="Jobs completed filter slider label"
          >
            <ng-container *ngIf="minControl.value !== 100">
              At least
            </ng-container>
            {{ minControl.value }}%
          </ng-container>
        </fl-text>
      </fl-bit>
    </fl-dropdown-filter>

    <fl-bit [flShowMobile]="true" [flMarginBottom]="Margin.MID">
      <fl-text
        i18n="Project completion filter title"
        [weight]="FontWeight.MEDIUM"
        [size]="TextSize.SMALL"
      >
        Jobs completed rate
      </fl-text>
      <fl-slider
        *ngIf="isFormControl(minControl)"
        class="JobCompletionSlider"
        flTrackingLabel="BidProjectCompletionFilterSlider"
        [labelPosition]="SliderLabelPosition.NONE"
        [minValue]="sliderMinValue"
        [maxValue]="sliderMaxValue"
        [minControl]="minControl"
        (mousedown)="filterChanged.emit()"
      ></fl-slider>
      <fl-text [textAlign]="TextAlign.CENTER">
        <ng-container
          *ngIf="minControl.value > 0; else anyLabel"
          i18n="Jobs completed filter slider label"
        >
          <ng-container *ngIf="minControl.value !== 100">
            At least
          </ng-container>
          {{ minControl.value }}%
        </ng-container>
      </fl-text>
    </fl-bit>
    <fl-hr [flShowMobile]="true" [flMarginBottom]="Margin.MID"></fl-hr>

    <fl-grid
      *ngIf="(!isProjectHourly || project.local) && isModal"
      [flHideMobile]="true"
      [flMarginBottom]="Margin.MID"
    >
      <fl-col [col]="6">
        <fl-text
          i18n="Bid jobs completed filter"
          [weight]="FontWeight.MEDIUM"
          [size]="TextSize.SMALL"
        >
          Jobs completed rate
        </fl-text>
      </fl-col>
      <fl-col [col]="6">
        <fl-slider
          *ngIf="isFormControl(minControl)"
          class="JobCompletionSlider"
          flTrackingLabel="BidProjectCompletionFilterSlider"
          [labelPosition]="SliderLabelPosition.NONE"
          [minValue]="sliderMinValue"
          [maxValue]="sliderMaxValue"
          [minControl]="minControl"
          (mousedown)="filterChanged.emit()"
        ></fl-slider>
        <fl-text [size]="TextSize.SMALL" [textAlign]="TextAlign.CENTER">
          <ng-container
            *ngIf="minControl.value > 0; else anyLabel"
            i18n="Jobs completed filter slider subtext"
          >
            <ng-container *ngIf="minControl.value !== 100">
              At least
            </ng-container>
            {{ minControl.value }}% jobs completed
          </ng-container>
        </fl-text>
      </fl-col>
    </fl-grid>
    <fl-hr
      *ngIf="(!isProjectHourly || project.local) && isModal"
      [flHideMobile]="true"
      [flMarginBottom]="Margin.MID"
    ></fl-hr>

    <ng-template #anyLabel>
      <ng-container i18n="Any label">Any</ng-container>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./bid-job-completion-filter.component.scss'],
})
export class BidJobCompletionFilterComponent implements OnInit {
  FontWeight = FontWeight;
  isFormControl = isFormControl;
  LinkColor = LinkColor;
  LinkUnderline = LinkUnderline;
  Margin = Margin;
  SliderLabelPosition = SliderLabelPosition;
  TextAlign = TextAlign;
  TextSize = TextSize;

  @Input() group: FormGroup;
  @Input() project: ProjectViewProject;
  @Input() isModal = false;
  @Output() filterChanged = new EventEmitter();

  sliderMinValue = 0;
  sliderMaxValue = 100;
  filterApplied$: Rx.Observable<boolean>;
  minControl: AbstractControl;
  isProjectHourly: boolean;

  ngOnInit() {
    const minControl = this.group.get(BidListFilters.USER_JOB_COMPLETION);
    if (!minControl) {
      throw new Error('Min Control not found');
    }
    this.minControl = minControl;

    this.filterApplied$ = minControl.valueChanges.pipe(
      map(minCurrent => minCurrent > this.sliderMinValue),
    );

    this.isProjectHourly = this.project.type === ProjectTypeApi.HOURLY;
  }

  clear() {
    this.minControl.setValue(0);
    this.filterChanged.emit();
  }
}
