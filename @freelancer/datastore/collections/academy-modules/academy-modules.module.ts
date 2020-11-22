import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { modulesBackend } from './academy-modules.backend';
import { modulesReducer } from './academy-modules.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('academyModules', modulesReducer),
    BackendModule.forFeature('academyModules', modulesBackend),
  ],
})
export class DatastoreAcademyModulesModule {}
