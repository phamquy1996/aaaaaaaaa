import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProjectViewProject } from '@freelancer/datastore/collections';
import { Margin } from '@freelancer/ui/margin';
import { isFormControl } from '@freelancer/utils';
import {
  BidListFilters,
  CountryCount,
  ExamCount,
  UserReviewsSlider,
} from '../../bid-list-filtering-wrapper.types';
import { BidCountryFilterComponent } from '../bid-country-filter/bid-country-filter.component';
import { BidExamsTakenFilterComponent } from '../bid-exams-taken-filter/bid-exams-taken-filter.component';

@Component({
  selector: 'app-bid-more-filters-content',
  template: `
    <app-bid-reviews-filter
      [group]="filtersGroup"
      [userReviewsSlider]="userReviewsSlider"
      (filterChanged)="filterChanged.emit()"
    ></app-bid-reviews-filter>
    <app-bid-job-completion-filter
      [group]="filtersGroup"
      [project]="project"
      [isModal]="isModal"
      (filterChanged)="filterChanged.emit()"
    ></app-bid-job-completion-filter>
    <app-bid-country-filter
      #countryFilter
      *ngIf="!project.local"
      [countries]="countryCount"
      [group]="filtersGroup"
      (filterChanged)="filterChanged.emit()"
    ></app-bid-country-filter>
    <ng-container
      *ngIf="filtersGroup.get(BidListFilters.USER_EXAM_TAKEN) as control"
    >
      <app-bid-exam-taken-filter
        #examsTakenFilter
        *ngIf="isFormControl(control)"
        [exams]="exams"
        [control]="control"
        (filterChanged)="filterChanged.emit()"
      ></app-bid-exam-taken-filter>
    </ng-container>
    <app-bid-preferred-freelancers-filter
      [group]="filtersGroup"
      (filterChanged)="filterChanged.emit()"
    ></app-bid-preferred-freelancers-filter>
    <app-bid-freelancer-portfolio-filter
      [group]="filtersGroup"
      (filterChanged)="filterChanged.emit()"
    ></app-bid-freelancer-portfolio-filter>
    <app-bid-online-offline-filter
      [group]="filtersGroup"
      (filterChanged)="filterChanged.emit()"
    ></app-bid-online-offline-filter>
    <fl-hr [flMarginBottom]="Margin.MID"></fl-hr>
    <app-bid-rating-filter
      [group]="filtersGroup"
      (filterChanged)="filterChanged.emit()"
    ></app-bid-rating-filter>
    <app-bid-hidden-freelancers-filter
      [group]="filtersGroup"
      (filterChanged)="filterChanged.emit()"
    ></app-bid-hidden-freelancers-filter>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BidMoreFiltersContentComponent {
  BidListFilters = BidListFilters;
  isFormControl = isFormControl;
  Margin = Margin;

  @Input() filtersGroup: FormGroup;
  @Input() userReviewsSlider: UserReviewsSlider;
  @Input() project: ProjectViewProject;
  @Input() countryCount: ReadonlyArray<CountryCount>;
  @Input() isModal = false;
  @Input() exams: ReadonlyArray<ExamCount>;

  @Output() filterChanged = new EventEmitter();

  @ViewChild('countryFilter') countryFilter: BidCountryFilterComponent;
  @ViewChild('examsTakenFilter') examsTakenFilter: BidExamsTakenFilterComponent;

  reset() {
    if (!this.project.local) {
      this.countryFilter.reset();
    }
    this.examsTakenFilter.reset();
  }
}
