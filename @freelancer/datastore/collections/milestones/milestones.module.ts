import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { milestonesBackend } from './milestones.backend';
import { milestonesReducer } from './milestones.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('milestones', milestonesReducer),
    BackendModule.forFeature('milestones', milestonesBackend),
  ],
})
export class DatastoreMilestonesModule {}
