import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { modifyBidSellerFeesBackend } from './modify-bid-seller-fees.backend';
import { modifyBidSellerFeesReducer } from './modify-bid-seller-fees.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('modifyBidSellerFees', modifyBidSellerFeesReducer),
    BackendModule.forFeature('modifyBidSellerFees', modifyBidSellerFeesBackend),
  ],
})
export class DatastoreModifyBidSellerFeesModule {}
