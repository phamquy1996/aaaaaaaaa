import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { topSkillsBackend } from './top-skills.backend';
import { topSkillsReducer } from './top-skills.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('topSkills', topSkillsReducer),
    BackendModule.forFeature('topSkills', topSkillsBackend),
  ],
})
export class DatastoreTopSkillsModule {}
