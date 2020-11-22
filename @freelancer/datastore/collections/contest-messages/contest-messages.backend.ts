import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { MessageBoardApi } from 'api-typings/contests/contests';
import { ContestMessagesCollection } from './contest-messages.types';

export function contestMessagesBackend(): Backend<ContestMessagesCollection> {
  return {
    defaultOrder: {
      // FIXME: field should be `date_comment` after T81273
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `contests/0.1/contests/${
        getQueryParamValue(query, 'contestId')[0]
      }/messages`,
      // FIXME: Remove these projections after T81273
      params: {
        user_details: 'true',
        user_avatar: 'true',
        user_display_info: 'true',
      },
    }),
    push: (authUid, contestMessage) => ({
      endpoint: 'contests/0.1/messages/',
      method: 'POST',
      payload: {
        board: MessageBoardApi.CVP,
        contest_id: contestMessage.contestId,
        comment: contestMessage.message.comment,
        parent_id: contestMessage.message.parentId,
      },
    }),
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
