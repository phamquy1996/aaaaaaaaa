import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { userBidLimitBackend } from './user-bid-limit.backend';
import { userBidLimitReducer } from './user-bid-limit.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('userBidLimit', userBidLimitReducer),
    BackendModule.forFeature('userBidLimit', userBidLimitBackend),
  ],
})
export class DatastoreUserBidLimitModule {}
