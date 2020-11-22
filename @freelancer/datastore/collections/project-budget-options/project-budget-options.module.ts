import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { projectBudgetOptionsBackend } from './project-budget-options.backend';
import { projectBudgetOptionsReducer } from './project-budget-options.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('projectBudgetOptions', projectBudgetOptionsReducer),
    BackendModule.forFeature(
      'projectBudgetOptions',
      projectBudgetOptionsBackend,
    ),
  ],
})
export class DatastoreProjectBudgetOptionsModule {}
