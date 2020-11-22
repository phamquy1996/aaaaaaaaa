import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { coursesBackend } from './academy-courses.backend';
import { coursesReducer } from './academy-courses.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('academyCourses', coursesReducer),
    BackendModule.forFeature('academyCourses', coursesBackend),
  ],
})
export class DatastoreAcademyCoursesModule {}
