import {
  CollectionActions,
  CollectionStateSlice,
  getQueryParamValue,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformProjectBudgetOptions } from './project-budget-options.transformers';
import { ProjectBudgetOptionsCollection } from './project-budget-options.types';

export function projectBudgetOptionsReducer(
  state: CollectionStateSlice<ProjectBudgetOptionsCollection> = {},
  action: CollectionActions<ProjectBudgetOptionsCollection>,
) {
  switch (action.type) {
    // Network request fetched items successfully, merge them into the state
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'projectBudgetOptions') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ProjectBudgetOptionsCollection>(
          state,
          transformIntoDocuments(
            result.budgets,
            transformProjectBudgetOptions,
            getQueryParamValue(ref.query, 'language')[0],
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
