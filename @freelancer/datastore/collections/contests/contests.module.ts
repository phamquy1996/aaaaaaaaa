import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { contestsBackend } from './contests.backend';
import { contestsReducer } from './contests.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('contests', contestsReducer),
    BackendModule.forFeature('contests', contestsBackend),
  ],
})
export class DatastoreContestsModule {}
