import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { predictedSkillsBackend } from './predicted-skills.backend';
import { predictedSkillsReducer } from './predicted-skills.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('predictedSkills', predictedSkillsReducer),
    BackendModule.forFeature('predictedSkills', predictedSkillsBackend),
  ],
})
export class DatastorePredictedSkillsModule {}
