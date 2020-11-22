import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { UserInteractionsCollection } from './user-interactions.types';

export function userInteractionsBackend(): Backend<UserInteractionsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'user/interactions.php',
      isGaf: true,
      params: {
        eventId: getQueryParamValue(query, 'eventId')[0],
        eventName: getQueryParamValue(query, 'eventName')[0],
        otherUserId: getQueryParamValue(query, 'otherUserId')[0],
      },
    }),
    push: (authUid, userInteraction) => ({
      endpoint: 'user/interactions.php',
      isGaf: true,
      asFormData: false,
      payload: {
        eventId: userInteraction.eventId,
        eventName: userInteraction.eventName,
        otherUserId: userInteraction.otherUserId,
      },
    }),
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
