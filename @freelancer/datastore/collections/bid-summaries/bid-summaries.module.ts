import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { bidSummariesBackend } from './bid-summaries.backend';
import { bidSummariesReducer } from './bid-summaries.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('bidSummaries', bidSummariesReducer),
    BackendModule.forFeature('bidSummaries', bidSummariesBackend),
  ],
})
export class DatastoreBidSummariesModule {}
