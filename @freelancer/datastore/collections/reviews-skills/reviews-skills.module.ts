import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { reviewsSkillsBackend } from './reviews-skills.backend';
import { reviewsSkillsReducer } from './reviews-skills.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('reviewsSkills', reviewsSkillsReducer),
    BackendModule.forFeature('reviewsSkills', reviewsSkillsBackend),
  ],
})
export class DatastoreReviewsSkillsModule {}
