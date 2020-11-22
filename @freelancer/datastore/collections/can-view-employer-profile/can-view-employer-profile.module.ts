import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { canViewEmployerProfileBackend } from './can-view-employer-profile.backend';
import { canViewEmployerProfileReducer } from './can-view-employer-profile.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'canViewEmployerProfile',
      canViewEmployerProfileReducer,
    ),
    BackendModule.forFeature(
      'canViewEmployerProfile',
      canViewEmployerProfileBackend,
    ),
  ],
})
export class DatastoreCanViewEmployerProfileModule {}
