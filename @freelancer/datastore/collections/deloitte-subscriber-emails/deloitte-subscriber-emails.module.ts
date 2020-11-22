import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { deloitteSubscriberEmailsBackend } from './deloitte-subscriber-emails.backend';
import { deloitteSubscriberEmailsReducer } from './deloitte-subscriber-emails.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'deloitteSubscriberEmails',
      deloitteSubscriberEmailsReducer,
    ),
    BackendModule.forFeature(
      'deloitteSubscriberEmails',
      deloitteSubscriberEmailsBackend,
    ),
  ],
})
export class DatastoreDeloitteSubscriberEmailsModule {}
