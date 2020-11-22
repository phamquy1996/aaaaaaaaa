import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { bidRestrictionsBackend } from './bid-restrictions.backend';
import { bidRestrictionsReducer } from './bid-restrictions.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('bidRestrictions', bidRestrictionsReducer),
    BackendModule.forFeature('bidRestrictions', bidRestrictionsBackend),
  ],
})
export class DatastoreBidRestrictionsModule {}
