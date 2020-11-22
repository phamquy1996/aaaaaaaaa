import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { superuserMessagesBackend } from './superuser-messages.backend';
import { superuserMessagesReducer } from './superuser-messages.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('superuserMessages', superuserMessagesReducer),
    BackendModule.forFeature('superuserMessages', superuserMessagesBackend),
  ],
})
export class DatastoreSuperuserMessagesModule {}
