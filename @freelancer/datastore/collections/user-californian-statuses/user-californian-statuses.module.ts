import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { userCalifornianStatusesBackend } from './user-californian-statuses.backend';
import { userCalifornianStatusesReducer } from './user-californian-statuses.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'userCalifornianStatuses',
      userCalifornianStatusesReducer,
    ),
    BackendModule.forFeature(
      'userCalifornianStatuses',
      userCalifornianStatusesBackend,
    ),
  ],
})
export class DatastoreUserCalifornianStatusesModule {}
