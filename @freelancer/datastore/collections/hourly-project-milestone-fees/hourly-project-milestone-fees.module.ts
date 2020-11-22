import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { hourlyProjectMilestoneFeesBackend } from './hourly-project-milestone-fees.backend';
import { hourlyProjectMilestoneFeesReducer } from './hourly-project-milestone-fees.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'hourlyProjectMilestoneFees',
      hourlyProjectMilestoneFeesReducer,
    ),
    BackendModule.forFeature(
      'hourlyProjectMilestoneFees',
      hourlyProjectMilestoneFeesBackend,
    ),
  ],
})
export class DatastoreHourlyProjectMilestoneFeesModule {}
