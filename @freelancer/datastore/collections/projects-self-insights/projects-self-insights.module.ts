import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { projectsSelfInsightsBackend } from './projects-self-insights.backend';
import { projectsSelfInsightsReducer } from './projects-self-insights.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('projectsSelfInsights', projectsSelfInsightsReducer),
    BackendModule.forFeature(
      'projectsSelfInsights',
      projectsSelfInsightsBackend,
    ),
  ],
})
export class DatastoreProjectsSelfInsightsModule {}
