import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { superuserMilestonesBackend } from './superuser-milestones.backend';
import { superuserMilestonesReducer } from './superuser-milestones.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('superuserMilestones', superuserMilestonesReducer),
    BackendModule.forFeature('superuserMilestones', superuserMilestonesBackend),
  ],
})
export class DatastoreSuperuserMilestonesModule {}
