import {
  CollectionActions,
  CollectionStateSlice,
  getQueryParamValue,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { TimeTrackingSessionAggregateContext } from './time-tracking-session-aggregate.model';
import { transformTimeTrackingSessionAggregate } from './time-tracking-session-aggregate.transformers';
import { TimeTrackingSessionAggregateCollection } from './time-tracking-session-aggregate.types';

export function timeTrackingSessionAggregateReducer(
  state: CollectionStateSlice<TimeTrackingSessionAggregateCollection> = {},
  action: CollectionActions<TimeTrackingSessionAggregateCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'timeTrackingSessionAggregate') {
        const { result, ref, order } = action.payload;
        const context: TimeTrackingSessionAggregateContext = {
          id: getQueryParamValue(ref.query, 'bidId')[0],
          started: getQueryParamValue(ref.query, 'started')[0],
          ended: getQueryParamValue(ref.query, 'ended')[0],
        };

        return mergeDocuments<TimeTrackingSessionAggregateCollection>(
          state,
          transformIntoDocuments(
            result.daily_aggregate,
            transformTimeTrackingSessionAggregate,
            context,
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
