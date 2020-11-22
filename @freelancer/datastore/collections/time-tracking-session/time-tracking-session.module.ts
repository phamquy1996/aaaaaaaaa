import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { timeTrackingSessionBackend } from './time-tracking-session.backend';
import { timeTrackingSessionReducer } from './time-tracking-session.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('timeTrackingSession', timeTrackingSessionReducer),
    BackendModule.forFeature('timeTrackingSession', timeTrackingSessionBackend),
  ],
})
export class DatastoreTimeTrackingSessionModule {}
