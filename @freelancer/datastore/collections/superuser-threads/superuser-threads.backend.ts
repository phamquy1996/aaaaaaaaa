import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
  RawQuery,
} from '@freelancer/datastore/core';
import { isDefined } from '@freelancer/utils';
import { ContextTypeApi } from 'api-typings/messages/messages_types';
import { SuperuserThread } from './superuser-threads.model';
import { SuperuserThreadsCollection } from './superuser-threads.types';

export function superuserThreadsBackend(): Backend<SuperuserThreadsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `superuser/0.1/admin_threads`,
      params: {
        threads: ids,
        context_type: getThreadContextTypeQueryParamValue(query),
        contexts: getThreadContextIdsQueryParamValue(query),
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}

/**
 * This function is used to get the context type from a query. If there is only
 * one "Context" provided, we get that type. If there are multiple "Context" objects,
 * we get the type of the first one. Note that they should all be of the same type
 * so that is fine, this is what the backend expects.
 */
function getThreadContextTypeQueryParamValue(
  query?: RawQuery<SuperuserThread>,
): ContextTypeApi | undefined {
  return (getQueryParamValue(query, 'context', param =>
    param.condition === '=='
      ? param.value.type
      : param.condition === 'in' && param.values && param.values.length
      ? param.values.map(v => v.type)
      : undefined,
  ) as ReadonlyArray<ContextTypeApi | undefined>)[0];
}

function getThreadContextIdsQueryParamValue(
  query?: RawQuery<SuperuserThread>,
): ReadonlyArray<number> {
  return getQueryParamValue(query, 'context')
    .map(context =>
      context.type !== ContextTypeApi.NONE ? context.id : undefined,
    )
    .filter(isDefined);
}
