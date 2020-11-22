import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { timeTrackingSessionAggregateBackend } from './time-tracking-session-aggregate.backend';
import { timeTrackingSessionAggregateReducer } from './time-tracking-session-aggregate.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'timeTrackingSessionAggregate',
      timeTrackingSessionAggregateReducer,
    ),
    BackendModule.forFeature(
      'timeTrackingSessionAggregate',
      timeTrackingSessionAggregateBackend,
    ),
  ],
})
export class DatastoreTimeTrackingSessionAggregateModule {}
