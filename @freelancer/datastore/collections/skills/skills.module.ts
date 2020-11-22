import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { skillsBackend } from './skills.backend';
import { skillsReducer } from './skills.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('skills', skillsReducer),
    BackendModule.forFeature('skills', skillsBackend),
  ],
})
export class DatastoreSkillsModule {}
