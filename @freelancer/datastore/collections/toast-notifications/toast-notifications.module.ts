import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { toastNotificationsBackend } from './toast-notifications.backend';
import { toastNotificationsReducer } from './toast-notifications.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('toastNotifications', toastNotificationsReducer),
    BackendModule.forFeature('toastNotifications', toastNotificationsBackend),
  ],
})
export class DatastoreToastNotificationsModule {}
