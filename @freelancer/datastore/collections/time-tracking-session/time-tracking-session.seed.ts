import { generateId } from '@freelancer/datastore/testing';
import { Bid } from '../bids/bids.model';
import { TimeTrackingSession } from './time-tracking-session.model';

export interface GenerateTimeTrackingSessionOptions {
  readonly projectId: number;
  readonly userId: number;
  readonly bidId: number;
  readonly manuallyTracked?: boolean;
  readonly timeStarted?: number;
  readonly duration?: number;
  readonly invoiced?: boolean;
  readonly timeLastUpdated?: number;
  readonly note?: string;
}

export function timeTrackingSessionFromBid(
  bid: Bid,
): Pick<GenerateTimeTrackingSessionOptions, 'projectId' | 'userId' | 'bidId'> {
  return {
    projectId: bid.projectId,
    userId: bid.bidderId,
    bidId: bid.id,
  };
}

export function generateTimeTrackingSession({
  projectId,
  userId,
  bidId,
  manuallyTracked = true,
  timeStarted = Date.now(),
  duration = 3600 * 1000,
  invoiced = false,
  timeLastUpdated = Date.now(),
  note,
}: GenerateTimeTrackingSessionOptions): TimeTrackingSession {
  return {
    id: generateId(),
    timeStarted,
    duration,
    manuallyTracked,
    userId,
    projectId,
    bidId,
    timeLastUpdated,
    invoiced,
    note,
  };
}
