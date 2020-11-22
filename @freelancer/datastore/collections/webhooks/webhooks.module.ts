import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { webhooksBackend } from './webhooks.backend';
import { webhooksReducer } from './webhooks.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('webhooks', webhooksReducer),
    BackendModule.forFeature('webhooks', webhooksBackend),
  ],
})
export class DatastoreWebhooksModule {}
