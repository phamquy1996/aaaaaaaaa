import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { notificationsPreferencesBackend } from './notifications-preferences.backend';
import { notificationsPreferencesReducer } from './notifications-preferences.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'notificationsPreferences',
      notificationsPreferencesReducer,
    ),
    BackendModule.forFeature(
      'notificationsPreferences',
      notificationsPreferencesBackend,
    ),
  ],
})
export class DatastoreNotificationsPreferencesModule {}
