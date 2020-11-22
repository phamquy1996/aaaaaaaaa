import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { suggestedSkillsBackend } from './suggested-skills.backend';
import { suggestedSkillsReducer } from './suggested-skills.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('suggestedSkills', suggestedSkillsReducer),
    BackendModule.forFeature('suggestedSkills', suggestedSkillsBackend),
  ],
})
export class DatastoreSuggestedSkillsModule {}
