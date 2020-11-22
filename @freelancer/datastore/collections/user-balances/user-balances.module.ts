import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { userBalancesBackend } from './user-balances.backend';
import { userBalancesReducer } from './user-balances.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('userBalances', userBalancesReducer),
    BackendModule.forFeature('userBalances', userBalancesBackend),
  ],
})
export class DatastoreUserBalancesModule {}
