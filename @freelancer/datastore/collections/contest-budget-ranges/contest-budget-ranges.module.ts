import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { contestBudgetRangesBackend } from './contest-budget-ranges.backend';
import { contestBudgetRangesReducer } from './contest-budget-ranges.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('contestBudgetRanges', contestBudgetRangesReducer),
    BackendModule.forFeature('contestBudgetRanges', contestBudgetRangesBackend),
  ],
})
export class DatastoreContestBudgetRangesModule {}
