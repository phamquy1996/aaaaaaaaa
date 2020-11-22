import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { projectFeeInfoBackend } from './project-fee-info.backend';
import { projectFeeInfoReducer } from './project-fee-info.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('projectFeeInfo', projectFeeInfoReducer),
    BackendModule.forFeature('projectFeeInfo', projectFeeInfoBackend),
  ],
})
export class DatastoreProjectFeeInfoModule {}
