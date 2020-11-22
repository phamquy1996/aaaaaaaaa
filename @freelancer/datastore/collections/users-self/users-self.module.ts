import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { usersSelfBackend } from './users-self.backend';
import { usersSelfReducer } from './users-self.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('usersSelf', usersSelfReducer),
    BackendModule.forFeature('usersSelf', usersSelfBackend),
  ],
})
export class DatastoreUsersSelfModule {}
