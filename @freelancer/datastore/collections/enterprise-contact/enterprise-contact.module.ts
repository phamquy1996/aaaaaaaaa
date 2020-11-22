import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { enterpriseContactBackend } from './enterprise-contact.backend';
import { enterpriseContactReducer } from './enterprise-contact.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('enterpriseContact', enterpriseContactReducer),
    BackendModule.forFeature('enterpriseContact', enterpriseContactBackend),
  ],
})
export class DatastoreEnterpriseContactModule {}
