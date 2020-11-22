import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { messagesBackend } from './messages.backend';
import { MessagesEffect } from './messages.effect';
import { messagesReducer } from './messages.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('messages', messagesReducer),
    EffectsModule.forFeature([MessagesEffect]),
    BackendModule.forFeature('messages', messagesBackend),
  ],
})
export class DatastoreMessagesModule {}
