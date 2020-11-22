import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { experiencesBackend } from './experiences.backend';
import { experiencesReducer } from './experiences.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('experiences', experiencesReducer),
    BackendModule.forFeature('experiences', experiencesBackend),
  ],
})
export class DatastoreExperiencesModule {}
