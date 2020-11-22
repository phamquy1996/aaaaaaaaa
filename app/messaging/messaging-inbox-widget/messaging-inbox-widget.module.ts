import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  DatastoreContestsModule,
  DatastoreThreadProjectsModule,
  DatastoreThreadsModule,
  DatastoreUsersModule,
} from '@freelancer/datastore/collections';
import { PipesModule } from '@freelancer/pipes';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { MessagingThreadsModule } from '../messaging-threads/messaging-threads.module';
import { MessagingInboxWidgetHeaderComponent } from './messaging-inbox-widget-header/messaging-inbox-widget-header.component';
import { MessagingInboxWidgetComponent } from './messaging-inbox-widget.component';

@NgModule({
  imports: [
    CommonModule,
    DatastoreContestsModule,
    DatastoreThreadProjectsModule,
    DatastoreThreadsModule,
    DatastoreUsersModule,
    MessagingThreadsModule,
    PipesModule,
    TrackingModule,
    UiModule,
  ],
  declarations: [
    MessagingInboxWidgetComponent,
    MessagingInboxWidgetHeaderComponent,
  ],
  exports: [MessagingInboxWidgetComponent],
})
export class MessagingInboxWidgetModule {}
