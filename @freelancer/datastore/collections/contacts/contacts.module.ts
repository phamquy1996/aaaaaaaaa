import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { contactsBackend } from './contacts.backend';
import { contactsReducer } from './contacts.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('contacts', contactsReducer),
    BackendModule.forFeature('contacts', contactsBackend),
  ],
})
export class DatastoreContactsModule {}
