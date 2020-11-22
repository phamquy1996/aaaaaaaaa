import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { groupsSelfBackend } from './groups-self.backend';
import { groupsSelfReducer } from './groups-self.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('groupsSelf', groupsSelfReducer),
    BackendModule.forFeature('groupsSelf', groupsSelfBackend),
  ],
})
export class DatastoreGroupsSelfModule {}
