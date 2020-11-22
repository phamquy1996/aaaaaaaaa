import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { milestoneDraftsBackend } from './milestone-drafts.backend';
import { milestoneDraftsReducer } from './milestone-drafts.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('milestoneDrafts', milestoneDraftsReducer),
    BackendModule.forFeature('milestoneDrafts', milestoneDraftsBackend),
  ],
})
export class DatastoreMilestoneDraftsModule {}
