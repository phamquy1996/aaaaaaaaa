import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { userInteractionsBackend } from './user-interactions.backend';
import { userInteractionsReducer } from './user-interactions.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('userInteractions', userInteractionsReducer),
    BackendModule.forFeature('userInteractions', userInteractionsBackend),
  ],
})
export class DatastoreUserInteractionsModule {}
