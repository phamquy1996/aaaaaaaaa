import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { publicationsBackend } from './publications.backend';
import { publicationsReducer } from './publications.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('publications', publicationsReducer),
    BackendModule.forFeature('publications', publicationsBackend),
  ],
})
export class DatastorePublicationsModule {}
