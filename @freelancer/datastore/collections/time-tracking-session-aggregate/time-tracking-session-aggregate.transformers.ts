import { TimeTrackingAggregateApi } from 'api-typings/projects/projects';
import {
  TimeTrackingSessionAggregate,
  TimeTrackingSessionAggregateContext,
} from './time-tracking-session-aggregate.model';

export function transformTimeTrackingSessionAggregate(
  timeTrackingSessionAggregate: TimeTrackingAggregateApi,
  context: TimeTrackingSessionAggregateContext,
): TimeTrackingSessionAggregate {
  if (timeTrackingSessionAggregate.date === undefined) {
    throw Error(`Time tracking session aggregate date does not exist`);
  }
  if (timeTrackingSessionAggregate.seconds === undefined) {
    throw Error(`Time tracking session aggregate seconds does not exist`);
  }
  if (timeTrackingSessionAggregate.manually_tracked === undefined) {
    throw Error(
      `Time tracking session aggregate manually tracked does not exist`,
    );
  }

  return {
    id: `${timeTrackingSessionAggregate.date}-${context.id}`,
    bidId: context.id,
    date: timeTrackingSessionAggregate.date * 1000,
    milliseconds: timeTrackingSessionAggregate.seconds * 1000,
    manuallyTracked: timeTrackingSessionAggregate.manually_tracked,
    started: context.started,
    ended: context.ended,
  };
}
