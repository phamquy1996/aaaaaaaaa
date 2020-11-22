import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { contestFeesBackend } from './contest-fees.backend';
import { contestFeesReducer } from './contest-fees.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('contestFees', contestFeesReducer),
    BackendModule.forFeature('contestFees', contestFeesBackend),
  ],
})
export class DatastoreContestFeesModule {}
