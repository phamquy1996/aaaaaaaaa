import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { skillsSubNavigationBackend } from './skills-sub-navigation.backend';
import { skillsSubNavigationReducer } from './skills-sub-navigation.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('skillsSubNavigation', skillsSubNavigationReducer),
    BackendModule.forFeature('skillsSubNavigation', skillsSubNavigationBackend),
  ],
})
export class DatastoreSkillsSubNavigationModule {}
