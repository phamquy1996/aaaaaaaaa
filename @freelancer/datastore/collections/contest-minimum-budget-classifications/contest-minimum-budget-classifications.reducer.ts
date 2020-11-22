import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformContestMinimumBudgetClassification } from './contest-minimum-budget-classifications.transformers';
import { ContestMinimumBudgetClassificationsCollection } from './contest-minimum-budget-classifications.types';

export function contestMinimumBudgetClassificationsReducer(
  state: CollectionStateSlice<
    ContestMinimumBudgetClassificationsCollection
  > = {},
  action: CollectionActions<ContestMinimumBudgetClassificationsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'contestMinimumBudgetClassifications') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ContestMinimumBudgetClassificationsCollection>(
          state,
          transformIntoDocuments(
            result,
            transformContestMinimumBudgetClassification,
          ),
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
