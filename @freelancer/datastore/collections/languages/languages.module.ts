import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { languagesBackend } from './languages.backend';
import { languagesReducer } from './languages.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('languages', languagesReducer),
    BackendModule.forFeature('languages', languagesBackend),
  ],
})
export class DatastoreLanguagesModule {}
