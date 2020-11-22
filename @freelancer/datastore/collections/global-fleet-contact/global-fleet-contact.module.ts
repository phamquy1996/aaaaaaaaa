import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { globalFleetContactBackend } from './global-fleet-contact.backend';
import { globalFleetContactReducer } from './global-fleet-contact.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('globalFleetContact', globalFleetContactReducer),
    BackendModule.forFeature('globalFleetContact', globalFleetContactBackend),
  ],
})
export class DatastoreGlobalFleetContactModule {}
