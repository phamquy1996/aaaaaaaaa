import { PunchApi } from 'api-typings/timetracker/timetracker';
import { TimeTrackingPunch } from './time-tracking-punches.model';

export function transformTimeTrackingPunches(
  timeTrackingPunch: PunchApi,
): TimeTrackingPunch {
  // back end need to change id to required. :)
  if (timeTrackingPunch.id === undefined) {
    throw Error(`Time tracking punch response does not have id`);
  }

  if (timeTrackingPunch.session_id === undefined) {
    throw Error(`Time tracking punch response does not have session_id`);
  }

  if (timeTrackingPunch.time_created === undefined) {
    throw Error(`Time tracking punch response does not have time_created`);
  }

  if (timeTrackingPunch.bid_id === undefined) {
    throw Error(`Time tracking punch response does not have bid_id`);
  }

  return {
    id: timeTrackingPunch.id,
    sessionId: timeTrackingPunch.session_id,
    timeCreated: timeTrackingPunch.time_created * 1000,
    note: timeTrackingPunch.note,
    screenshot: timeTrackingPunch.screenshot,
    timeDeleted: timeTrackingPunch.time_deleted
      ? timeTrackingPunch.time_deleted * 1000
      : undefined,
    start: timeTrackingPunch.start,
    pause: timeTrackingPunch.pause,
    keystrokeCount: timeTrackingPunch.keystroke_count,
    mouseclickCount: timeTrackingPunch.mouseclick_count,
    teamId: timeTrackingPunch.team_id,
    bidId: timeTrackingPunch.bid_id,
    url: timeTrackingPunch.url,
    trackedMethod: timeTrackingPunch.tracking_method,
    invoiced: timeTrackingPunch.invoiced,
  };
}
