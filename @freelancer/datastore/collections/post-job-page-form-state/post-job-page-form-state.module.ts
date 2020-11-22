import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { postJobPageFormStateBackend } from './post-job-page-form-state.backend';
import { postJobPageFormStateReducer } from './post-job-page-form-state.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('postJobPageFormState', postJobPageFormStateReducer),
    BackendModule.forFeature(
      'postJobPageFormState',
      postJobPageFormStateBackend,
    ),
  ],
})
export class DatastorePostJobPageFormStateModule {}
