import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { userHasGivenFeedbackBackend } from './user-has-given-feedback.backend';
import { userHasGivenFeedbackReducer } from './user-has-given-feedback.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('userHasGivenFeedback', userHasGivenFeedbackReducer),
    BackendModule.forFeature(
      'userHasGivenFeedback',
      userHasGivenFeedbackBackend,
    ),
  ],
})
export class DatastoreUserHasGivenFeedbackModule {}
