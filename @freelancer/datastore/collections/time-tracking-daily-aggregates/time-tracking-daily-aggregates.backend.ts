import {
  Backend,
  getBoundedIntervalQueryParamValues,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { TimeTrackingDailyAggregatesCollection } from './time-tracking-daily-aggregates.types';

export function timeTrackingDailyAggregatesBackend(): Backend<
  TimeTrackingDailyAggregatesCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query) => {
      const bidIds = getQueryParamValue(query, 'bidId');
      if (bidIds.length > 1 || !bidIds.length) {
        throw new Error('Can only get one bid daily aggregate a time!');
      }
      const bidId = bidIds[0];
      const dateStringParamValues = getBoundedIntervalQueryParamValues(
        query,
        'dateString',
      );
      if (!dateStringParamValues) {
        throw new Error(
          'Must supply a start and a end date for daily aggregates!',
        );
      }

      const [startDateString, endDateString] = dateStringParamValues;
      const startDate = new Date(startDateString);
      const endDate = new Date(endDateString);

      return {
        endpoint: `projects/0.1/bids/${bidId}/time_tracking_aggregates/`,
        isGaf: false,
        params: {
          start_day: startDate.getDate(),
          start_month: startDate.getMonth() + 1, // getMonth base from 0
          start_year: startDate.getFullYear(),
          end_day: endDate.getDate(),
          end_month: endDate.getMonth() + 1,
          end_year: endDate.getFullYear(),
        },
      };
    },
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
