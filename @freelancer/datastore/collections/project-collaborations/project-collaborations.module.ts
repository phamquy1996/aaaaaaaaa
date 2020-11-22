import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { projectCollaborationsBackend } from './project-collaborations.backend';
import { projectCollaborationsReducer } from './project-collaborations.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'projectCollaborations',
      projectCollaborationsReducer,
    ),
    BackendModule.forFeature(
      'projectCollaborations',
      projectCollaborationsBackend,
    ),
  ],
})
export class DatastoreProjectCollaborationsModule {}
