import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { instructorsBackend } from './academy-instructors.backend';
import { instructorsReducer } from './academy-instructors.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('academyInstructors', instructorsReducer),
    BackendModule.forFeature('academyInstructors', instructorsBackend),
  ],
})
export class DatastoreAcademyInstructorsModule {}
