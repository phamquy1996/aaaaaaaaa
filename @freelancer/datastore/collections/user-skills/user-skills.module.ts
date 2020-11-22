import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { userSkillsBackend } from './user-skills.backend';
import { userSkillsReducer } from './user-skills.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('userSkills', userSkillsReducer),
    BackendModule.forFeature('userSkills', userSkillsBackend),
  ],
})
export class DatastoreUserSkillsModule {}
