import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { jobClassifierBackend } from './job-classifier.backend';
import { jobClassifierReducer } from './job-classifier.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('jobClassifier', jobClassifierReducer),
    BackendModule.forFeature('jobClassifier', jobClassifierBackend),
  ],
})
export class DatastoreJobClassifierModule {}
