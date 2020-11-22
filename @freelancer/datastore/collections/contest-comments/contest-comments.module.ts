import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { contestCommentsBackend } from './contest-comments.backend';
import { contestCommentsReducer } from './contest-comments.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('contestComments', contestCommentsReducer),
    BackendModule.forFeature('contestComments', contestCommentsBackend),
  ],
})
export class DatastoreContestCommentsModule {}
