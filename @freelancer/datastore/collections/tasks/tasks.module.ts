import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { tasksBackend } from './tasks.backend';
import { tasksReducer } from './tasks.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('tasks', tasksReducer),
    BackendModule.forFeature('tasks', tasksBackend),
  ],
})
export class DatastoreTasksModule {}
