import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { customFieldInfoConfigurationsBackend } from './custom-field-info-configurations.backend';
import { customFieldInfoConfigurationsReducer } from './custom-field-info-configurations.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'customFieldInfoConfigurations',
      customFieldInfoConfigurationsReducer,
    ),
    BackendModule.forFeature(
      'customFieldInfoConfigurations',
      customFieldInfoConfigurationsBackend,
    ),
  ],
})
export class DatastoreCustomFieldInfoConfigurationsModule {}
