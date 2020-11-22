import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProjectViewProject } from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';
import { ProjectTypeApi } from 'api-typings/projects/projects';
import {
  BidListFilters,
  CountryCount,
  ExamCount,
  UserReviewsSlider,
} from '../../bid-list-filtering-wrapper.types';
import { BidMoreFiltersContentComponent } from '../bid-more-filters-content/bid-more-filters-content.component';

@Component({
  template: `
    <fl-bit flTrackingSection="MoreFiltersModal">
      <fl-bit class="MoreFiltersClose">
        <fl-bit class="MoreFiltersClose-wrapper">
          <fl-icon
            class="MoreFiltersClose-icon"
            flTrackingLabel="MoreFiltersCloseButton"
            [name]="'ui-close'"
            [color]="IconColor.MID"
            [size]="IconSize.SMALL"
            [clickable]="true"
            (click)="closeModal()"
          ></fl-icon>
        </fl-bit>
      </fl-bit>
      <fl-bit class="MoreFiltersModal">
        <fl-heading
          i18n="More filters modal title"
          [headingType]="HeadingType.H1"
          [size]="TextSize.LARGE"
          [flMarginBottom]="Margin.MID"
        >
          More Filters
        </fl-heading>
        <fl-bit [flMarginBottom]="Margin.XLARGE">
          <app-bid-more-filters-content
            #moreFiltersContent
            [filtersGroup]="filtersGroup"
            [countryCount]="countryCount"
            [userReviewsSlider]="userReviewsSlider"
            [isModal]="true"
            [project]="project"
            [exams]="exams"
            (filterChanged)="handleFilterChanged()"
          ></app-bid-more-filters-content>
        </fl-bit>
        <fl-bit class="MoreFiltersActions">
          <fl-button
            i18n="Clear more filters button"
            flTrackingLabel="ClearMoreFiltersButton"
            [color]="ButtonColor.DEFAULT"
            [size]="ButtonSize.SMALL"
            (click)="clearMoreFilters()"
          >
            Clear
          </fl-button>
          <fl-button
            i18n="Show results button"
            flTrackingLabel="ShowResultsButton"
            [color]="ButtonColor.SECONDARY"
            [size]="ButtonSize.SMALL"
            (click)="closeModal()"
          >
            Show Results
          </fl-button>
        </fl-bit>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./bid-more-filters-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BidMoreFiltersModalComponent {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  HeadingType = HeadingType;
  IconColor = IconColor;
  IconSize = IconSize;
  Margin = Margin;
  TextSize = TextSize;

  @Input() filtersGroup: FormGroup;
  @Input() countryCount: ReadonlyArray<CountryCount>;
  @Input() userReviewsSlider: UserReviewsSlider;
  @Input() project: ProjectViewProject;
  @Input() exams: ReadonlyArray<ExamCount>;

  @ViewChild('moreFiltersContent')
  moreFiltersContent: BidMoreFiltersContentComponent;

  isFilterChanged = false;

  constructor(private modalRef: ModalRef<BidMoreFiltersModalComponent>) {}

  closeModal() {
    this.modalRef.close(this.isFilterChanged);
  }

  handleFilterChanged() {
    this.isFilterChanged = true;
  }

  clearMoreFilters() {
    if (this.project.type === ProjectTypeApi.FIXED || this.project.local) {
      const jobsCompletedControl = this.filtersGroup.get(
        BidListFilters.USER_JOB_COMPLETION,
      );
      if (!jobsCompletedControl) {
        throw new Error('Jobs Completed Control not found');
      }
      jobsCompletedControl.setValue(0);
    }

    const reviewsMinControl = this.filtersGroup.get(
      BidListFilters.USER_REVIEWS_MIN,
    );
    if (!reviewsMinControl) {
      throw new Error('Reviews min Control not found');
    }

    const hiddenFreelancersConrol = this.filtersGroup.get(
      BidListFilters.USER_HIDDEN,
    );
    if (!hiddenFreelancersConrol) {
      throw new Error('Hidden freelancers Control not found');
    }

    const bidRatingControl = this.filtersGroup.get(BidListFilters.BID_RATING);
    if (!bidRatingControl) {
      throw new Error('Bid rating Control not found');
    }

    const onlineOfflineControl = this.filtersGroup.get(
      BidListFilters.USER_ONLINE,
    );
    if (!onlineOfflineControl) {
      throw new Error('Online offline Control not found');
    }

    const preferredFreelancersControl = this.filtersGroup.get(
      BidListFilters.PREFERRED_FREELANCERS,
    );
    if (!preferredFreelancersControl) {
      throw new Error('Preferred freelancers Control not found');
    }

    const freelancerPortfolioControl = this.filtersGroup.get(
      BidListFilters.USER_PORTFOLIO,
    );
    if (!freelancerPortfolioControl) {
      throw new Error('Freelancer portfolio Control not found');
    }

    reviewsMinControl.setValue(this.userReviewsSlider.minValue);
    hiddenFreelancersConrol.setValue(false);
    bidRatingControl.setValue(0);
    onlineOfflineControl.setValue(false);
    preferredFreelancersControl.setValue(false);
    freelancerPortfolioControl.setValue(false);
    this.moreFiltersContent.reset();
  }
}
