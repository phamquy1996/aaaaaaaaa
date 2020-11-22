import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  DatastoreOnlineOfflineModule,
  DatastoreThreadsModule,
} from '@freelancer/datastore/collections';
import { UiModule } from '@freelancer/ui';
import { ChatButtonComponent } from './chat-button.component';

@NgModule({
  imports: [
    CommonModule,
    DatastoreOnlineOfflineModule,
    DatastoreThreadsModule,
    UiModule,
  ],
  declarations: [ChatButtonComponent],
  exports: [ChatButtonComponent],
})
export class ChatButtonModule {}
