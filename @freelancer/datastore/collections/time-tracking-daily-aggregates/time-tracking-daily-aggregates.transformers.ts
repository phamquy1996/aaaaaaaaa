import { TrackedTimeDailyAggregateApi } from 'api-typings/projects/projects';
import { TimeTrackingDailyAggregate } from './time-tracking-daily-aggregates.model';

export function transformTimeTrackingDailyAggregates(
  dailyAggregate: TrackedTimeDailyAggregateApi,
): TimeTrackingDailyAggregate {
  // yyyy-mm-dd, 2019-01-01
  const dateString = `${dailyAggregate.date.year}-${
    dailyAggregate.date.month < 10 ? 0 : ''
  }${dailyAggregate.date.month}-${dailyAggregate.date.day < 10 ? 0 : ''}${
    dailyAggregate.date.day
  }`;
  return {
    id: `${dailyAggregate.bid_id}-${dateString}`,
    bidId: dailyAggregate.bid_id,
    date: dailyAggregate.date,
    totalTimeTracked: dailyAggregate.total_time_tracked,
    dateString,
  };
}
