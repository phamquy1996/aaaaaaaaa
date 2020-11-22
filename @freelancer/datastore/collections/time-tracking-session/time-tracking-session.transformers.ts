import { SessionApi } from 'api-typings/timetracker/timetracker';
import { TimeTrackingSession } from './time-tracking-session.model';

export function transformTimeTrackingSession(
  timeTrackingSession: SessionApi,
): TimeTrackingSession {
  if (timeTrackingSession.id === undefined) {
    throw Error(`Time tracking session does not have id`);
  }
  if (timeTrackingSession.time_started === undefined) {
    throw Error(`Time tracking session does not have time started`);
  }
  if (timeTrackingSession.time_last_updated === undefined) {
    throw Error(`Time tracking session does not have time last updated`);
  }
  if (timeTrackingSession.manually_tracked === undefined) {
    throw Error(`Time tracking session does not check manual tracking`);
  }
  if (timeTrackingSession.user_id === undefined) {
    throw Error(`Time tracking session does not have user id`);
  }
  if (timeTrackingSession.project_id === undefined) {
    throw Error(`Time tracking session does not have project id`);
  }
  if (timeTrackingSession.bid_id === undefined) {
    throw Error(`Time tracking session does not have bid id`);
  }

  return {
    id: timeTrackingSession.id,
    timeStarted: timeTrackingSession.time_started * 1000,
    timeLastUpdated: timeTrackingSession.time_last_updated * 1000,
    duration: (timeTrackingSession.invoiceable_time ?? 0) * 1000,
    invoiceId: timeTrackingSession.invoice_id,
    manuallyTracked: timeTrackingSession.manually_tracked,
    userId: timeTrackingSession.user_id,
    projectId: timeTrackingSession.project_id,
    trackeeId: timeTrackingSession.trackee_id,
    bidId: timeTrackingSession.bid_id,
    note: timeTrackingSession.note,
    trackingStoppedTime: timeTrackingSession.tracking_stopped_time
      ? timeTrackingSession.tracking_stopped_time * 1000
      : undefined,
    invoiced: !!timeTrackingSession.invoice_id,
  };
}
