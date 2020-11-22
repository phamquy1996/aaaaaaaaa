import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { timeTrackingPunchesBackend } from './time-tracking-punches.backend';
import { timeTrackingPunchesReducer } from './time-tracking-punches.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('timeTrackingPunches', timeTrackingPunchesReducer),
    BackendModule.forFeature('timeTrackingPunches', timeTrackingPunchesBackend),
  ],
})
export class DatastoreTimeTrackingPunchesModule {}
