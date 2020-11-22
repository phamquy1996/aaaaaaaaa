import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformTimeTrackingDailyAggregates } from './time-tracking-daily-aggregates.transformers';
import { TimeTrackingDailyAggregatesCollection } from './time-tracking-daily-aggregates.types';

export function timeTrackingDailyAggregatesReducer(
  state: CollectionStateSlice<TimeTrackingDailyAggregatesCollection> = {},
  action: CollectionActions<TimeTrackingDailyAggregatesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'timeTrackingDailyAggregates') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<TimeTrackingDailyAggregatesCollection>(
          state,
          transformIntoDocuments(
            result.daily_aggregates,
            transformTimeTrackingDailyAggregates,
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
