import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  DatastoreBidsModule,
  DatastoreCurrenciesIncludingExternalModule,
  DatastoreCurrenciesModule,
  DatastoreEncodedUrlModule,
  DatastoreMilestonesModule,
  DatastoreProjectBudgetOptionsModule,
  DatastoreProjectsModule,
  DatastoreProjectViewProjectsModule,
  DatastoreProjectViewUsersModule,
  DatastoreUsersFollowModule,
  DatastoreUsersRecommendModule,
} from '@freelancer/datastore/collections';
import { PipesModule } from '@freelancer/pipes';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui/ui.module';
import { DeloitteBillingDetailsModule } from '../jobs/job-post/deloitte/form/billing-details/deloitte-billing-details.module';
import { HireMeDeloitteBillingDetailsComponent } from './hire-me-deloitte-billing-details/hire-me-deloitte-billing-details.component';
import { HireMeDeloitteProjectDetailsComponent } from './hire-me-deloitte-project-details/hire-me-deloitte-project-details.component';
import { HireMeDeloitteTermsAndConditionsComponent } from './hire-me-deloitte-terms-and-conditions/hire-me-deloitte-terms-and-conditions.component';
import { HireMeDeloitteTimeFrameComponent } from './hire-me-deloitte-time-frame/hire-me-deloitte-time-frame.component';
import { HireMeErrorsComponent } from './hire-me-errors/hire-me-errors.component';
import { HireMeSecondaryButtonComponent } from './hire-me-split-button/hire-me-secondary-button/hire-me-secondary-button.component';
import { HireMeSplitButtonComponent } from './hire-me-split-button/hire-me-split-button.component';
import { HireMeComponent } from './hire-me.component';
import { RookieMessageComponent } from './rookie-message/rookie-message.component';
@NgModule({
  imports: [
    CommonModule,
    DatastoreBidsModule,
    DatastoreCurrenciesIncludingExternalModule,
    DatastoreCurrenciesModule,
    DatastoreEncodedUrlModule,
    DatastoreMilestonesModule,
    DatastoreProjectBudgetOptionsModule,
    DatastoreProjectsModule,
    DatastoreProjectViewProjectsModule,
    DatastoreUsersRecommendModule,
    DatastoreUsersFollowModule,
    DatastoreProjectViewUsersModule,
    DatastoreCurrenciesIncludingExternalModule,
    DeloitteBillingDetailsModule,
    PipesModule,
    TrackingModule,
    UiModule,
  ],
  declarations: [
    HireMeComponent,
    RookieMessageComponent,
    HireMeErrorsComponent,
    HireMeDeloitteBillingDetailsComponent,
    HireMeDeloitteProjectDetailsComponent,
    HireMeDeloitteTimeFrameComponent,
    HireMeDeloitteTermsAndConditionsComponent,
    HireMeSplitButtonComponent,
    HireMeSecondaryButtonComponent,
  ],
  exports: [HireMeComponent, HireMeSplitButtonComponent],
})
export class HireMeModule {}
