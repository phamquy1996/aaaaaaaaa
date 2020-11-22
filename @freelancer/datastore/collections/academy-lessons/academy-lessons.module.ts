import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { lessonsBackend } from './academy-lessons.backend';
import { lessonsReducer } from './academy-lessons.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('academyLessons', lessonsReducer),
    BackendModule.forFeature('academyLessons', lessonsBackend),
  ],
})
export class DatastoreAcademyLessonsModule {}
