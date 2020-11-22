import { WebsocketContestEntryCreatedEvent } from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import { ContestViewNewOrUpdatedEntry } from './contest-view-new-or-updated-entries.model';

export function transformWebsocketEntryCreatedEvent(
  event: WebsocketContestEntryCreatedEvent,
): ContestViewNewOrUpdatedEntry {
  return {
    id: toNumber(event.data.entryId),
    contestId: toNumber(event.data.contestId),
  };
}
