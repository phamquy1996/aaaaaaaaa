import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { userNpsBackend } from './user-nps.backend';
import { userNpsReducer } from './user-nps.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('userNps', userNpsReducer),
    BackendModule.forFeature('userNps', userNpsBackend),
  ],
})
export class DatastoreUserNpsModule {}
