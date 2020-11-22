import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { bidAwardRevokeReasonsBackend } from './bid-award-revoke-reasons.backend';
import { bidAwardRevokeReasonsReducer } from './bid-award-revoke-reasons.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'bidAwardRevokeReasons',
      bidAwardRevokeReasonsReducer,
    ),
    BackendModule.forFeature(
      'bidAwardRevokeReasons',
      bidAwardRevokeReasonsBackend,
    ),
  ],
})
export class DatastoreBidAwardRevokeReasonsModule {}
