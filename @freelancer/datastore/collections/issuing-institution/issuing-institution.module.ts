import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { issuingInstitutionBackend } from './issuing-institution.backend';
import { issuingInstitutionReducer } from './issuing-institution.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('issuingInstitution', issuingInstitutionReducer),
    BackendModule.forFeature('issuingInstitution', issuingInstitutionBackend),
  ],
})
export class DatastoreIssuingInstitutionModule {}
