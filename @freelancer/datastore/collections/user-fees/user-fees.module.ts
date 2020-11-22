import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { userFeesBackend } from './user-fees.backend';
import { userFeesReducer } from './user-fees.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('userFees', userFeesReducer),
    BackendModule.forFeature('userFees', userFeesBackend),
  ],
})
export class DatastoreUserFeesModule {}
