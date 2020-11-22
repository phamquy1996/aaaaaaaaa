import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { searchMyContactsBackend } from './search-my-contacts.backend';
import { searchMyContactsReducer } from './search-my-contacts.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('searchMyContacts', searchMyContactsReducer),
    BackendModule.forFeature('searchMyContacts', searchMyContactsBackend),
  ],
})
export class DatastoreSearchMyContactsModule {}
