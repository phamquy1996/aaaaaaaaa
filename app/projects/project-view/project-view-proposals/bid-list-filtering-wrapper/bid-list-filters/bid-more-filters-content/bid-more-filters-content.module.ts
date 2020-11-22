import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@freelancer/components';
import { UiModule } from '@freelancer/ui/ui.module';
import { BidCountryFilterModule } from '../bid-country-filter/bid-country-filter.module';
import { BidExamsTakenFilterModule } from '../bid-exams-taken-filter/bid-exams-taken-filter.module';
import { BidFreelancerPortfolioFilterComponent } from '../bid-freelancer-portfolio-filter/bid-freelancer-portfolio-filter.component';
import { BidHiddenFreelancersFilterComponent } from '../bid-hidden-freelancers-filter/bid-hidden-freelancers-filter.component';
import { BidJobCompletionFilterModule } from '../bid-job-completion-filter/bid-job-completion-filter.module';
import { BidOnlineOfflineFilterComponent } from '../bid-online-offline-filter/bid-online-offline-filter.component';
import { BidPreferredFreelancersFilterComponent } from '../bid-preferred-freelancers-filter/bid-preferred-freelancers-filter.component';
import { BidRatingFilterComponent } from '../bid-rating-filter/bid-rating-filter.component';
import { BidReviewsFilterComponent } from '../bid-reviews-filter/bid-reviews-filter.component';
import { BidMoreFiltersContentComponent } from './bid-more-filters-content.component';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    ComponentsModule,
    BidCountryFilterModule,
    BidJobCompletionFilterModule,
    BidExamsTakenFilterModule,
  ],
  declarations: [
    BidFreelancerPortfolioFilterComponent,
    BidHiddenFreelancersFilterComponent,
    BidMoreFiltersContentComponent,
    BidOnlineOfflineFilterComponent,
    BidPreferredFreelancersFilterComponent,
    BidRatingFilterComponent,
    BidReviewsFilterComponent,
  ],
  exports: [BidMoreFiltersContentComponent],
})
export class BidMoreFiltersContentModule {}
