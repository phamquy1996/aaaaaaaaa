import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { deloitteUserInfoGetResultAjax } from './deloitte-user-info.backend';
import { deloitteUserInfoReducer } from './deloitte-user-info.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('deloitteUserInfo', deloitteUserInfoReducer),
    BackendModule.forFeature('deloitteUserInfo', deloitteUserInfoGetResultAjax),
  ],
})
export class DatastoreDeloitteUserInfoModule {}
