import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  DatastoreContestsModule,
  DatastoreOnlineOfflineModule,
  DatastoreUsersModule,
} from '@freelancer/datastore/collections';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { MessagingChatModule } from 'app/messaging/messaging-chat/messaging-chat.module';
import { MessagingContactsModule } from 'app/messaging/messaging-contacts/messaging-contacts.module';
import { MessagingInboxWidgetModule } from 'app/messaging/messaging-inbox-widget/messaging-inbox-widget.module';
import { MessagingComponent } from './messaging.component';

@NgModule({
  imports: [
    DatastoreOnlineOfflineModule,
    CommonModule,
    DatastoreContestsModule,
    DatastoreUsersModule,
    MessagingChatModule,
    MessagingContactsModule,
    MessagingInboxWidgetModule,
    ReactiveFormsModule,
    TrackingModule,
    UiModule,
  ],
  declarations: [MessagingComponent],
  exports: [MessagingComponent],
})
export class MessagingModule {}
