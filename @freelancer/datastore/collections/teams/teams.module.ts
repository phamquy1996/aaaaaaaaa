import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { teamsBackend } from './teams.backend';
import { teamsReducer } from './teams.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('teams', teamsReducer),
    BackendModule.forFeature('teams', teamsBackend),
  ],
})
export class DatastoreTeamsModule {}
