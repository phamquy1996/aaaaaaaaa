import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { verificationAddressDocumentTypesBackend } from './verification-address-document-types.backend';
import { verificationAddressDocumentTypesReducer } from './verification-address-document-types.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'verificationAddressDocumentTypes',
      verificationAddressDocumentTypesReducer,
    ),
    BackendModule.forFeature(
      'verificationAddressDocumentTypes',
      verificationAddressDocumentTypesBackend,
    ),
  ],
})
export class DatastoreVerificationAddressDocumentTypesModule {}
