import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { bidBuyerProjectFeesBackend } from './bid-buyer-project-fees.backend';
import { bidBuyerProjectFeesReducer } from './bid-buyer-project-fees.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('bidBuyerProjectFees', bidBuyerProjectFeesReducer),
    BackendModule.forFeature('bidBuyerProjectFees', bidBuyerProjectFeesBackend),
  ],
})
export class DatastoreBidBuyerProjectFeesModule {}
