import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { manageViewContestsBackend } from './manage-view-contests.backend';
import { manageViewContestsReducer } from './manage-view-contests.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('manageViewContests', manageViewContestsReducer),
    BackendModule.forFeature('manageViewContests', manageViewContestsBackend),
  ],
})
export class DatastoreManageViewContestsModule {}
