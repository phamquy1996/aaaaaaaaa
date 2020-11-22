import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
  Params,
} from '@freelancer/datastore/core';
import { TimeTrackingPunchesCollection } from './time-tracking-punches.types';

export function timeTrackingPunchesBackend(): Backend<
  TimeTrackingPunchesCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => {
      const bidId = getQueryParamValue(query, 'bidId')[0];

      if (!bidId) {
        throw Error(`Time tracking punch needs bidId to query`);
      }

      let startTime: number | undefined;
      let endTime: number | undefined;
      let params: Params = {
        session_ids: getQueryParamValue(query, 'sessionId'),
        invoiced: getQueryParamValue(query, 'invoiced')[0],
      };

      const trackingMethods = getQueryParamValue(query, 'trackedMethod');
      if (trackingMethods.length > 0) {
        params = { ...params, tracking_methods: trackingMethods };
      }

      // this check is used when user tries to query punches with
      // datetime range.
      // e.g. query.where('timeCreated', '>=', from_time).
      // where('timeCreated', '<=', to_time).
      if (getQueryParamValue(query, 'timeCreated').length === 2) {
        const time1 = getQueryParamValue(query, 'timeCreated')[0];
        const time2 = getQueryParamValue(query, 'timeCreated')[1];

        if (time1 && time2) {
          // turn them to backend precision
          startTime = Math.min(time1, time2) / 1000;
          endTime = Math.max(time1, time2) / 1000;
        }

        params = { ...params, from_time: startTime, to_time: endTime };
      }

      return {
        endpoint: `projects/0.1/timetracker/${bidId}/punches`,
        params,
      };
    },
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
