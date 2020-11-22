import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { contestHandoversBackend } from './contest-handovers.backend';
import { contestHandoversReducer } from './contest-handovers.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('contestHandovers', contestHandoversReducer),
    BackendModule.forFeature('contestHandovers', contestHandoversBackend),
  ],
})
export class DatastoreContestHandoversModule {}
