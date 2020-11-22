import { WebsocketNPSSubmittedEvent } from '@freelancer/datastore/core';
import { NetPromoterScoreApi } from 'api-typings/users/users';
import { UserNps } from './user-nps.model';

export function transformUserNps(userNps: NetPromoterScoreApi): UserNps {
  if (userNps.id === undefined) {
    throw Error(`User NPS request doesn't have an ID`);
  }

  if (userNps.to_entity_id === undefined) {
    throw Error(`User NPS request doesn't have a to user ID`);
  }

  if (userNps.from_user_id === undefined) {
    throw Error(`User NPS request doesn't have a from user ID`);
  }

  if (userNps.score === undefined) {
    throw Error(`User NPS request doesn't have a score`);
  }

  if (userNps.comment === undefined) {
    throw Error(`User NPS request doesn't have a comment`);
  }

  if (userNps.source === undefined) {
    throw Error(`User NPS request doesn't have a source`);
  }

  if (userNps.source_id === undefined) {
    throw Error(`User NPS request doesn't have a source ID`);
  }

  if (userNps.type === undefined) {
    throw Error(`User NPS request doesn't have a context`);
  }

  return {
    id: userNps.id,
    toUserId: userNps.to_entity_id,
    fromUserId: userNps.from_user_id,
    score: userNps.score,
    comment: userNps.comment,
    sourceType: userNps.source,
    sourceId: userNps.source_id,
    context: userNps.type,
    timestamp: userNps.timestamp ? userNps.timestamp * 1000 : undefined,
  };
}

export function transformWebSocketNps(
  userNps: WebsocketNPSSubmittedEvent,
): UserNps {
  const data = userNps.data.netPromoterScore;

  return {
    id: data.id,
    toUserId: data.to_entity_id,
    fromUserId: data.from_user_id,
    score: data.score,
    comment: data.comment,
    sourceType: data.source,
    sourceId: data.source_id,
    context: data.type,
    timestamp: data.timestamp ? data.timestamp * 1000 : undefined,
  };
}
