import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { onlineOfflineBackend } from './online-offline.backend';
import { onlineOfflineReducer } from './online-offline.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('onlineOffline', onlineOfflineReducer),
    BackendModule.forFeature('onlineOffline', onlineOfflineBackend),
  ],
})
export class DatastoreOnlineOfflineModule {}
