import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { examsBackend } from './exams.backend';
import { examsReducer } from './exams.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('exams', examsReducer),
    BackendModule.forFeature('exams', examsBackend),
  ],
})
export class DatastoreExamsModule {}
