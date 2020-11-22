import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { showcaseSourceBackend } from './showcase-source.backend';
import { showcaseSourceReducer } from './showcase-source.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('showcaseSource', showcaseSourceReducer),
    BackendModule.forFeature('showcaseSource', showcaseSourceBackend),
  ],
})
export class DatastoreShowcaseSourceModule {}
