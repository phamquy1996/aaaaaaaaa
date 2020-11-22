import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { notificationsBackend } from './notifications.backend';
import { notificationsReducer } from './notifications.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('notifications', notificationsReducer),
    BackendModule.forFeature('notifications', notificationsBackend),
  ],
})
export class DatastoreNotificationsModule {}
