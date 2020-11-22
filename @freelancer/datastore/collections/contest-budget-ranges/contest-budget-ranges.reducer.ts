import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformContestBudgetRange } from './contest-budget-ranges.transformers';
import { ContestBudgetRangesCollection } from './contest-budget-ranges.types';

export function contestBudgetRangesReducer(
  state: CollectionStateSlice<ContestBudgetRangesCollection> = {},
  action: CollectionActions<ContestBudgetRangesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'contestBudgetRanges') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ContestBudgetRangesCollection>(
          state,
          transformIntoDocuments(result, transformContestBudgetRange),
          order,
          ref,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
