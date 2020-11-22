import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { TimeTrackingSessionAggregateCollection } from './time-tracking-session-aggregate.types';

export function timeTrackingSessionAggregateBackend(): Backend<
  TimeTrackingSessionAggregateCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `projects/0.1/bids/${getQueryParamValue(
        query,
        'bidId',
      )}/time_tracking_sessions/`,
      params: {
        daily_aggregate_details: 'true',
        from_time: getQueryParamValue(query, 'started')[0],
        to_time: getQueryParamValue(query, 'ended')[0],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
