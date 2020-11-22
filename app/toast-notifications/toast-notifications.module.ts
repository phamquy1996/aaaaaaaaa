import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  DatastoreNotificationsPreferencesModule,
  DatastoreToastNotificationsModule,
} from '@freelancer/datastore/collections';
import { UiModule } from '@freelancer/ui';
import { FeedItemsModule } from 'app/navigation/feed-items';
import { NotificationTemplatesModule } from 'app/navigation/notification-templates';
import { ToastContainerComponent } from './toast-container.component';
import { ToastItemComponent } from './toast-item.component';
import { ToastNotificationsComponent } from './toast-notifications.component';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    NotificationTemplatesModule,
    DatastoreNotificationsPreferencesModule,
    FeedItemsModule,
    DatastoreToastNotificationsModule,
  ],
  declarations: [
    ToastNotificationsComponent,
    ToastItemComponent,
    ToastContainerComponent,
  ],
  exports: [ToastNotificationsComponent],
})
export class ToastNotificationsModule {}
