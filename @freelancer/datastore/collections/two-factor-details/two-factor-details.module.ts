import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { twoFactorDetailsBackend } from './two-factor-details.backend';
import { twoFactorDetailsReducer } from './two-factor-details.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('twoFactorDetails', twoFactorDetailsReducer),
    BackendModule.forFeature('twoFactorDetails', twoFactorDetailsBackend),
  ],
})
export class DatastoreTwoFactorDetailsModule {}
