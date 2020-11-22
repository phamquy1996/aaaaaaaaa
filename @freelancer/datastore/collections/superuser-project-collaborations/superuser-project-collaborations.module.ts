import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { superuserProjectCollaborationsBackend } from './superuser-project-collaborations.backend';
import { superuserProjectCollaborationsReducer } from './superuser-project-collaborations.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'superuserProjectCollaborations',
      superuserProjectCollaborationsReducer,
    ),
    BackendModule.forFeature(
      'superuserProjectCollaborations',
      superuserProjectCollaborationsBackend,
    ),
  ],
})
export class DatastoreSuperuserProjectCollaborationsModule {}
