import { generateId } from '@freelancer/datastore/testing';
import { TimeTrackingPunch } from './time-tracking-punches.model';

export interface GenerateTimeTrackingPunchesOptions {
  readonly sessionIds: ReadonlyArray<number>;
  readonly bidId: number;
}

export function generateTimeTrackingPunches({
  sessionIds,
  bidId,
}: GenerateTimeTrackingPunchesOptions): ReadonlyArray<TimeTrackingPunch> {
  return sessionIds.map(sessionId => ({
    id: generateId(),
    sessionId,
    timeCreated: Date.now(),
    bidId,
  }));
}
