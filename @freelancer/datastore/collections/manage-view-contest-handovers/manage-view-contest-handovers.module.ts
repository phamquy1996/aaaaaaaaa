import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { manageViewContestHandoversBackend } from './manage-view-contest-handovers.backend';
import { manageViewContestHandoversReducer } from './manage-view-contest-handovers.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'manageViewContestHandovers',
      manageViewContestHandoversReducer,
    ),
    BackendModule.forFeature(
      'manageViewContestHandovers',
      manageViewContestHandoversBackend,
    ),
  ],
})
export class DatastoreManageViewContestHandoversModule {}
