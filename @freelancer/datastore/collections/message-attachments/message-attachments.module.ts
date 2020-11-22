import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { messageAttachmentsBackend } from './message-attachments.backend';
import { messageAttachmentsReducer } from './message-attachments.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('messageAttachments', messageAttachmentsReducer),
    BackendModule.forFeature('messageAttachments', messageAttachmentsBackend),
  ],
})
export class DatastoreMessageAttachmentsModule {}
