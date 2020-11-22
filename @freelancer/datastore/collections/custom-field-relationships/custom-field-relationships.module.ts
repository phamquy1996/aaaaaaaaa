import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { customFieldRelationshipsBackend } from './custom-field-relationships.backend';
import { customFieldRelationshipsReducer } from './custom-field-relationships.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'customFieldRelationships',
      customFieldRelationshipsReducer,
    ),
    BackendModule.forFeature(
      'customFieldRelationships',
      customFieldRelationshipsBackend,
    ),
  ],
})
export class DatastoreCustomFieldRelationshipsModule {}
