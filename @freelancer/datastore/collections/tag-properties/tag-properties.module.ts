import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { tagPropertiesBackend } from './tag-properties.backend';
import { tagPropertiesReducer } from './tag-properties.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('tagProperties', tagPropertiesReducer),
    BackendModule.forFeature('tagProperties', tagPropertiesBackend),
  ],
})
export class DatastoreTagPropertiesModule {}
