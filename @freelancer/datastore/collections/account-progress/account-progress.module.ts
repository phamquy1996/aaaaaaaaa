import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { accountProgressBackend } from './account-progress.backend';
import { accountProgressReducer } from './account-progress.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('accountProgress', accountProgressReducer),
    BackendModule.forFeature('accountProgress', accountProgressBackend),
  ],
})
export class DatastoreAccountProgressModule {}
