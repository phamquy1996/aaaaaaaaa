import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { searchProjectsSelfBackend } from './search-projects-self.backend';
import { searchProjectsSelfReducer } from './search-projects-self.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('searchProjectsSelf', searchProjectsSelfReducer),
    BackendModule.forFeature('searchProjectsSelf', searchProjectsSelfBackend),
  ],
})
export class DatastoreSearchProjectsSelfModule {}
