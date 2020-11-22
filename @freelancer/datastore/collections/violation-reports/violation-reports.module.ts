import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { violationReportsBackend } from './violation-reports.backend';
import { violationReportsReducer } from './violation-reports.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('violationReports', violationReportsReducer),
    BackendModule.forFeature('violationReports', violationReportsBackend),
  ],
})
export class DatastoreViolationReportsModule {}
