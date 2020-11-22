import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformContestsSelfInsights } from './contests-self-insights.transformer';
import { ContestsSelfInsightsCollection } from './contests-self-insights.types';

export function contestsSelfInsightsReducer(
  state: CollectionStateSlice<ContestsSelfInsightsCollection> = {},
  action: CollectionActions<ContestsSelfInsightsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'contestsSelfInsights') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ContestsSelfInsightsCollection>(
          state,
          transformIntoDocuments(
            [result],
            transformContestsSelfInsights,
            ref.path.authUid,
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
