import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { dashboardPollsBackend } from './dashboard-polls.backend';
import { dashboardPollsReducer } from './dashboard-polls.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('dashboardPolls', dashboardPollsReducer),
    BackendModule.forFeature('dashboardPolls', dashboardPollsBackend),
  ],
})
export class DatastoreDashboardPollsModule {}
