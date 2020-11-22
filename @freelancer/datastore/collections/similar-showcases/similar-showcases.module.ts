import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { similarShowcasesBackend } from './similar-showcases.backend';
import { similarShowcasesReducer } from './similar-showcases.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('similarShowcases', similarShowcasesReducer),
    BackendModule.forFeature('similarShowcases', similarShowcasesBackend),
  ],
})
export class DatastoreSimilarShowcasesModule {}
