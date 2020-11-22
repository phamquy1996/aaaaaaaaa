import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { skillBundlesBackend } from './skill-bundles.backend';
import { skillBundlesReducer } from './skill-bundles.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('skillBundles', skillBundlesReducer),
    BackendModule.forFeature('skillBundles', skillBundlesBackend),
  ],
})
export class DatastoreSkillBundlesModule {}
