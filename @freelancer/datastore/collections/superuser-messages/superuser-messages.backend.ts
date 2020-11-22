import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
  RawQuery,
} from '@freelancer/datastore/core';
import { Message } from '../messages/messages.model';
import { SuperuserMessagesCollection } from './superuser-messages.types';

export function superuserMessagesBackend(): Backend<
  SuperuserMessagesCollection
> {
  return {
    defaultOrder: {
      field: 'timeCreated',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `superuser/0.1/admin_messages`,
      params: {
        thread: getThreadIdQueryParamValue(query),
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
function getThreadIdQueryParamValue(
  query?: RawQuery<Message>,
): number | undefined {
  return getQueryParamValue(query, 'threadId', param =>
    param.condition === '==' ? param.value : undefined,
  )[0];
}
