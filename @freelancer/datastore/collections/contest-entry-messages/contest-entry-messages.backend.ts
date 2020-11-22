import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { MessageBoardApi } from 'api-typings/contests/contests';
import { ContestEntryMessagesCollection } from './contest-entry-messages.types';

export function contestEntryMessagesBackend(): Backend<
  ContestEntryMessagesCollection
> {
  return {
    defaultOrder: {
      // FIXME: field should be `date_comment` after T81273
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `contests/0.1/entries/${
        getQueryParamValue(query, 'entryId')[0]
      }/messages`,
      // FIXME: Remove these projections after T81273
      params: {
        user_details: 'true',
        user_avatar: 'true',
        user_display_info: 'true',
      },
    }),
    push: (authUid, entryMessage) => ({
      endpoint: 'contests/0.1/messages/',
      method: 'POST',
      payload: {
        board: MessageBoardApi.ENTRY,
        contest_id: entryMessage.contestId,
        entry_id: entryMessage.entryId,
        comment: entryMessage.message.comment,
        parent_id: entryMessage.message.parentId,
      },
    }),
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
