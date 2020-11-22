import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { bidAwardDraftsBackend } from './bid-award-drafts.backend';
import { bidAwardDraftsReducer } from './bid-award-drafts.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('bidAwardDrafts', bidAwardDraftsReducer),
    BackendModule.forFeature('bidAwardDrafts', bidAwardDraftsBackend),
  ],
})
export class DatastoreBidAwardDraftsModule {}
