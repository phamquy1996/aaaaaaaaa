import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { projectStatsBackend } from './project-stats.backend';
import { projectStatsReducer } from './project-stats.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('projectStats', projectStatsReducer),
    BackendModule.forFeature('projectStats', projectStatsBackend),
  ],
})
export class DatastoreProjectStatsModule {}
