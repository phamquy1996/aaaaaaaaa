import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { certificationsBackend } from './certifications.backend';
import { certificationsReducer } from './certifications.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('certifications', certificationsReducer),
    BackendModule.forFeature('certifications', certificationsBackend),
  ],
})
export class DatastoreCertificationsModule {}
