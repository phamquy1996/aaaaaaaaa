import {
  CollectionActions,
  CollectionStateSlice,
  getQueryParamValue,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformProjectStats } from './project-stats.transformers';
import { ProjectStatsCollection } from './project-stats.types';

export function projectStatsReducer(
  state: CollectionStateSlice<ProjectStatsCollection> = {},
  action: CollectionActions<ProjectStatsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'projectStats') {
        const { result, ref, order } = action.payload;
        const fromTime = getQueryParamValue(ref.query, 'fromTime')[0];
        const toTime = getQueryParamValue(ref.query, 'toTime')[0];
        return mergeDocuments<ProjectStatsCollection>(
          state,
          transformIntoDocuments([result], transformProjectStats, {
            fromTime: fromTime ? fromTime / 1000 : undefined,
            toTime: toTime ? toTime / 1000 : undefined,
            enterprise: getQueryParamValue(ref.query, 'enterprise')[0],
            projectStatus: getQueryParamValue(ref.query, 'projectStatus')[0],
          }),
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
