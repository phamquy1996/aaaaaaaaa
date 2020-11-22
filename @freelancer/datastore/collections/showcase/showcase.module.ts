import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { showcaseBackend } from './showcase.backend';
import { showcaseReducer } from './showcase.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('showcase', showcaseReducer),
    BackendModule.forFeature('showcase', showcaseBackend),
  ],
})
export class DatastoreShowcaseModule {}
