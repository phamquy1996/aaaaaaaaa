import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { UserNpsCollection } from './user-nps.types';

export function userNpsBackend(): Backend<UserNpsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'users/0.1/net_promoter_scores/',
      isGaf: false,
      params: {
        from_user_id: getQueryParamValue(query, 'fromUserId')[0],
        to_entity_id: getQueryParamValue(query, 'toUserId')[0],
        source_type: getQueryParamValue(query, 'sourceType')[0],
        source_id: getQueryParamValue(query, 'sourceId')[0],
      },
    }),
    push: (_, userNps) => ({
      endpoint: 'users/0.1/net_promoter_scores/',
      isGaf: false,
      payload: {
        to_entity_id: userNps.toUserId,
        score: userNps.score,
        comment: userNps.comment,
        source_type: userNps.sourceType,
        source_id: userNps.sourceId,
      },
    }),
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
