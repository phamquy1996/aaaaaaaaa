import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { contestsSelfInsightsBackend } from './contests-self-insights.backend';
import { contestsSelfInsightsReducer } from './contests-self-insights.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('contestsSelfInsights', contestsSelfInsightsReducer),
    BackendModule.forFeature(
      'contestsSelfInsights',
      contestsSelfInsightsBackend,
    ),
  ],
})
export class DatastoreContestsSelfInsightsModule {}
