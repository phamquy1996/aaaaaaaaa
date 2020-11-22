import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { educationsBackend } from './educations.backend';
import { educationsReducer } from './educations.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('educations', educationsReducer),
    BackendModule.forFeature('educations', educationsBackend),
  ],
})
export class DatastoreEducationsModule {}
