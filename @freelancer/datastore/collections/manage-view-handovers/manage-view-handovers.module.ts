import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { manageViewHandoversBackend } from './manage-view-handovers.backend';
import { manageViewHandoversReducer } from './manage-view-handovers.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('manageViewHandovers', manageViewHandoversReducer),
    BackendModule.forFeature('manageViewHandovers', manageViewHandoversBackend),
  ],
})
export class DatastoreManageViewHandoversModule {}
