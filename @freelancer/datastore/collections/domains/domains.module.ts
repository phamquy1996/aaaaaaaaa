import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { domainsBackend } from './domains.backend';
import { domainsReducer } from './domains.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('domains', domainsReducer),
    BackendModule.forFeature('domains', domainsBackend),
  ],
})
export class DatastoreDomainsModule {}
