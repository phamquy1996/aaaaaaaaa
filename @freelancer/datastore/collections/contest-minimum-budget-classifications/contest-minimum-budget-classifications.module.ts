import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { contestMinimumBudgetClassificationsBackend } from './contest-minimum-budget-classifications.backend';
import { contestMinimumBudgetClassificationsReducer } from './contest-minimum-budget-classifications.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'contestMinimumBudgetClassifications',
      contestMinimumBudgetClassificationsReducer,
    ),
    BackendModule.forFeature(
      'contestMinimumBudgetClassifications',
      contestMinimumBudgetClassificationsBackend,
    ),
  ],
})
export class DatastoreContestMinimumBudgetClassificationsModule {}
