import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { userInfoBackend } from './user-info.backend';
import { userInfoReducer } from './user-info.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('userInfo', userInfoReducer),
    BackendModule.forFeature('userInfo', userInfoBackend),
  ],
})
export class DatastoreUserInfoModule {}
