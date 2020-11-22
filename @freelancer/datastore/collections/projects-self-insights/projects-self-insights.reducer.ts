import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformProjectsSelfInsights } from './projects-self-insights.transformer';
import { ProjectsSelfInsightsCollection } from './projects-self-insights.types';

export function projectsSelfInsightsReducer(
  state: CollectionStateSlice<ProjectsSelfInsightsCollection> = {},
  action: CollectionActions<ProjectsSelfInsightsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'projectsSelfInsights') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ProjectsSelfInsightsCollection>(
          state,
          transformIntoDocuments(
            [result],
            transformProjectsSelfInsights,
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
