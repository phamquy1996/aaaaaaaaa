import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { timeTrackingDailyAggregatesBackend } from './time-tracking-daily-aggregates.backend';
import { timeTrackingDailyAggregatesReducer } from './time-tracking-daily-aggregates.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'timeTrackingDailyAggregates',
      timeTrackingDailyAggregatesReducer,
    ),
    BackendModule.forFeature(
      'timeTrackingDailyAggregates',
      timeTrackingDailyAggregatesBackend,
    ),
  ],
})
export class DatastoreTimeTrackingDailyAggregatesModule {}
