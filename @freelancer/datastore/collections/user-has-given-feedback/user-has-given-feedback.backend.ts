import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { UserHasGivenFeedbackCollection } from './user-has-given-feedback.types';

export function userHasGivenFeedbackBackend(): Backend<
  UserHasGivenFeedbackCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'projects/getHasGivenFeedback.php',
      isGaf: true,
      params: {
        projectId: getQueryParamValue(query, 'projectId')[0],
        toUserIds: getQueryParamValue(query, 'toUserId'),
        fromUserId: getQueryParamValue(query, 'fromUserId')[0],
        reviewType: getQueryParamValue(query, 'reviewType')[0],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
