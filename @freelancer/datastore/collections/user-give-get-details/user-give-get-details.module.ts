import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { userGiveGetDetailsBackend } from './user-give-get-details.backend';
import { userGiveGetDetailsReducer } from './user-give-get-details.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('userGiveGetDetails', userGiveGetDetailsReducer),
    BackendModule.forFeature('userGiveGetDetails', userGiveGetDetailsBackend),
  ],
})
export class DatastoreUserGiveGetDetailsModule {}
