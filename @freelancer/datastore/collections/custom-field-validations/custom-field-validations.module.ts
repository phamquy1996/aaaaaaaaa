import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { customFieldValidationsBackend } from './custom-field-validations.backend';
import { customFieldValidationsReducer } from './custom-field-validations.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'customFieldValidations',
      customFieldValidationsReducer,
    ),
    BackendModule.forFeature(
      'customFieldValidations',
      customFieldValidationsBackend,
    ),
  ],
})
export class DatastoreCustomFieldValidationsModule {}
